// Cloudflare Pages Edge Function for Early Access Lead Ingestion
export const onRequestPost = async ({ request, env }: { request: Request; env?: Record<string, any> }) => {
  try {
    const body = await request.json() as {
      picName?: string
      storeName?: string
      businessType?: string
      branchCount?: string
      whatsapp?: string
      city?: string
    }

    // Defensive validation
    if (!body.whatsapp || !body.storeName) {
      return new Response(
        JSON.stringify({ success: false, error: 'Data toko dan nomor WhatsApp wajib diisi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const recipientEmail = 'hello@hfeit.com'
    const leadId = `LEAD-${Date.now()}`
    const receivedAt = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })

    // Structured lead payload
    const leadRecord = {
      leadId,
      picName: body.picName || 'N/A',
      storeName: body.storeName,
      businessType: body.businessType || 'cafe',
      branchCount: body.branchCount || '1',
      whatsapp: body.whatsapp,
      city: body.city || 'N/A',
      targetNotificationEmail: recipientEmail,
      receivedAt,
      source: 'pos.hfeit.com (Early Access Form Batch 01)'
    }

    console.log(`[EARLY ACCESS LEAD -> ${recipientEmail}]:`, JSON.stringify(leadRecord, null, 2))

    // If Resend / Webhook key is present in environment, dispatch email directly
    const resendApiKey = env?.RESEND_API_KEY || (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined)
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'POS.Hfeit Lead Bot <leads@hfeit.com>',
            to: [recipientEmail],
            subject: `🔔 [Early Access Pilot] Pendaftar Baru: ${body.storeName} (${body.city || 'ID'})`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px; color: #18181b;">
                <h2 style="color: #4f46e5; margin-top: 0;">🚀 Pendaftaran Early Access Baru (Batch 01)</h2>
                <p style="color: #71717a; font-size: 14px;">Ada calon merchant baru yang mengajukan permohonan aktivasi POS.Hfeit:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                  <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Nama PIC:</td><td style="padding: 8px 0;">${body.picName || '-'}</td></tr>
                  <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Nama Toko:</td><td style="padding: 8px 0; font-weight: bold; color: #09090b;">${body.storeName}</td></tr>
                  <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Jenis Usaha:</td><td style="padding: 8px 0;">${body.businessType}</td></tr>
                  <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Jumlah Cabang:</td><td style="padding: 8px 0;">${body.branchCount} Outlet</td></tr>
                  <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Nomor WhatsApp:</td><td style="padding: 8px 0;"><a href="https://wa.me/${body.whatsapp.replace(/[^0-9]/g, '')}" style="color: #10b981; font-weight: bold;">${body.whatsapp} (Buka WhatsApp)</a></td></tr>
                  <tr style="border-bottom: 1px solid #f4f4f5;"><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Kota Usaha:</td><td style="padding: 8px 0;">${body.city || '-'}</td></tr>
                  <tr><td style="padding: 8px 0; font-weight: bold; color: #52525b;">Waktu Masuk:</td><td style="padding: 8px 0; color: #71717a;">${receivedAt}</td></tr>
                </table>
                <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
                <p style="font-size: 12px; color: #a1a1aa; margin-bottom: 0;">POS.Hfeit Pilot Lead Dispatcher &bull; HFE IT Ecosystem</p>
              </div>
            `
          })
        })
      } catch (mailErr) {
        console.error('[Resend Dispatch Error]', mailErr)
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
