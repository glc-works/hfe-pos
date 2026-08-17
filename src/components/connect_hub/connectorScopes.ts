export interface PermissionScopeItem {
  id: string
  label: string
  desc: string
}

export const CONNECTOR_PERMISSION_SCOPES: Record<string, PermissionScopeItem[]> = {
  accounting: [
    { id: 'ledger:post', label: 'ledger:post', desc: 'Post otomatis general journal entries ke COA' },
    { id: 'accounts:read', label: 'accounts:read', desc: 'Baca master Chart of Accounts (COA)' },
    { id: 'tax:sync', label: 'tax:sync', desc: 'Sinkronisasi PPN 11% dan akun pajak keluaran/masukan' },
    { id: 'reconcile:write', label: 'reconcile:write', desc: 'Auto-reconcile bank clearing accounts' }
  ],
  banking: [
    { id: 'banking:read', label: 'banking:read', desc: 'Inquiry saldo rekening dan mutasi rekening koran' },
    { id: 'statements:write', label: 'statements:write', desc: 'Auto-ingest bank feed transaksi ke ledger' },
    { id: 'transfers:bi_fast', label: 'transfers:bi_fast', desc: 'Eksekusi batch settlement via BI-FAST / FAST' },
    { id: 'va:manage', label: 'va:manage', desc: 'Generate dynamic virtual accounts per invoice' }
  ],
  payments: [
    { id: 'payments:charge', label: 'payments:charge', desc: 'Proses pembayaran QRIS, e-wallet, dan kartu' },
    { id: 'refunds:write', label: 'refunds:write', desc: 'Terbitkan refund dan jurnal pembalik otomatis' },
    { id: 'webhooks:listen', label: 'webhooks:listen', desc: 'Ingest real-time webhook notifikasi pembayaran' },
    { id: 'settlement:read', label: 'settlement:read', desc: 'Unduh rekap settlement dan fee MDR' }
  ],
  ecommerce: [
    { id: 'sales:read_write', label: 'sales:read_write', desc: 'Sinkronisasi pesanan, diskon, dan komisi platform' },
    { id: 'inventory:sync', label: 'inventory:sync', desc: 'Update stok multi-channel real-time' },
    { id: 'payouts:read', label: 'payouts:read', desc: 'Rekonsiliasi net payout harian ke buku kasir' }
  ],
  pos: [
    { id: 'pos:shift_close', label: 'pos:shift_close', desc: 'Ingest ringkasan shift kasir X/Z report' },
    { id: 'sales:write', label: 'sales:write', desc: 'Kirim struk penjualan dan split-bill pesanan' },
    { id: 'cogs:deplete', label: 'cogs:deplete', desc: 'Pengurangan stok bahan baku berbasis Resep/BOM' }
  ],
  tax: [
    { id: 'tax:efaktur_generate', label: 'tax:efaktur_generate', desc: 'Generate e-Faktur dan nomor seri faktur pajak' },
    { id: 'tax:filing_submit', label: 'tax:filing_submit', desc: 'Submit SPT masa PPN / PPh ke DJP CoreTax' },
    { id: 'tax:audit_read', label: 'tax:audit_read', desc: 'Export tax audit ledger untuk kepatuhan fiskal' }
  ]
}
