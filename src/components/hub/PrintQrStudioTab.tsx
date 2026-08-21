import React, { useState } from 'react'
import { Card, Button, Badge, TextInput } from '../../ui'
import { QrCode, Printer, Download, Eye, Wifi, Sparkles, CheckCircle2 } from 'lucide-react'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

export function PrintQrStudioTab() {
  const config = useMerchantConfig()
  const [tableCount, setTableCount] = useState(20)
  const [wifiSsid, setWifiSsid] = useState('Kopi Nusantara Free WiFi')
  const [wifiPass, setWifiPass] = useState('kopinikmat2026')
  const [previewItem, setPreviewItem] = useState<'stickers' | 'standee' | 'wifi'>('stickers')
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null)

  const handleDownloadPdf = (type: string) => {
    setDownloadSuccess(type)
    setTimeout(() => setDownloadSuccess(null), 2500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <QrCode className="w-4 h-4 text-primary" /> Print & QR Studio
          </h3>
          <p className="text-xs text-muted-foreground">
            Cetak stiker QR Meja, Standee Akrilik Kasir, dan Tent Card WiFi siap pakai tanpa perlu desain ulang
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs font-semibold">
            <Printer className="w-3.5 h-3.5 mr-1" /> Cetak Langsung
          </Button>
        </div>
      </div>

      {/* 3 Print Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Template 1: Table QR Stickers */}
        <Card className={`p-5 flex flex-col justify-between cursor-pointer border-2 transition-all ${
          previewItem === 'stickers' ? 'border-primary shadow-lg bg-primary/5' : 'border-border hover:border-border/80'
        }`} onClick={() => setPreviewItem('stickers')}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-primary/10 text-primary">
                <QrCode className="w-5 h-5" />
              </span>
              <Badge variant="outline" className="text-[10px]">A4 Format (6 Meja / Lembar)</Badge>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Stiker QR Meja (Batch PDF)</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Download PDF stiker meja 01 s/d {tableCount} dengan panduan garis potong rapi dan logo toko.
              </p>
            </div>
            <div className="pt-2">
              <label className="text-[11px] text-muted-foreground block mb-1">Jumlah Meja Aktif</label>
              <TextInput 
                type="number" 
                value={tableCount.toString()} 
                onChange={(e) => setTableCount(Number(e.target.value) || 1)}
                className="font-mono text-xs"
              />
            </div>
          </div>
          <Button 
            className="w-full mt-4 text-xs font-bold" 
            onClick={(e) => { e.stopPropagation(); handleDownloadPdf('stickers'); }}
          >
            {downloadSuccess === 'stickers' ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Berkas PDF Diunduh
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Unduh PDF A4 Stiker Meja
              </span>
            )}
          </Button>
        </Card>

        {/* Template 2: Standee Akrilik QRIS Kasir */}
        <Card className={`p-5 flex flex-col justify-between cursor-pointer border-2 transition-all ${
          previewItem === 'standee' ? 'border-primary shadow-lg bg-primary/5' : 'border-border hover:border-border/80'
        }`} onClick={() => setPreviewItem('standee')}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <Badge variant="outline" className="text-[10px]">A5 Standee / Tent</Badge>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Standee Akrilik QRIS Kasir</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Format resmi QRIS Statis kasir dengan bingkai branding toko, logo GPN, dan instruksi bayar.
              </p>
            </div>
            <div className="p-2.5 rounded bg-muted/40 text-[11px] text-muted-foreground space-y-1">
              <div><strong>NMID:</strong> <span className="font-mono">ID1020039281726</span></div>
              <div><strong>Merchant:</strong> {config.storeName || 'Kopi Nusantara'}</div>
            </div>
          </div>
          <Button 
            className="w-full mt-4 text-xs font-bold"
            onClick={(e) => { e.stopPropagation(); handleDownloadPdf('standee'); }}
          >
            {downloadSuccess === 'standee' ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Berkas PDF Diunduh
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Unduh PDF Standee A5
              </span>
            )}
          </Button>
        </Card>

        {/* Template 3: Tent Card WiFi Meja */}
        <Card className={`p-5 flex flex-col justify-between cursor-pointer border-2 transition-all ${
          previewItem === 'wifi' ? 'border-primary shadow-lg bg-primary/5' : 'border-border hover:border-border/80'
        }`} onClick={() => setPreviewItem('wifi')}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Wifi className="w-5 h-5" />
              </span>
              <Badge variant="outline" className="text-[10px]">Tent Card Segitiga</Badge>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Tent Card WiFi & Greeting</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Kartu segitiga meja dengan QR auto-connect WiFi dan sambutan ramah untuk pengunjung.
              </p>
            </div>
            <div className="space-y-2 pt-1 text-xs">
              <TextInput 
                placeholder="Nama WiFi (SSID)" 
                value={wifiSsid} 
                onChange={(e) => setWifiSsid(e.target.value)}
                className="text-xs"
              />
              <TextInput 
                placeholder="Password WiFi" 
                value={wifiPass} 
                onChange={(e) => setWifiPass(e.target.value)}
                className="text-xs font-mono"
              />
            </div>
          </div>
          <Button 
            className="w-full mt-4 text-xs font-bold"
            onClick={(e) => { e.stopPropagation(); handleDownloadPdf('wifi'); }}
          >
            {downloadSuccess === 'wifi' ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Berkas PDF Diunduh
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Unduh PDF Tent Card
              </span>
            )}
          </Button>
        </Card>
      </div>

      {/* Live Interactive Preview Canvas */}
      <Card className="p-6 bg-muted/20 border-dashed">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" /> Pratinjau Desain Cetak: {
              previewItem === 'stickers' ? 'Stiker Meja A4' : previewItem === 'standee' ? 'Standee QRIS Kasir A5' : 'Tent Card WiFi'
            }
          </div>
          <span className="text-[11px] text-muted-foreground">300 DPI High-Resolution Ready</span>
        </div>

        {/* Dynamic Mockup Viewport */}
        <div className="flex justify-center p-6 bg-background rounded-xl border border-border shadow-inner">
          {previewItem === 'stickers' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg w-full">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="p-4 rounded-xl border-2 border-border/80 bg-card text-center space-y-2 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {config.storeName || 'Kopi Nusantara'}
                  </div>
                  <div className="w-20 h-20 mx-auto bg-muted/50 rounded-lg flex items-center justify-center border border-border">
                    <QrCode className="w-14 h-14 text-foreground/80" />
                  </div>
                  <div className="text-xs font-mono font-bold text-primary">
                    MEJA {num < 10 ? `0${num}` : num}
                  </div>
                  <div className="text-[9px] text-muted-foreground">
                    Pindai untuk Pesan & Bayar
                  </div>
                </div>
              ))}
            </div>
          )}

          {previewItem === 'standee' && (
            <div className="p-6 rounded-2xl border-2 border-primary/40 bg-card text-center space-y-4 max-w-sm w-full shadow-md">
              <div className="text-xs font-bold uppercase tracking-widest text-primary">
                PEMBAYARAN RESMI QRIS
              </div>
              <h3 className="text-base font-bold text-foreground">
                {config.storeName || 'Kopi Nusantara'}
              </h3>
              <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl border-2 border-border shadow-sm flex items-center justify-center">
                <QrCode className="w-36 h-36 text-black" />
              </div>
              <div className="text-xs font-mono text-muted-foreground">
                NMID: ID1020039281726
              </div>
              <div className="text-[10px] text-muted-foreground pt-2 border-t border-border flex justify-center gap-2">
                <span>BCA</span> • <span>GoPay</span> • <span>OVO</span> • <span>Dana</span> • <span>ShopeePay</span>
              </div>
            </div>
          )}

          {previewItem === 'wifi' && (
            <div className="p-6 rounded-2xl border-2 border-blue-500/40 bg-card text-center space-y-4 max-w-sm w-full shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
                <Wifi className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Selamat Datang di {config.storeName || 'Kopi Nusantara'}</h4>
              <div className="p-3 rounded-xl bg-muted/40 space-y-1 font-mono text-xs">
                <div><span className="text-muted-foreground">WiFi:</span> <strong>{wifiSsid}</strong></div>
                <div><span className="text-muted-foreground">Password:</span> <strong>{wifiPass}</strong></div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Nikmati koneksi internet cepat & colokan listrik untuk kenyamanan bersantai / bekerja.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
