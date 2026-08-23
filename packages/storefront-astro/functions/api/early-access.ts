// Cloudflare Pages Edge Function for Early Access Lead Ingestion (Hardened)

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const onRequestPost = async ({ request, env }: { request: Request; env?: Record<string, any> }) => {
  try {
    const rawBody = await request.json() as Record<string, unknown>
    if (!rawBody || typeof rawBody !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Payload tidak valid.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const picName = typeof rawBody.picName === 'string' ? rawBody.picName.trim().slice(0, 80) : ''
    const storeName = typeof rawBody.storeName === 'string' ? rawBody.storeName.trim().slice(0, 80) : ''
    const city = typeof rawBody.city === 'string' ? rawBody.city.trim().slice(0, 80) : ''
    const businessType = typeof rawBody.businessType === 'string' && ['cafe', 'resto', 'retail', 'other'].includes(rawBody.businessType)
      ? rawBody.businessType
      : 'cafe'
    const branchCount = typeof rawBody.branchCount === 'string' && ['1', '2-5', '>5'].includes(rawBody.branchCount)
      ? rawBody.branchCount
      : '1'
    const rawWhatsapp = typeof rawBody.whatsapp === 'string' ? rawBody.whatsapp.trim().slice(0, 25) : ''

    // Validation
    const phoneRegex = /^[0-9+() -]{8,25}$/
    if (!storeName || !rawWhatsapp || !phoneRegex.test(rawWhatsapp)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Nama toko dan nomor WhatsApp yang valid (8-25 digit) wajib diisi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const recipientEmail = 'hello@hfeit.com'
    const leadId = `LEAD-${Date.now()}`
    const receivedAt = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })

    // Privacy-minimized operational logging (Zero PII in edge logs)
    console.log(`[EARLY_ACCESS_LEAD]: leadId=${leadId}, branchCount=${branchCount}, hasCity=${Boolean(city)}, ts=${new Date().toISOString()}`)

    const resendApiKey = env?.RESEND_API_KEY || (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined)
    if (resendApiKey) {
      const sanitizedPicName = escapeHtml(picName || '-')
      const sanitizedStoreName = escapeHtml(storeName)
      const sanitizedCity = escapeHtml(city || '-')
      const cleanWaDigits = rawWhatsapp.replace(/[^0-9]/g, '')

      const mailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'POS.Hfeit Lead Bot <leads@hfeit.com>',
          to: [recipientEmail],
          subject: `🔔 [Early Access Pilot] Pendaftar Baru: ${sanitizedStoreName} (${sanitizedCity})`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px; color: #18181b;">
              <h2 style="color: #4f46e5; margin-top: 0;">🚀 Pendaftaran Early Access Baru (Batch 01)</h2>
              <p style="color: #71717a; font-size: 14px;">Ada calon merchant baru yang mengajukan permohonan aktivasi POS.Hfeit:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Nama PIC:</td><td style="padding: 8px 0;">${sanitizedPicName}</td></tr>
                <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Nama Toko:</td><td style="padding: 8px 0; font-weight: bold; color: #09090b;">${sanitizedStoreName}</td></tr>
                <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Jenis Usaha:</td><td style="padding: 8px 0;">${escapeHtml(businessType)}</td></tr>
                <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Jumlah Cabang:</td><td style="padding: 8px 0;">${escapeHtml(branchCount)} Outlet</td></tr>
                <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Nomor WhatsApp:</td><td style="padding: 8px 0;"><a href="https://wa.me/${cleanWaDigits}" style="color: #10b981; font-weight: bold;">${escapeHtml(rawWhatsapp)} (Buka WhatsApp)</a></td></tr>
                <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Kota Usaha:</td><td style="padding: 8px 0;">${sanitizedCity}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Waktu Masuk:</td><td style="padding: 8px 0; color: #71717a;">${receivedAt}</td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
              <p style="font-size: 12px; color: #a1a1aa; margin-bottom: 0;">POS.Hfeit Pilot Lead Dispatcher &bull; HFE IT Ecosystem</p>
            </div>
          `
        })
      })

      if (!mailRes.ok) {
        const mailErrText = await mailRes.text()
        console.error(`[RESEND_ERROR]: status=${mailRes.status}, err=${mailErrText.slice(0, 100)}`)
        return new Response(
          JSON.stringify({ success: false, error: 'Layanan notifikasi sedang sibuk. Silakan coba kembali sesaat lagi.' }),
          { status: 502, headers: { 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Permohonan akses awal berhasil diterima. Tim HFE akan menghubungi Anda melalui WhatsApp dalam 1x24 jam.',
        leadId,
        forwardedTo: recipientEmail
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Gagal memproses permohonan.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
