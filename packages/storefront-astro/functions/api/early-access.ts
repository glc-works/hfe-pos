// Cloudflare Pages Edge Function for Early Access Lead Ingestion
export const onRequestPost = async ({ request }: { request: Request }) => {
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

    // Structured lead record
    const leadRecord = {
      ...body,
      receivedAt: new Date().toISOString(),
      source: 'pos.hfeit.com',
      batch: 'BATCH_01_PILOT',
      status: 'pending_contact'
    }

    console.log('[Early Access New Pilot Merchant]', JSON.stringify(leadRecord))

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Permohonan akses awal berhasil diterima. Tim HFE akan menghubungi Anda melalui WhatsApp dalam 1x24 jam.',
        leadId: `LEAD-${Date.now()}`
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
