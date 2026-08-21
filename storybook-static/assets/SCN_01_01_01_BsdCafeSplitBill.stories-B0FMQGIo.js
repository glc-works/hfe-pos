import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as s}from"./index-Bc2G9s8g.js";import{within as $,expect as U,userEvent as v}from"./index-DeN4tkzB.js";import{C as H}from"./coaPresets-zq6Pppj-.js";import{B as N,a as f,C as J}from"./Card-hT2xKQEx.js";import{P as h}from"./PriceTag-C-7sONHk.js";import{C as W,T as X}from"./MinSpendPill-DTmKeL-z.js";import{S as Y}from"./store-ClsVQB7a.js";import{c as Z}from"./createLucideIcon-CS0JafeY.js";import{U as ee}from"./users-DvbbAVo8.js";import{C as te}from"./circle-check-DNYhvYL_.js";import{Q as ae}from"./qr-code-DpTog14E.js";import"./x-DR7-x6Gd.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=Z("Split",[["path",{d:"M16 3h5v5",key:"1806ms"}],["path",{d:"M8 3H3v5",key:"15dfkv"}],["path",{d:"M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3",key:"1qrqzj"}],["path",{d:"m15 9 6-6",key:"ko1vev"}]]),i=({shiftOpen:c=!0,table:l,showSplitModal:m=!1,presetId:p=H.id})=>{const[x,D]=s.useState(c),[a,ie]=s.useState(l),[Q,g]=s.useState(m),[u,_]=s.useState(4),[z,R]=s.useState(!1),[b,L]=s.useState(1),S=Math.ceil(a.totalBill/u),V=()=>D(!0),F=()=>g(!0),K=()=>{R(!0),b<u&&L(t=>t+1)};return e.jsxs("div",{className:"min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans",children:[e.jsxs("div",{className:"flex items-center justify-between pb-4 mb-4 border-b border-slate-800",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30",children:e.jsx(Y,{className:"w-5 h-5"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h1",{className:"text-base font-black text-white",children:"BSD Specialty Cafe & Roastery"}),e.jsx(N,{variant:"default",className:"text-[10px] py-0 bg-amber-500 text-slate-950 font-bold",children:"SCN-01-01-01"})]}),e.jsxs("p",{className:"text-xs text-slate-400 font-mono",children:["CoA Preset: ",p]})]})]}),e.jsx("div",{className:"flex items-center gap-2",children:x?e.jsx(N,{variant:"outline",className:"text-emerald-400 border-emerald-500/40 bg-emerald-500/10",children:"● Shift Aktif: Kasir Pagi"}):e.jsx(f,{size:"sm",onClick:V,"data-testid":"btn-open-shift",children:"Buka Shift Kasir"})})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:e.jsxs(J,{"data-testid":"card-table-8",onClick:F,className:`p-4 rounded-2xl border transition-all cursor-pointer ${a.isOccupied?"bg-amber-950/20 border-amber-500/40 hover:border-amber-400 ring-1 ring-amber-500/20":"bg-slate-900/60 border-slate-800 hover:border-slate-700"}`,children:[e.jsxs("div",{className:"flex items-center justify-between gap-2 mb-3",children:[e.jsx("span",{className:"text-sm font-black text-white font-mono",children:a.name}),e.jsx("div",{className:"focal-optical-center",children:e.jsx(W,{seatedGuests:a.seatedGuests,maxCapacity:a.maxCapacity,isOccupied:a.isOccupied})}),e.jsx(X,{elapsedMinutes:a.elapsedMinutes})]}),e.jsxs("div",{className:"space-y-1.5 min-w-0 mb-3",children:[e.jsx("p",{className:"text-xs font-semibold text-slate-300 truncate",title:a.guestName,children:a.guestName||"Meja Kosong (Tersedia)"}),e.jsx("div",{className:"text-[11px] text-slate-400 space-y-0.5 max-h-16 overflow-hidden",children:a.items.map(t=>e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("span",{className:"truncate",children:[t.qty,"x ",t.name]}),e.jsx(h,{amount:t.price*t.qty,size:"xs",variant:"muted"})]},t.id))})]}),e.jsxs("div",{className:"pt-2 border-t border-slate-800 flex items-center justify-between",children:[e.jsx("span",{className:"text-xs text-slate-400",children:"Total Tagihan:"}),e.jsx(h,{amount:a.totalBill,size:"sm",variant:"accent"})]})]})}),Q&&e.jsx("div",{"data-testid":"modal-split-bill",className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",children:e.jsxs("div",{className:"w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-slate-800",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(se,{className:"w-5 h-5 text-amber-400"}),e.jsxs("h3",{className:"text-sm font-bold text-white",children:["Split Bill Granular — ",a.name]})]}),e.jsx(f,{size:"icon",variant:"ghost",onClick:()=>g(!1),"data-testid":"btn-close-split",children:"✕"})]}),e.jsxs("div",{className:"flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800",children:[e.jsxs("span",{className:"text-xs text-slate-300 flex items-center gap-1",children:[e.jsx(ee,{className:"w-4 h-4 text-amber-400"})," Bagi Rata Pax:"]}),e.jsx("div",{className:"flex gap-1.5",children:[2,3,4].map(t=>e.jsx("button",{type:"button",onClick:()=>_(t),"data-testid":`btn-pax-${t}`,className:`w-7 h-7 rounded-lg text-xs font-mono font-bold ${u===t?"bg-amber-500 text-slate-950":"bg-slate-800 text-slate-300"}`,children:t},t))})]}),e.jsxs("div",{className:"p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-xs",children:[e.jsxs("span",{className:"text-slate-400",children:["Bagian Orang ke-",b,":"]}),e.jsx(h,{amount:S,size:"xs",variant:"accent"})]}),z?e.jsxs("div",{className:"p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2",children:[e.jsx(te,{className:"w-4 h-4 text-emerald-400 shrink-0"}),e.jsx("span",{children:"QRIS Settled & Disinkron ke Subledger Meja (CoA 1130)"})]}):e.jsxs(f,{size:"sm",className:"w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400",onClick:K,"data-testid":"btn-settle-qris",children:[e.jsx(ae,{className:"w-4 h-4 mr-1.5"})," Settle QRIS Bagian ",b," (Rp ",S.toLocaleString("id-ID"),")"]})]})]})})]})},ge={title:"Scenarios/SCN-01-01-01 BSD Cafe Split Bill",component:i,parameters:{scenarioId:"SCN-01-01-01",preset:"COA_ID_FNB_CAFE",layout:"fullscreen"},args:{shiftOpen:!0,table:{id:"T-08",name:"Meja 08",seatedGuests:4,maxCapacity:4,guestName:"Group Arisan BSD (4 Pax)",elapsedMinutes:45,items:[{id:"item-1",name:"Piccolo Latte Double Shot",qty:2,price:38e3},{id:"item-2",name:"V60 Gayo Anaerobic Natural",qty:2,price:45e3},{id:"item-3",name:"Almond Croissant Artisan",qty:4,price:32e3}],totalBill:294e3,isOccupied:!0},showSplitModal:!1}},n={args:{shiftOpen:!1,table:{id:"T-08",name:"Meja 08",seatedGuests:0,maxCapacity:4,guestName:"",elapsedMinutes:0,items:[],totalBill:0,isOccupied:!1},showSplitModal:!1}},r={args:{shiftOpen:!0,table:{id:"T-08",name:"Meja 08",seatedGuests:1,maxCapacity:4,guestName:"Al",elapsedMinutes:1,items:[{id:"item-1",name:"Es Teh",qty:1,price:500}],totalBill:500,isOccupied:!0},showSplitModal:!1}},d={args:{shiftOpen:!0,table:{id:"T-08",name:"Meja 08 - VIP Lounge Suite",seatedGuests:4,maxCapacity:4,guestName:"Bpk. Alexander Raden Christopher III",elapsedMinutes:120,items:[{id:"item-1",name:"Private Reserve Geisha 1931 Lot 88",qty:4,price:45e7},{id:"item-2",name:"Tasting Menu Gold Leaf Edition",qty:4,price:125e5}],totalBill:185e7,isOccupied:!0},showSplitModal:!1}},o={args:{shiftOpen:!0,table:{id:"T-08",name:"Meja 08",seatedGuests:4,maxCapacity:4,guestName:"Group Arisan BSD (4 Pax)",elapsedMinutes:45,items:[{id:"item-1",name:"Piccolo Latte Double Shot",qty:2,price:38e3},{id:"item-2",name:"V60 Gayo Anaerobic Natural",qty:2,price:45e3},{id:"item-3",name:"Almond Croissant Artisan",qty:4,price:32e3}],totalBill:294e3,isOccupied:!0},showSplitModal:!0},play:async({canvasElement:c})=>{const l=$(c),m=await l.findByTestId("card-table-8");U(m).toBeDefined();const p=await l.findByTestId("btn-pax-4");await v.click(p);const x=await l.findByTestId("btn-settle-qris");await v.click(x)}};i.__docgenInfo={description:"",methods:[],displayName:"BsdCafeScenarioView",props:{shiftOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},table:{required:!0,tsType:{name:"TableOrder"},description:""},showSplitModal:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},presetId:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'COA_ID_FNB_CAFE'",computed:!1}}}};var y,j,w;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`({
  shiftOpen: initialShiftOpen = true,
  table: initialTable,
  showSplitModal: initialShowSplitModal = false,
  presetId = COA_ID_FNB_CAFE.id
}) => {
  const [shiftOpen, setShiftOpen] = useState(initialShiftOpen);
  const [table, setTable] = useState<TableOrder>(initialTable);
  const [isSplitOpen, setIsSplitOpen] = useState(initialShowSplitModal);
  const [paxSplit, setPaxSplit] = useState(4);
  const [settledQris, setSettledQris] = useState(false);
  const [activePerson, setActivePerson] = useState(1);
  const splitPerPerson = Math.ceil(table.totalBill / paxSplit);
  const handleOpenShift = () => setShiftOpen(true);
  const handleSelectTable = () => setIsSplitOpen(true);
  const handleSettleQris = () => {
    setSettledQris(true);
    if (activePerson < paxSplit) {
      setActivePerson(p => p + 1);
    }
  };
  return <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white">BSD Specialty Cafe & Roastery</h1>
              <Badge variant="default" className="text-[10px] py-0 bg-amber-500 text-slate-950 font-bold">
                SCN-01-01-01
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">CoA Preset: {presetId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!shiftOpen ? <Button size="sm" onClick={handleOpenShift} data-testid="btn-open-shift">
              Buka Shift Kasir
            </Button> : <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 bg-emerald-500/10">
              ● Shift Aktif: Kasir Pagi
            </Badge>}
        </div>
      </div>

      {/* Main Floor Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Table 8 Card */}
        <Card data-testid="card-table-8" onClick={handleSelectTable} className={\`p-4 rounded-2xl border transition-all cursor-pointer \${table.isOccupied ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400 ring-1 ring-amber-500/20' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}\`}>
          {/* Card Top: Entity ID, Area of Focus, Elapsed Timer */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-sm font-black text-white font-mono">{table.name}</span>
            <div className="focal-optical-center">
              <CapacityBadge seatedGuests={table.seatedGuests} maxCapacity={table.maxCapacity} isOccupied={table.isOccupied} />
            </div>
            <TimerPill elapsedMinutes={table.elapsedMinutes} />
          </div>

          {/* Guest Name & Items Preview */}
          <div className="space-y-1.5 min-w-0 mb-3">
            <p className="text-xs font-semibold text-slate-300 truncate" title={table.guestName}>
              {table.guestName || 'Meja Kosong (Tersedia)'}
            </p>
            <div className="text-[11px] text-slate-400 space-y-0.5 max-h-16 overflow-hidden">
              {table.items.map(it => <div key={it.id} className="flex justify-between items-center">
                  <span className="truncate">{it.qty}x {it.name}</span>
                  <PriceTag amount={it.price * it.qty} size="xs" variant="muted" />
                </div>)}
            </div>
          </div>

          {/* Total Bill & Action */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Tagihan:</span>
            <PriceTag amount={table.totalBill} size="sm" variant="accent" />
          </div>
        </Card>
      </div>

      {/* Split Bill Modal Overlay */}
      {isSplitOpen && <div data-testid="modal-split-bill" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Split className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Split Bill Granular — {table.name}</h3>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setIsSplitOpen(false)} data-testid="btn-close-split">
                ✕
              </Button>
            </div>

            {/* Split Mode Selector */}
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Users className="w-4 h-4 text-amber-400" /> Bagi Rata Pax:
              </span>
              <div className="flex gap-1.5">
                {[2, 3, 4].map(num => <button key={num} type="button" onClick={() => setPaxSplit(num)} data-testid={\`btn-pax-\${num}\`} className={\`w-7 h-7 rounded-lg text-xs font-mono font-bold \${paxSplit === num ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}\`}>
                    {num}
                  </button>)}
              </div>
            </div>

            {/* Settlement Status */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Bagian Orang ke-{activePerson}:</span>
                <PriceTag amount={splitPerPerson} size="xs" variant="accent" />
              </div>

              {settledQris ? <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>QRIS Settled & Disinkron ke Subledger Meja (CoA 1130)</span>
                </div> : <Button size="sm" className="w-full bg-amber-500 text-slate-950 font-bold hover:bg-amber-400" onClick={handleSettleQris} data-testid="btn-settle-qris">
                  <QrCode className="w-4 h-4 mr-1.5" /> Settle QRIS Bagian {activePerson} (Rp {splitPerPerson.toLocaleString('id-ID')})
                </Button>}
            </div>
          </div>
        </div>}
    </div>;
}`,...(w=(j=i.parameters)==null?void 0:j.docs)==null?void 0:w.source}}};var B,C,O;n.parameters={...n.parameters,docs:{...(B=n.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    shiftOpen: false,
    table: {
      id: 'T-08',
      name: 'Meja 08',
      seatedGuests: 0,
      maxCapacity: 4,
      guestName: '',
      elapsedMinutes: 0,
      items: [],
      totalBill: 0,
      isOccupied: false
    },
    showSplitModal: false
  }
}`,...(O=(C=n.parameters)==null?void 0:C.docs)==null?void 0:O.source}}};var M,T,k;r.parameters={...r.parameters,docs:{...(M=r.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    shiftOpen: true,
    table: {
      id: 'T-08',
      name: 'Meja 08',
      seatedGuests: 1,
      maxCapacity: 4,
      guestName: 'Al',
      elapsedMinutes: 1,
      items: [{
        id: 'item-1',
        name: 'Es Teh',
        qty: 1,
        price: 500
      }],
      totalBill: 500,
      isOccupied: true
    },
    showSplitModal: false
  }
}`,...(k=(T=r.parameters)==null?void 0:T.docs)==null?void 0:k.source}}};var P,I,A;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    shiftOpen: true,
    table: {
      id: 'T-08',
      name: 'Meja 08 - VIP Lounge Suite',
      seatedGuests: 4,
      maxCapacity: 4,
      guestName: 'Bpk. Alexander Raden Christopher III',
      elapsedMinutes: 120,
      items: [{
        id: 'item-1',
        name: 'Private Reserve Geisha 1931 Lot 88',
        qty: 4,
        price: 450000000
      }, {
        id: 'item-2',
        name: 'Tasting Menu Gold Leaf Edition',
        qty: 4,
        price: 12500000
      }],
      totalBill: 1850000000,
      isOccupied: true
    },
    showSplitModal: false
  }
}`,...(A=(I=d.parameters)==null?void 0:I.docs)==null?void 0:A.source}}};var q,G,E;o.parameters={...o.parameters,docs:{...(q=o.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    shiftOpen: true,
    table: {
      id: 'T-08',
      name: 'Meja 08',
      seatedGuests: 4,
      maxCapacity: 4,
      guestName: 'Group Arisan BSD (4 Pax)',
      elapsedMinutes: 45,
      items: [{
        id: 'item-1',
        name: 'Piccolo Latte Double Shot',
        qty: 2,
        price: 38000
      }, {
        id: 'item-2',
        name: 'V60 Gayo Anaerobic Natural',
        qty: 2,
        price: 45000
      }, {
        id: 'item-3',
        name: 'Almond Croissant Artisan',
        qty: 4,
        price: 32000
      }],
      totalBill: 294000,
      isOccupied: true
    },
    showSplitModal: true
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const card = await canvas.findByTestId('card-table-8');
    expect(card).toBeDefined();
    const pax4Btn = await canvas.findByTestId('btn-pax-4');
    await userEvent.click(pax4Btn);
    const settleBtn = await canvas.findByTestId('btn-settle-qris');
    await userEvent.click(settleBtn);
  }
}`,...(E=(G=o.parameters)==null?void 0:G.docs)==null?void 0:E.source}}};const Se=["BsdCafeScenarioView","EmptyState","ShortInitialState","ExtremeOverflow1Billion","MultiStateSplitBill"];export{i as BsdCafeScenarioView,n as EmptyState,d as ExtremeOverflow1Billion,o as MultiStateSplitBill,r as ShortInitialState,Se as __namedExportsOrder,ge as default};
