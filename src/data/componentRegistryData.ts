export interface ComponentDocItem {
  id: string
  title: string
  category: 'Cashier POS' | 'Customer QR' | 'Back-Office' | 'Global UI'
  ruleRef: string
  description: string
  dos: string[]
  donts: string[]
  snippet: string
}

export const COMPONENT_REGISTRY: ComponentDocItem[] = [
  {
    id: 'payment-method-grid',
    title: 'PaymentMethodGrid',
    category: 'Cashier POS',
    ruleRef: 'Rule 9: Anti-Bleeding & Single-Line Heuristic (GLC-FNB-UX-009)',
    description: 'Grid pilihan metode bayar utama kasir (Cash, QRIS, Kartu) yang dioptimasi untuk layar smartphone 380px tanpa teks terbelah.',
    dos: [
      'Gunakan label 1 kata padat (Cash, QRIS, Kartu) dengan whitespace-nowrap.',
      'Jaga tinggi tombol tetap simetris pada mode grid 3 kolom.',
      'Sertakan ikon visual di sebelah kiri label untuk kecepatan scan mata kasir.'
    ],
    donts: [
      'DILARANG menambahkan teks kurung panjang seperti "Kartu (CC/Debit)" yang membelah tombol jadi 2 baris.',
      'DILARANG membuat tombol dengan tinggi yang tidak rata (ragged button height).'
    ],
    snippet: `<div className="grid grid-cols-3 gap-1.5 pt-1">
  <button className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 bg-white text-slate-950 font-extrabold shadow-md">
    <Banknote className="w-3.5 h-3.5" /> <span>Cash</span>
  </button>
  <button className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 bg-slate-950 border-slate-800 text-slate-400">
    <QrCode className="w-3.5 h-3.5" /> <span>QRIS</span>
  </button>
  <button className="py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 bg-slate-950 border-slate-800 text-slate-400">
    <CreditCard className="w-3.5 h-3.5" /> <span>Kartu</span>
  </button>
</div>`
  },
  {
    id: 'product-card',
    title: 'ProductCard',
    category: 'Customer QR',
    ruleRef: 'Rule 9: Anti-Bleeding Currency Heuristic (GLC-FNB-UX-009)',
    description: 'Kartu etalase produk pada menu QR pelanggan dengan gambar hero, proteksi overflow judul, dan harga anti-pecah.',
    dos: [
      'Bungkus label harga dengan "whitespace-nowrap font-mono font-bold shrink-0".',
      'Proteksi judul menu panjang dengan "truncate min-w-0 pr-1".',
      'Tombol "+ Tambah" langsung menambahkan ke keranjang tanpa membuka modal jika produk tanpa modifier.'
    ],
    donts: [
      'DILARANG membiarkan kata "Rp" terbelah di atas dan angka "35.000" di bawah.',
      'DILARANG membiarkan judul yang terlalu panjang mendesak harga keluar layar.'
    ],
    snippet: `<div className="border border-slate-800/80 p-3 flex gap-3 rounded-2xl bg-slate-900 shadow-lg">
  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
  <div className="flex-1 flex flex-col justify-between min-w-0">
    <div className="flex items-center justify-between gap-2">
      <h4 className="font-bold text-sm text-slate-100 truncate">{item.name}</h4>
      <span className="text-xs font-bold font-mono text-amber-400 whitespace-nowrap shrink-0">
        Rp {item.price.toLocaleString('id-ID')}
      </span>
    </div>
    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>
    <div className="flex justify-end mt-2">
      <button className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl">
        + Tambah
      </button>
    </div>
  </div>
</div>`
  },
  {
    id: 'table-status-card',
    title: 'TableStatusCard',
    category: 'Cashier POS',
    ruleRef: 'Rule 8: Visual Table State & Anti-Walkout Heuristic (GLC-FNB-UX-008)',
    description: 'Kartu denah meja kasir dengan indikator visual 3-warna tegas untuk membedakan tamu yang belum bayar vs sudah bayar.',
    dos: [
      'Gunakan warna Kuning/Amber untuk status "⏳ Belum Bayar" (Open-Tab).',
      'Gunakan warna Biru/Indigo untuk status "✅ Lunas" (Pre-Paid).',
      'Gunakan warna Hijau untuk status "🟢 Meja Kosong".',
      'Tampilkan total tagihan aktif dengan font monospace tebal.'
    ],
    donts: [
      'DILARANG membiarkan status pembayaran ambigu di layar kasir.',
      'DILARANG menyembunyikan nama tamu yang sudah terikat ke meja.'
    ],
    snippet: `<div className="border border-amber-500/60 bg-amber-500/10 rounded-2xl p-3 flex flex-col justify-between h-32 relative overflow-hidden">
  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500" />
  <div className="flex items-center justify-between pl-1">
    <span className="font-mono font-bold text-xs text-white">MEJA-04</span>
    <span className="text-[9px] font-extrabold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full">
      ⏳ Belum Bayar
    </span>
  </div>
  <div className="pl-1">
    <p className="text-slate-300 text-xs font-semibold">Aldi (2 Tamu)</p>
    <p className="font-mono text-xs font-black text-amber-400">Rp 86.000</p>
  </div>
</div>`
  },
  {
    id: 'floating-cart-dock',
    title: 'FloatingCartDock',
    category: 'Customer QR',
    ruleRef: 'Rule 7: 3-Layer 100dvh & iOS Safe-Area Heuristic (GLC-FNB-UX-007)',
    description: 'Dock keranjang melayang di bagian bawah layar smartphone pelanggan dengan proteksi penuh dari URL pill Safari.',
    dos: [
      'Gunakan padding bawah responsif "pb-[max(env(safe-area-inset-bottom,20px),20px)]".',
      'Tampilkan jumlah menu dan total harga dalam 2 baris tegas di sebelah kiri.',
      'Tombol "Checkout ➔" memiliki kontras tinggi dan mudah ditekan jempol.'
    ],
    donts: [
      'DILARANG meletakkan cart dock di dalam container yang ikut ter-scroll.',
      'DILARANG membiarkan teks harga terpotong garis batas browser iPhone.'
    ],
    snippet: `<div className="shrink-0 z-40 px-3 pt-1 pb-[max(env(safe-area-inset-bottom,20px),20px)] bg-gradient-to-t from-slate-950 flex justify-center">
  <div className="w-full max-w-md bg-slate-900 border border-amber-500/60 rounded-2xl px-3.5 py-2.5 shadow-2xl flex items-center justify-between font-bold min-h-[64px]">
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-mono font-black text-xs relative shrink-0">
        <ShoppingCart className="w-4 h-4" />
        <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
      </div>
      <div className="flex flex-col text-left leading-tight min-w-0">
        <span className="text-[10px] uppercase font-bold text-slate-400">Keranjang (3 menu)</span>
        <h4 className="text-sm font-black font-mono text-amber-400 whitespace-nowrap">Rp 124.600</h4>
      </div>
    </div>
    <button className="bg-amber-500 text-slate-950 px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5">
      <span>Checkout</span> <ArrowRight className="w-3.5 h-3.5" />
    </button>
  </div>
</div>`
  },
  {
    id: 'card-settlement-edc',
    title: 'CardSettlementEdc',
    category: 'Cashier POS',
    ruleRef: 'Rule 6: Zero-Redundancy BIN Auto-Detection Heuristic (GLC-FNB-UX-006)',
    description: 'Panel settlement kartu mesin EDC kasir yang mendeteksi jaringan kartu secara otomatis dari 4 digit depan.',
    dos: [
      'Deteksi otomatis jaringan kartu (Visa, Mastercard, GPN, Amex, JCB) dari 4 digit BIN.',
      'Tampilkan format rekon struk dalam 1 strip rapi (Bank • Jaringan • Masked Number).',
      'Hanya minta input esensial: Bank EDC, 4 digit depan, 3 digit belakang, dan No. Approval.'
    ],
    donts: [
      'DILARANG menanyakan tombol jaringan kartu manual jika sistem sudah tahu dari 4 digit depan.',
      'DILARANG menumpuk belasan tombol varian kartu yang memakan setengah layar drawer.'
    ],
    snippet: `<div className="bg-slate-900 border border-slate-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-inner">
  <div className="flex items-center gap-2 min-w-0">
    <span className="text-[10px] font-extrabold uppercase bg-indigo-500 text-white px-2 py-0.5 rounded-md font-mono">
      VISA
    </span>
    <span className="text-xs font-mono font-bold text-slate-200 truncate">
      BCA EDC • 4123-***-789
    </span>
  </div>
  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
    Auto-Detected
  </span>
</div>`
  }
]
