import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as Z}from"./index-Bc2G9s8g.js";import{within as ee,userEvent as g,expect as u}from"./index-DeN4tkzB.js";import{B as h,C as ae}from"./Card-hT2xKQEx.js";import"./PriceTag-C-7sONHk.js";import"./MinSpendPill-DTmKeL-z.js";import{S as se}from"./store-ClsVQB7a.js";import{S as te}from"./shield-check-DAfhbeBX.js";import{B as f}from"./building-CYaWV0aK.js";import{c as re}from"./createLucideIcon-CS0JafeY.js";import{G as v}from"./globe-Cpzdg0GV.js";import{D as N}from"./dollar-sign-DkI6MoeO.js";import{U as j}from"./users-DvbbAVo8.js";import{C as T}from"./calendar-DeePZllW.js";import{T as w}from"./ticket-Bzyg3RwG.js";import"./x-DR7-x6Gd.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=re("Palette",[["circle",{cx:"13.5",cy:"6.5",r:".5",fill:"currentColor",key:"1okk4w"}],["circle",{cx:"17.5",cy:"10.5",r:".5",fill:"currentColor",key:"f64h9f"}],["circle",{cx:"8.5",cy:"7.5",r:".5",fill:"currentColor",key:"fotxhn"}],["circle",{cx:"6.5",cy:"12.5",r:".5",fill:"currentColor",key:"qy21gx"}],["path",{d:"M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z",key:"12rzf8"}]]),t=({initialTab:x="profile"})=>{const[a,b]=Z.useState(x),p=[{id:"profile",label:"Profil PT & Legalitas",icon:e.jsx(f,{className:"w-4 h-4 text-indigo-400"})},{id:"theme",label:"Tema & Tampilan",icon:e.jsx(y,{className:"w-4 h-4 text-amber-400"})},{id:"language",label:"Bahasa (Language)",icon:e.jsx(v,{className:"w-4 h-4 text-blue-400"})},{id:"tax",label:"Pajak & Kas Toko",icon:e.jsx(N,{className:"w-4 h-4 text-emerald-400"})},{id:"team",label:"Tim Staf & Akses PIN",icon:e.jsx(j,{className:"w-4 h-4 text-amber-400"})},{id:"reservations",label:"Reservasi Meja & DP",icon:e.jsx(T,{className:"w-4 h-4 text-rose-400"})},{id:"crm-vouchers",label:"CRM & Kupon Promo",icon:e.jsx(w,{className:"w-4 h-4 text-teal-400"})}];return e.jsx("div",{className:"min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans",children:e.jsxs("div",{className:"max-w-4xl mx-auto space-y-5",children:[e.jsx("div",{className:"flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400",children:e.jsx(se,{className:"w-6 h-6"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h1",{className:"text-base font-extrabold text-white",children:"BSD Specialty Coffee & Eatery"}),e.jsx(h,{variant:"default",className:"text-[10px] py-0 bg-amber-500 text-slate-950 font-bold",children:"Single-Door Hub"})]}),e.jsxs("p",{className:"text-xs text-slate-400 flex items-center gap-1 mt-0.5",children:[e.jsx(te,{className:"w-3.5 h-3.5 text-emerald-400"})," PT Kopi Inovasi BSD • CoA 18 Akun Synced"]})]})]})}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2",children:p.map(s=>e.jsxs("button",{type:"button","data-testid":`tab-${s.id}`,onClick:()=>b(s.id),className:`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${a===s.id?"bg-amber-500/20 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500/30":"bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"}`,children:[e.jsx("div",{className:"p-1.5 rounded-lg bg-slate-950/60",children:s.icon}),e.jsx("span",{className:"text-[11px] leading-tight truncate w-full",children:s.label})]},s.id))}),e.jsxs(ae,{className:"p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4",children:[a==="profile"&&e.jsxs("div",{"data-testid":"pane-profile",className:"space-y-3",children:[e.jsxs("h3",{className:"text-sm font-bold text-white flex items-center gap-2",children:[e.jsx(f,{className:"w-4 h-4 text-indigo-400"})," Profil PT & Legalitas Restoran"]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs",children:[e.jsxs("div",{className:"p-3 bg-slate-950 rounded-xl border border-slate-800",children:[e.jsx("span",{className:"text-slate-500 block",children:"Nama Badan Usaha:"}),e.jsx("span",{className:"font-bold text-white",children:"PT Kopi Inovasi BSD Tangsel"})]}),e.jsxs("div",{className:"p-3 bg-slate-950 rounded-xl border border-slate-800",children:[e.jsx("span",{className:"text-slate-500 block",children:"NPWP Restoran (DJP):"}),e.jsx("span",{className:"font-mono font-bold text-amber-400",children:"01.234.567.8-411.000"})]})]})]}),a==="theme"&&e.jsxs("div",{"data-testid":"pane-theme",className:"space-y-3",children:[e.jsxs("h3",{className:"text-sm font-bold text-white flex items-center gap-2",children:[e.jsx(y,{className:"w-4 h-4 text-amber-400"})," Tema & Penyesuaian Visual"]}),e.jsx("p",{className:"text-xs text-slate-400",children:"Pilih tema antarmuka POS dan tampilan pelanggan:"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx("div",{className:"p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-300 font-bold",children:"● Artisan Warm Amber (Aktif)"}),e.jsx("div",{className:"p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400",children:"○ Midnight Slate High-Contrast"})]})]}),a==="language"&&e.jsxs("div",{"data-testid":"pane-language",className:"space-y-3",children:[e.jsxs("h3",{className:"text-sm font-bold text-white flex items-center gap-2",children:[e.jsx(v,{className:"w-4 h-4 text-blue-400"})," Bahasa Antarmuka & Struk (Language)"]}),e.jsxs("div",{className:"flex gap-3 text-xs",children:[e.jsx("div",{className:"p-3 bg-blue-500/10 border border-blue-500/40 rounded-xl text-blue-300 font-bold flex-1",children:"🇮🇩 Bahasa Indonesia (Rupiah Rp)"}),e.jsx("div",{className:"p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 flex-1",children:"🇬🇧 English (International Multi-Currency)"})]})]}),a==="tax"&&e.jsxs("div",{"data-testid":"pane-tax",className:"space-y-3",children:[e.jsxs("h3",{className:"text-sm font-bold text-white flex items-center gap-2",children:[e.jsx(N,{className:"w-4 h-4 text-emerald-400"})," Pajak Daerah (PB1 / PBJT) & Kas Toko"]}),e.jsxs("div",{className:"p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-400",children:"Skema Pajak Restoran:"}),e.jsx("span",{className:"font-bold text-emerald-400",children:"PB1 Exclude (10%) - Akun 2210"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-slate-400",children:"Kas Float Awal Kasir:"}),e.jsx("span",{className:"font-mono font-bold text-white",children:"Rp 500.000 (Kas Laci 1110)"})]})]})]}),a==="team"&&e.jsxs("div",{"data-testid":"pane-team",className:"space-y-3",children:[e.jsxs("h3",{className:"text-sm font-bold text-white flex items-center gap-2",children:[e.jsx(j,{className:"w-4 h-4 text-amber-400"})," Roster Tim Staf & Akses PIN Kasir"]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[e.jsxs("div",{className:"p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center",children:[e.jsx("span",{children:"Andi Prasetya (Manager)"}),e.jsx(h,{variant:"outline",className:"text-amber-400 text-[10px]",children:"PIN: ****"})]}),e.jsxs("div",{className:"p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center",children:[e.jsx("span",{children:"Siti Barista (Kasir)"}),e.jsx(h,{variant:"outline",className:"text-emerald-400 text-[10px]",children:"PIN: ****"})]})]})]}),a==="reservations"&&e.jsxs("div",{"data-testid":"pane-reservations",className:"space-y-3",children:[e.jsxs("h3",{className:"text-sm font-bold text-white flex items-center gap-2",children:[e.jsx(T,{className:"w-4 h-4 text-rose-400"})," Kebijakan Reservasi Meja & Down Payment"]}),e.jsxs("div",{className:"p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center",children:[e.jsx("span",{className:"text-slate-400",children:"Approval Policy:"}),e.jsx("span",{className:"text-rose-300 font-bold",children:"Instant Auto-Approve (DP Wajib Rp 100.000)"})]})]}),a==="crm-vouchers"&&e.jsxs("div",{"data-testid":"pane-crm-vouchers",className:"space-y-3",children:[e.jsxs("h3",{className:"text-sm font-bold text-white flex items-center gap-2",children:[e.jsx(w,{className:"w-4 h-4 text-teal-400"})," CRM Database & Kupon Promosi Mitra"]}),e.jsxs("div",{className:"p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center",children:[e.jsx("span",{className:"text-slate-400",children:"Promo Bank BCA Operasional:"}),e.jsx("span",{className:"text-teal-300 font-bold",children:"Diskon 15% Max Rp 30.000 (Voucher CARD)"})]})]})]})]})})},je={title:"Onboarding/UnifiedSettingsHub",component:t,parameters:{layout:"fullscreen"}},r={args:{initialTab:"profile"}},l={args:{initialTab:"theme"}},i={args:{initialTab:"language"}},n={args:{initialTab:"tax"}},o={args:{initialTab:"team"}},d={args:{initialTab:"reservations"}},c={args:{initialTab:"crm-vouchers"}},m={args:{initialTab:"profile"},play:async({canvasElement:x})=>{const a=ee(x),b=await a.findByTestId("tab-tax");await g.click(b);const p=await a.findByTestId("pane-tax");u(p).toBeDefined();const s=await a.findByTestId("tab-theme");await g.click(s);const Y=await a.findByTestId("pane-theme");u(Y).toBeDefined()}};t.__docgenInfo={description:"",methods:[],displayName:"UnifiedSettingsHubShowcase",props:{initialTab:{required:!1,tsType:{name:"union",raw:`| 'profile'
| 'theme'
| 'language'
| 'tax'
| 'team'
| 'reservations'
| 'crm-vouchers'`,elements:[{name:"literal",value:"'profile'"},{name:"literal",value:"'theme'"},{name:"literal",value:"'language'"},{name:"literal",value:"'tax'"},{name:"literal",value:"'team'"},{name:"literal",value:"'reservations'"},{name:"literal",value:"'crm-vouchers'"}]},description:"",defaultValue:{value:"'profile'",computed:!1}}}};var P,S,k;t.parameters={...t.parameters,docs:{...(P=t.parameters)==null?void 0:P.docs,source:{originalSource:`({
  initialTab = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const TABS = [{
    id: 'profile' as const,
    label: 'Profil PT & Legalitas',
    icon: <Building className="w-4 h-4 text-indigo-400" />
  }, {
    id: 'theme' as const,
    label: 'Tema & Tampilan',
    icon: <Palette className="w-4 h-4 text-amber-400" />
  }, {
    id: 'language' as const,
    label: 'Bahasa (Language)',
    icon: <Globe className="w-4 h-4 text-blue-400" />
  }, {
    id: 'tax' as const,
    label: 'Pajak & Kas Toko',
    icon: <DollarSign className="w-4 h-4 text-emerald-400" />
  }, {
    id: 'team' as const,
    label: 'Tim Staf & Akses PIN',
    icon: <Users className="w-4 h-4 text-amber-400" />
  }, {
    id: 'reservations' as const,
    label: 'Reservasi Meja & DP',
    icon: <Calendar className="w-4 h-4 text-rose-400" />
  }, {
    id: 'crm-vouchers' as const,
    label: 'CRM & Kupon Promo',
    icon: <Ticket className="w-4 h-4 text-teal-400" />
  }];
  return <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Hub Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white">BSD Specialty Coffee & Eatery</h1>
                <Badge variant="default" className="text-[10px] py-0 bg-amber-500 text-slate-950 font-bold">
                  Single-Door Hub
                </Badge>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PT Kopi Inovasi BSD • CoA 18 Akun Synced
              </p>
            </div>
          </div>
        </div>

        {/* 7-Tab Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {TABS.map(tab => <button key={tab.id} type="button" data-testid={\`tab-\${tab.id}\`} onClick={() => setActiveTab(tab.id)} className={\`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center \${activeTab === tab.id ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500/30' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'}\`}>
              <div className="p-1.5 rounded-lg bg-slate-950/60">{tab.icon}</div>
              <span className="text-[11px] leading-tight truncate w-full">{tab.label}</span>
            </button>)}
        </div>

        {/* Tab Content Panes */}
        <Card className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
          {activeTab === 'profile' && <div data-testid="pane-profile" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" /> Profil PT & Legalitas Restoran
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Nama Badan Usaha:</span>
                  <span className="font-bold text-white">PT Kopi Inovasi BSD Tangsel</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">NPWP Restoran (DJP):</span>
                  <span className="font-mono font-bold text-amber-400">01.234.567.8-411.000</span>
                </div>
              </div>
            </div>}

          {activeTab === 'theme' && <div data-testid="pane-theme" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" /> Tema & Penyesuaian Visual
              </h3>
              <p className="text-xs text-slate-400">Pilih tema antarmuka POS dan tampilan pelanggan:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-300 font-bold">
                  ● Artisan Warm Amber (Aktif)
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400">
                  ○ Midnight Slate High-Contrast
                </div>
              </div>
            </div>}

          {activeTab === 'language' && <div data-testid="pane-language" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" /> Bahasa Antarmuka & Struk (Language)
              </h3>
              <div className="flex gap-3 text-xs">
                <div className="p-3 bg-blue-500/10 border border-blue-500/40 rounded-xl text-blue-300 font-bold flex-1">
                  🇮🇩 Bahasa Indonesia (Rupiah Rp)
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 flex-1">
                  🇬🇧 English (International Multi-Currency)
                </div>
              </div>
            </div>}

          {activeTab === 'tax' && <div data-testid="pane-tax" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" /> Pajak Daerah (PB1 / PBJT) & Kas Toko
              </h3>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Skema Pajak Restoran:</span>
                  <span className="font-bold text-emerald-400">PB1 Exclude (10%) - Akun 2210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kas Float Awal Kasir:</span>
                  <span className="font-mono font-bold text-white">Rp 500.000 (Kas Laci 1110)</span>
                </div>
              </div>
            </div>}

          {activeTab === 'team' && <div data-testid="pane-team" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" /> Roster Tim Staf & Akses PIN Kasir
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span>Andi Prasetya (Manager)</span>
                  <Badge variant="outline" className="text-amber-400 text-[10px]">PIN: ****</Badge>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span>Siti Barista (Kasir)</span>
                  <Badge variant="outline" className="text-emerald-400 text-[10px]">PIN: ****</Badge>
                </div>
              </div>
            </div>}

          {activeTab === 'reservations' && <div data-testid="pane-reservations" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400" /> Kebijakan Reservasi Meja & Down Payment
              </h3>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-400">Approval Policy:</span>
                <span className="text-rose-300 font-bold">Instant Auto-Approve (DP Wajib Rp 100.000)</span>
              </div>
            </div>}

          {activeTab === 'crm-vouchers' && <div data-testid="pane-crm-vouchers" className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-teal-400" /> CRM Database & Kupon Promosi Mitra
              </h3>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-400">Promo Bank BCA Operasional:</span>
                <span className="text-teal-300 font-bold">Diskon 15% Max Rp 30.000 (Voucher CARD)</span>
              </div>
            </div>}
        </Card>
      </div>
    </div>;
}`,...(k=(S=t.parameters)==null?void 0:S.docs)==null?void 0:k.source}}};var B,A,C;r.parameters={...r.parameters,docs:{...(B=r.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    initialTab: 'profile'
  }
}`,...(C=(A=r.parameters)==null?void 0:A.docs)==null?void 0:C.source}}};var R,D,I;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    initialTab: 'theme'
  }
}`,...(I=(D=l.parameters)==null?void 0:D.docs)==null?void 0:I.source}}};var K,M,E;i.parameters={...i.parameters,docs:{...(K=i.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    initialTab: 'language'
  }
}`,...(E=(M=i.parameters)==null?void 0:M.docs)==null?void 0:E.source}}};var L,H,U;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    initialTab: 'tax'
  }
}`,...(U=(H=n.parameters)==null?void 0:H.docs)==null?void 0:U.source}}};var V,O,W;o.parameters={...o.parameters,docs:{...(V=o.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    initialTab: 'team'
  }
}`,...(W=(O=o.parameters)==null?void 0:O.docs)==null?void 0:W.source}}};var G,J,_;d.parameters={...d.parameters,docs:{...(G=d.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    initialTab: 'reservations'
  }
}`,...(_=(J=d.parameters)==null?void 0:J.docs)==null?void 0:_.source}}};var $,q,z;c.parameters={...c.parameters,docs:{...($=c.parameters)==null?void 0:$.docs,source:{originalSource:`{
  args: {
    initialTab: 'crm-vouchers'
  }
}`,...(z=(q=c.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var F,Q,X;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    initialTab: 'profile'
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const taxTab = await canvas.findByTestId('tab-tax');
    await userEvent.click(taxTab);
    const taxPane = await canvas.findByTestId('pane-tax');
    expect(taxPane).toBeDefined();
    const themeTab = await canvas.findByTestId('tab-theme');
    await userEvent.click(themeTab);
    const themePane = await canvas.findByTestId('pane-theme');
    expect(themePane).toBeDefined();
  }
}`,...(X=(Q=m.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};const Te=["UnifiedSettingsHubShowcase","ProfileAndLegalTab","ThemeStylingTab","LanguageTab","TaxAndCashTab","TeamRosterTab","ReservationsTab","CrmAndVouchersTab","InteractiveTabSwitching"];export{c as CrmAndVouchersTab,m as InteractiveTabSwitching,i as LanguageTab,r as ProfileAndLegalTab,d as ReservationsTab,n as TaxAndCashTab,o as TeamRosterTab,l as ThemeStylingTab,t as UnifiedSettingsHubShowcase,Te as __namedExportsOrder,je as default};
