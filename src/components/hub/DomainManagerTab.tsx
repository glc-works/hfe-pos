import React, { useState } from 'react'
import { Card, Button, Badge, TextInput } from '../../ui'
import { Globe, ShieldCheck, ExternalLink, CheckCircle2, Search, ArrowRight, RefreshCw, Key } from 'lucide-react'
import { useMerchantConfig } from '../../context/MerchantConfigContext'

export function DomainManagerTab() {
  const config = useMerchantConfig()
  const [subdomain, setSubdomain] = useState(config.storefrontSubdomain || 'kopinusantara')
  const [customDomain, setCustomDomain] = useState(config.storefrontCustomDomain || '')
  const [dnsStatus, setDnsStatus] = useState<'verified' | 'pending' | 'unconfigured'>('pending')
  const [txtToken] = useState('hfe-verify-9f8a7e6d5c4b3a210')
  const [searchDomain, setSearchDomain] = useState('')
  const [searchResult, setSearchResult] = useState<{ domain: string; available: boolean; priceIdr: number } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  const handleVerifyDns = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setDnsStatus('verified')
      setVerificationSuccess(true)
      setTimeout(() => setVerificationSuccess(false), 2500)
    }, 1200)
  }

  const handleSearchDomain = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchDomain) return
    const cleanName = searchDomain.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    const tld = cleanName.includes('.') ? cleanName : `${cleanName}.id`
    setSearchResult({
      domain: tld,
      available: true,
      priceIdr: tld.endsWith('.id') ? 225000 : tld.endsWith('.com') ? 160000 : 49000,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" /> Storefront & Domain Manager
        </h3>
        <p className="text-xs text-muted-foreground">
          Kelola alamat web publik toko, hubungkan domain sendiri (BYOD), atau cari domain bisnis baru
        </p>
      </div>

      {/* 2-Column: Subdomain vs Custom Domain */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subdomain Card */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              1. Subdomain Bawaan Ekosistem (Gratis)
            </span>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
              Aktif Permanen
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <TextInput 
              value={subdomain} 
              onChange={(e) => setSubdomain(e.target.value)}
              className="font-mono text-xs font-bold"
            />
            <span className="text-xs font-mono text-muted-foreground shrink-0">.hfeit.com</span>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 text-xs flex items-center justify-between">
            <span className="text-muted-foreground">URL Live Storefront:</span>
            <a 
              href={`https://${subdomain}.hfeit.com`} 
              target="_blank" 
              rel="noreferrer" 
              className="font-mono font-bold text-primary flex items-center gap-1 hover:underline"
            >
              https://{subdomain}.hfeit.com <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </Card>

        {/* Custom Domain BYOD Card */}
        <Card className="p-5 space-y-4 border-primary/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              2. Bawa Domain Sendiri (BYOD)
            </span>
            <Badge variant="outline" className={`text-[10px] ${
              dnsStatus === 'verified' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {dnsStatus === 'verified' ? '✓ Terverifikasi & Aktif' : '⏳ Menunggu Konfigurasi DNS'}
            </Badge>
          </div>

          <TextInput 
            placeholder="contoh: www.kopinusantara.id" 
            value={customDomain} 
            onChange={(e) => setCustomDomain(e.target.value)}
            className="font-mono text-xs"
          />

          {customDomain && (
            <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
              <div className="text-[11px] text-muted-foreground font-semibold">
                Panduan Pasang DNS di Registrar Anda (Hostinger / Cloudflare / Niagahoster):
              </div>
              <div className="p-2.5 rounded bg-muted/40 font-mono text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CNAME Record:</span>
                  <strong className="text-foreground">cname.hfeit.com</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TXT Token:</span>
                  <strong className="text-amber-400">{txtToken}</strong>
                </div>
              </div>

              <Button 
                className="w-full text-xs font-bold mt-2" 
                onClick={handleVerifyDns}
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Memeriksa DNS TXT Records...
                  </span>
                ) : verificationSuccess || dnsStatus === 'verified' ? (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DNS Terverifikasi Sukses!
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Cek Verifikasi DNS Sekarang
                  </span>
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Hostinger Domain Search Widget */}
      <Card className="p-5 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="max-w-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Search className="w-4 h-4" /> Cari & Beli Domain Baru (Powered by Hostinger)
          </div>
          <h4 className="text-sm font-bold text-foreground">
            Belum punya domain? Beli domain resmi bisnis Anda langsung dari kasir
          </h4>

          <form onSubmit={handleSearchDomain} className="flex gap-2">
            <TextInput 
              placeholder="Ketik nama bisnis (contoh: kopinusantara)..." 
              value={searchDomain} 
              onChange={(e) => setSearchDomain(e.target.value)}
              className="text-xs"
            />
            <Button type="submit" className="text-xs font-bold shrink-0">
              Cek Ketersediaan
            </Button>
          </form>

          {searchResult && (
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm text-foreground">{searchResult.domain}</strong>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-sans">
                    ✓ Tersedia
                  </Badge>
                </div>
                <div className="text-muted-foreground font-sans text-[11px] mt-0.5">
                  Harga: <strong>Rp {searchResult.priceIdr.toLocaleString('id-ID')}</strong> / tahun
                </div>
              </div>
              <a 
                href={`https://www.hostinger.co.id/domain-search?domain=${encodeURIComponent(searchResult.domain)}`} 
                target="_blank" 
                rel="noreferrer"
              >
                <Button size="sm" className="font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white">
                  Beli di Hostinger <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Anti-Vendor Lock-in Freedom Notice */}
      <Card className="p-4 bg-muted/20 border-dashed">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-foreground">Kedaulatan Merchant & Hak Pindah (Anti-Vendor Lock-in)</div>
            <p className="text-muted-foreground leading-relaxed">
              Domain adalah aset milik Anda seutuhnya. Anda dapat memindahkan domain kapan saja ke akun Hostinger pribadi (*Internal Move* gratis) atau ke registrar lain seperti Cloudflare/GoDaddy menggunakan kode otorisasi EPP tanpa penalti.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
