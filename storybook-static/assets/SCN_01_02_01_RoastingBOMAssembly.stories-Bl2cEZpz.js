import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as h}from"./index-Bc2G9s8g.js";import{within as _,userEvent as g,expect as D}from"./index-DeN4tkzB.js";import{a as H}from"./coaPresets-zq6Pppj-.js";import{B as Y}from"./button-C5fvjkcT.js";import{B as u}from"./badge-BBlHSdx-.js";import{C as U}from"./card-BQcBc4Hf.js";import{I as z}from"./input-BFMnjpVD.js";import{P as x}from"./PriceTag-C-7sONHk.js";import"./CapacityBadge-C8Y9RhSA.js";import{c as T}from"./createLucideIcon-CS0JafeY.js";import{L as V}from"./layers-BQ8N9BBC.js";import{C as J}from"./circle-check-DNYhvYL_.js";import{F as X}from"./flame-C50-W_ZS.js";import"./utils-CzmKNr9_.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=T("Factory",[["path",{d:"M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"159hny"}],["path",{d:"M17 18h1",key:"uldtlt"}],["path",{d:"M12 18h1",key:"s9uhes"}],["path",{d:"M7 18h1",key:"1neino"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=T("Percent",[["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}],["circle",{cx:"6.5",cy:"6.5",r:"2.5",key:"4mh3h7"}],["circle",{cx:"17.5",cy:"17.5",r:"2.5",key:"1mdrzq"}]]),s=({batch:r,presetId:n=H.id})=>{const[a,l]=h.useState(r),[o,M]=h.useState(r.greenBeanKg*(1-r.shrinkageRate)),b=a.greenBeanKg*a.greenBeanCostPerKg,I=a.greenBeanKg*a.shrinkageRate,p=b+a.gasCost+a.laborCost,G=o>0?p/o:0,E=t=>{l(F=>({...F,greenBeanKg:t})),M(t*(1-a.shrinkageRate))},L=()=>{l(t=>({...t,isPosted:!0}))};return e.jsxs("div",{className:"min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans",children:[e.jsxs("div",{className:"flex items-center justify-between pb-4 mb-4 border-b border-slate-800",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2.5 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30",children:e.jsx(q,{className:"w-5 h-5"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h1",{className:"text-base font-black text-white",children:"Roastery Assembly & COGM Engine"}),e.jsx(u,{variant:"default",className:"text-[10px] py-0 bg-amber-600 text-white font-bold",children:"SCN-01-02-01"})]}),e.jsxs("p",{className:"text-xs text-slate-400 font-mono",children:["CoA Preset: ",n]})]})]}),e.jsxs(u,{variant:"outline",className:"text-amber-400 border-amber-500/40 bg-amber-500/10 font-mono",children:["Lot: ",a.batchNumber||"N/A"]})]}),e.jsx("div",{className:"max-w-2xl mx-auto space-y-4",children:e.jsxs(U,{className:"p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-slate-800",children:[e.jsxs("span",{className:"text-xs font-bold text-slate-300 flex items-center gap-1.5",children:[e.jsx(V,{className:"w-4 h-4 text-amber-500"})," Bill of Materials (BOM Roasting 15% Susut)"]}),e.jsx("span",{className:"text-[11px] font-mono text-slate-400",children:"Akun: 1310 → 1320 → 1330"})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{className:"text-xs text-slate-400",children:"Green Beans (1310 - Mentah):"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(z,{type:"number","data-testid":"input-green-beans",value:a.greenBeanKg||"",onChange:t=>E(parseFloat(t.target.value)||0),placeholder:"0 kg",className:"bg-slate-950 border-slate-800 text-sm font-mono text-white"}),e.jsx("span",{className:"text-xs text-slate-400 font-bold",children:"kg"})]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{className:"text-xs text-slate-400",children:"Biaya Bahan Baku (Green Beans):"}),e.jsx("div",{className:"p-2 bg-slate-950 rounded-lg border border-slate-800",children:e.jsx(x,{amount:b,size:"sm",variant:"muted"})})]})]}),e.jsxs("div",{className:"p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-[10px] text-slate-400 block",children:"Kadar Susut"}),e.jsxs("span",{className:"text-xs font-mono font-bold text-amber-400 flex items-center justify-center gap-0.5",children:[e.jsx(W,{className:"w-3 h-3"})," ",(a.shrinkageRate*100).toFixed(0),"%"]})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-[10px] text-slate-400 block",children:"Bobot Hilang (Air)"}),e.jsxs("span",{className:"text-xs font-mono font-bold text-rose-400",children:["-",I.toFixed(2)," kg"]})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-[10px] text-slate-400 block",children:"Yield Roasted (1330)"}),e.jsxs("span",{className:"text-xs font-mono font-black text-emerald-400","data-testid":"text-roasted-yield",children:[o.toFixed(2)," kg"]})]})]}),e.jsxs("div",{className:"p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-xs",children:[e.jsx("span",{className:"text-slate-400",children:"Overhead Gas + Upah Roaster (5210/5220):"}),e.jsx(x,{amount:a.gasCost+a.laborCost,size:"xs",variant:"muted"})]}),e.jsxs("div",{className:"flex justify-between text-xs pt-1 border-t border-slate-800",children:[e.jsx("span",{className:"text-slate-200 font-bold",children:"Total Harga Pokok Produksi (COGM 5100):"}),e.jsx(x,{amount:p,size:"sm",variant:"accent"})]}),e.jsxs("div",{className:"flex justify-between text-[11px] text-amber-300 font-mono",children:[e.jsx("span",{children:"HPP per Kg Biji Sangrai:"}),e.jsxs("span",{children:["Rp ",Math.round(G).toLocaleString("id-ID")," / kg"]})]})]}),a.isPosted?e.jsxs("div",{className:"p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-center gap-2",children:[e.jsx(J,{className:"w-4 h-4 text-emerald-400"}),e.jsxs("span",{children:["Jurnal COGM #COGM-",a.batchNumber," Berhasil Diposting ke Subledger"]})]}):e.jsxs(Y,{className:"w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs",onClick:L,"data-testid":"btn-post-cogm",children:[e.jsx(X,{className:"w-4 h-4 mr-1.5"})," Posting Produksi & Jurnal COGM (CoA 5100)"]})]})})]})},ge={title:"Scenarios/SCN-01-02-01 Roasting BOM Assembly",component:s,parameters:{scenarioId:"SCN-01-02-01",preset:"COA_ID_ROASTING_MFG",layout:"fullscreen"},args:{batch:{batchNumber:"LOT-GAYO-ANAEROBIC-2026-B08",greenBeanKg:20,greenBeanCostPerKg:14e4,gasCost:65e3,laborCost:85e3,shrinkageRate:.15,isPosted:!1}}},i={args:{batch:{batchNumber:"LOT-EMPTY",greenBeanKg:0,greenBeanCostPerKg:12e4,gasCost:0,laborCost:0,shrinkageRate:.15,isPosted:!1}}},c={args:{batch:{batchNumber:"L1",greenBeanKg:1,greenBeanCostPerKg:12e4,gasCost:15e3,laborCost:2e4,shrinkageRate:.15,isPosted:!1}}},d={args:{batch:{batchNumber:"LOT-INDUSTRIAL-BATCH-GAYO-SUPER-EXTRA-LONG-SPEC-2026-X999",greenBeanKg:1e4,greenBeanCostPerKg:12e4,gasCost:25e6,laborCost:25e6,shrinkageRate:.15,isPosted:!1}}},m={args:{batch:{batchNumber:"LOT-GAYO-ANAEROBIC-2026-B08",greenBeanKg:20,greenBeanCostPerKg:14e4,gasCost:65e3,laborCost:85e3,shrinkageRate:.15,isPosted:!1}},play:async({canvasElement:r})=>{const n=_(r),a=await n.findByTestId("input-green-beans");await g.clear(a),await g.type(a,"20");const l=await n.findByTestId("btn-post-cogm");await g.click(l);const o=await n.findByTestId("text-roasted-yield");D(o).toBeDefined()}};s.__docgenInfo={description:"",methods:[],displayName:"RoastingBOMAssemblyView",props:{batch:{required:!0,tsType:{name:"AssemblyBatchState"},description:""},presetId:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'COA_ID_ROASTING_MFG'",computed:!1}}}};var N,f,v;s.parameters={...s.parameters,docs:{...(N=s.parameters)==null?void 0:N.docs,source:{originalSource:`({
  batch: initialBatch,
  presetId = COA_ID_ROASTING_MFG.id
}) => {
  const [batch, setBatch] = useState<AssemblyBatchState>(initialBatch);
  const [roastedKg, setRoastedKg] = useState<number>(initialBatch.greenBeanKg * (1 - initialBatch.shrinkageRate));
  const greenBeanTotal = batch.greenBeanKg * batch.greenBeanCostPerKg;
  const shrinkageLossKg = batch.greenBeanKg * batch.shrinkageRate;
  const totalCogm = greenBeanTotal + batch.gasCost + batch.laborCost;
  const unitCogmPerKg = roastedKg > 0 ? totalCogm / roastedKg : 0;
  const handleUpdateKg = (kg: number) => {
    setBatch(prev => ({
      ...prev,
      greenBeanKg: kg
    }));
    setRoastedKg(kg * (1 - batch.shrinkageRate));
  };
  const handlePostCogm = () => {
    setBatch(prev => ({
      ...prev,
      isPosted: true
    }));
  };
  return <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white">Roastery Assembly & COGM Engine</h1>
              <Badge variant="default" className="text-[10px] py-0 bg-amber-600 text-white font-bold">
                SCN-01-02-01
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">CoA Preset: {presetId}</p>
          </div>
        </div>

        <Badge variant="outline" className="text-amber-400 border-amber-500/40 bg-amber-500/10 font-mono">
          Lot: {batch.batchNumber || 'N/A'}
        </Badge>
      </div>

      {/* Main Assembly Workstation Card */}
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-500" /> Bill of Materials (BOM Roasting 15% Susut)
            </span>
            <span className="text-[11px] font-mono text-slate-400">Akun: 1310 → 1320 → 1330</span>
          </div>

          {/* Green Beans Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Green Beans (1310 - Mentah):</label>
              <div className="flex items-center gap-2">
                <Input type="number" data-testid="input-green-beans" value={batch.greenBeanKg || ''} onChange={e => handleUpdateKg(parseFloat(e.target.value) || 0)} placeholder="0 kg" className="bg-slate-950 border-slate-800 text-sm font-mono text-white" />
                <span className="text-xs text-slate-400 font-bold">kg</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Biaya Bahan Baku (Green Beans):</label>
              <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                <PriceTag amount={greenBeanTotal} size="sm" variant="muted" />
              </div>
            </div>
          </div>

          {/* Shrinkage Rate & Yield Calculation */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block">Kadar Susut</span>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center justify-center gap-0.5">
                <Percent className="w-3 h-3" /> {(batch.shrinkageRate * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Bobot Hilang (Air)</span>
              <span className="text-xs font-mono font-bold text-rose-400">
                -{shrinkageLossKg.toFixed(2)} kg
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Yield Roasted (1330)</span>
              <span className="text-xs font-mono font-black text-emerald-400" data-testid="text-roasted-yield">
                {roastedKg.toFixed(2)} kg
              </span>
            </div>
          </div>

          {/* COGM Breakdown & Financial Result */}
          <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Overhead Gas + Upah Roaster (5210/5220):</span>
              <PriceTag amount={batch.gasCost + batch.laborCost} size="xs" variant="muted" />
            </div>
            <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-200 font-bold">Total Harga Pokok Produksi (COGM 5100):</span>
              <PriceTag amount={totalCogm} size="sm" variant="accent" />
            </div>
            <div className="flex justify-between text-[11px] text-amber-300 font-mono">
              <span>HPP per Kg Biji Sangrai:</span>
              <span>Rp {Math.round(unitCogmPerKg).toLocaleString('id-ID')} / kg</span>
            </div>
          </div>

          {/* Post COGM Button */}
          {batch.isPosted ? <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Jurnal COGM #COGM-{batch.batchNumber} Berhasil Diposting ke Subledger</span>
            </div> : <Button className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs" onClick={handlePostCogm} data-testid="btn-post-cogm">
              <Flame className="w-4 h-4 mr-1.5" /> Posting Produksi & Jurnal COGM (CoA 5100)
            </Button>}
        </Card>
      </div>
    </div>;
}`,...(v=(f=s.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var B,C,y;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    batch: {
      batchNumber: 'LOT-EMPTY',
      greenBeanKg: 0,
      greenBeanCostPerKg: 120000,
      gasCost: 0,
      laborCost: 0,
      shrinkageRate: 0.15,
      isPosted: false
    }
  }
}`,...(y=(C=i.parameters)==null?void 0:C.docs)==null?void 0:y.source}}};var k,j,P;c.parameters={...c.parameters,docs:{...(k=c.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    batch: {
      batchNumber: 'L1',
      greenBeanKg: 1,
      greenBeanCostPerKg: 120000,
      gasCost: 15000,
      laborCost: 20000,
      shrinkageRate: 0.15,
      isPosted: false
    }
  }
}`,...(P=(j=c.parameters)==null?void 0:j.docs)==null?void 0:P.source}}};var K,w,R;d.parameters={...d.parameters,docs:{...(K=d.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    batch: {
      batchNumber: 'LOT-INDUSTRIAL-BATCH-GAYO-SUPER-EXTRA-LONG-SPEC-2026-X999',
      greenBeanKg: 10000,
      greenBeanCostPerKg: 120000,
      gasCost: 25000000,
      laborCost: 25000000,
      shrinkageRate: 0.15,
      isPosted: false
    }
  }
}`,...(R=(w=d.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};var O,A,S;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    batch: {
      batchNumber: 'LOT-GAYO-ANAEROBIC-2026-B08',
      greenBeanKg: 20,
      greenBeanCostPerKg: 140000,
      gasCost: 65000,
      laborCost: 85000,
      shrinkageRate: 0.15,
      isPosted: false
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByTestId('input-green-beans');
    await userEvent.clear(input);
    await userEvent.type(input, '20');
    const postBtn = await canvas.findByTestId('btn-post-cogm');
    await userEvent.click(postBtn);
    const yieldText = await canvas.findByTestId('text-roasted-yield');
    expect(yieldText).toBeDefined();
  }
}`,...(S=(A=m.parameters)==null?void 0:A.docs)==null?void 0:S.source}}};const xe=["RoastingBOMAssemblyView","EmptyState","ShortInitialState","ExtremeOverflow1Billion","MultiStateAssembly"];export{i as EmptyState,d as ExtremeOverflow1Billion,m as MultiStateAssembly,s as RoastingBOMAssemblyView,c as ShortInitialState,xe as __namedExportsOrder,ge as default};
