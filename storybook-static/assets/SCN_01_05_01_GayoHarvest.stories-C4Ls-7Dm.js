import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as x}from"./index-Bc2G9s8g.js";import{within as M,userEvent as i}from"./index-DeN4tkzB.js";import{b as _}from"./coaPresets-zq6Pppj-.js";import{B as v,C as D,a as h,I as F}from"./Card-hT2xKQEx.js";import{P as g}from"./PriceTag-C-7sONHk.js";import"./MinSpendPill-DTmKeL-z.js";import{c as H}from"./createLucideIcon-CS0JafeY.js";import{S as z}from"./sprout-R1Yye-pC.js";import{C as b}from"./circle-check-DNYhvYL_.js";import{D as U}from"./dollar-sign-DkI6MoeO.js";import{A as W}from"./arrow-right-CrJ-cHyE.js";import"./x-DR7-x6Gd.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=H("Leaf",[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]]);/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=H("TreePine",[["path",{d:"m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z",key:"cpyugq"}],["path",{d:"M12 22v-3",key:"kmzjlo"}]]),s=({plot:o,presetId:r=_.id})=>{const[a,l]=x.useState(o),[t,B]=x.useState(o.harvestKg),u=a.treeCount*a.fairValuePerTree,E=a.isRevalued?Math.round(u*.12):0;t*a.pickingCostPerKg;const V=t*18e3,G=()=>{l(n=>({...n,isRevalued:!0}))},O=()=>{l(n=>({...n,isHarvestLogged:!0,harvestKg:t}))};return e.jsxs("div",{className:"min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans",children:[e.jsxs("div",{className:"flex items-center justify-between pb-4 mb-4 border-b border-slate-800",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30",children:e.jsx(q,{className:"w-5 h-5"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h1",{className:"text-base font-black text-white",children:"Gayo Plantation PSAK 69 / IAS 41 Registry"}),e.jsx(v,{variant:"default",className:"text-[10px] py-0 bg-emerald-600 text-white font-bold",children:"SCN-01-05-01"})]}),e.jsxs("p",{className:"text-xs text-slate-400 font-mono",children:["CoA Preset: ",r]})]})]}),e.jsxs(v,{variant:"outline",className:"text-emerald-400 border-emerald-500/40 bg-emerald-500/10 font-mono",children:["Plot: ",a.plotId||"N/A"," (",a.hectares," Ha)"]})]}),e.jsx("div",{className:"max-w-2xl mx-auto space-y-4",children:e.jsxs(D,{className:"p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between pb-2 border-b border-slate-800",children:[e.jsxs("span",{className:"text-xs font-bold text-slate-300 flex items-center gap-1.5",children:[e.jsx(z,{className:"w-4 h-4 text-emerald-400"})," Aset Biologis Pohon Kopi (PSAK 69 / Akun 1410)"]}),e.jsx("span",{className:"text-[11px] font-mono text-slate-400",children:a.locationName})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-3",children:[e.jsxs("div",{className:"p-3 bg-slate-950 rounded-xl border border-slate-800 text-center",children:[e.jsx("span",{className:"text-[10px] text-slate-400 block",children:"Pohon Produktif (1410)"}),e.jsxs("span",{className:"text-sm font-mono font-bold text-emerald-400",children:[a.treeCount.toLocaleString("id-ID")," Pohon"]})]}),e.jsxs("div",{className:"p-3 bg-slate-950 rounded-xl border border-slate-800 text-center",children:[e.jsx("span",{className:"text-[10px] text-slate-400 block",children:"Bibit Belum Menghasilkan (1420)"}),e.jsxs("span",{className:"text-sm font-mono font-bold text-amber-400",children:[a.immatureCount.toLocaleString("id-ID")," Bibit"]})]}),e.jsxs("div",{className:"p-3 bg-slate-950 rounded-xl border border-slate-800 text-center",children:[e.jsx("span",{className:"text-[10px] text-slate-400 block",children:"Nilai Wajar Aset (1410)"}),e.jsx("div",{className:"mt-0.5",children:e.jsx(g,{amount:u,size:"xs",variant:"accent"})})]})]}),e.jsxs("div",{className:"p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center text-xs",children:[e.jsx("span",{className:"text-slate-300 font-bold",children:"Keuntungan Nilai Wajar Aset Biologis (Akun 4210):"}),e.jsx(g,{amount:E,size:"sm",variant:"accent"})]}),a.isRevalued?e.jsxs("div",{className:"p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2",children:[e.jsx(b,{className:"w-4 h-4 text-emerald-400 shrink-0"}),e.jsx("span",{children:"Revaluasi Nilai Wajar PSAK 69 (+12%) Terposting ke Akun 1410 & 4210"})]}):e.jsxs(h,{size:"sm",className:"w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs",onClick:G,"data-testid":"btn-revalue-psak69",children:[e.jsx(U,{className:"w-4 h-4 mr-1"})," Eksekusi Revaluasi Nilai Wajar PSAK 69 (Fair Value Gain)"]})]}),e.jsxs("div",{className:"p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3",children:[e.jsxs("span",{className:"text-xs font-bold text-slate-200 flex items-center gap-1.5",children:[e.jsx(Y,{className:"w-4 h-4 text-amber-400"})," Pencatatan Panen Ceri Kopi Segar (Agricultural Produce)"]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{className:"text-xs text-slate-400",children:"Hasil Petik Ceri Merah (kg):"}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(F,{type:"number","data-testid":"input-harvest-kg",value:t||"",onChange:n=>B(parseFloat(n.target.value)||0),placeholder:"0 kg",className:"bg-slate-900 border-slate-800 text-sm font-mono text-white"}),e.jsx("span",{className:"text-xs text-slate-400 font-bold",children:"kg"})]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{className:"text-xs text-slate-400",children:"Nilai Persediaan Panen (Akun 1350):"}),e.jsx("div",{className:"p-2 bg-slate-900 rounded-lg border border-slate-800",children:e.jsx(g,{amount:V,size:"xs",variant:"accent"})})]})]}),a.isHarvestLogged?e.jsxs("div",{className:"p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2",children:[e.jsx(b,{className:"w-4 h-4 text-emerald-400 shrink-0"}),e.jsxs("span",{children:["Panen ",a.harvestKg," kg Ceri Merah Masuk Persediaan (1350) & Upah Petik (5310)"]})]}):e.jsxs(h,{size:"sm",className:"w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs",onClick:O,"data-testid":"btn-log-harvest",children:[e.jsx(W,{className:"w-4 h-4 mr-1"})," Catat Panen & Jurnal Persediaan Hasil Panen (1350)"]})]})]})})]})},ie={title:"Scenarios/SCN-01-05-01 Gayo Harvest PSAK 69",component:s,parameters:{scenarioId:"SCN-01-05-01",preset:"COA_ID_PLANTATION_AGRI",layout:"fullscreen"},args:{plot:{plotId:"PLOT-GAYO-01",locationName:"Blang Gele, Takengon (1.400 mdpl)",hectares:2.5,treeCount:3500,fairValuePerTree:55e3,immatureCount:500,harvestKg:450,pickingCostPerKg:3500,isRevalued:!1,isHarvestLogged:!1}}},d={args:{plot:{plotId:"PLOT-EMPTY",locationName:"Lahan Kosong Takengon",hectares:0,treeCount:0,fairValuePerTree:45e3,immatureCount:0,harvestKg:0,pickingCostPerKg:3500,isRevalued:!1,isHarvestLogged:!1}}},c={args:{plot:{plotId:"P1",locationName:"Plot 1",hectares:1,treeCount:50,fairValuePerTree:45e3,immatureCount:10,harvestKg:20,pickingCostPerKg:3500,isRevalued:!1,isHarvestLogged:!1}}},m={args:{plot:{plotId:"PLOT-ESTATE-TAKENGON-HIGHLANDS-GAYO-CENTRAL-ACEH-VALLEY-500HA",locationName:"Perkebunan Kopi Organik Dataran Tinggi Takengon HGU No. 88/2026",hectares:500,treeCount:25e4,fairValuePerTree:18e3,immatureCount:5e4,harvestKg:75e3,pickingCostPerKg:3500,isRevalued:!1,isHarvestLogged:!1}}},p={args:{plot:{plotId:"PLOT-GAYO-KENAWAT-04",locationName:"Kebun Arabica Specialty Kenawat (1,400 mdpl)",hectares:5,treeCount:3500,fairValuePerTree:45e3,immatureCount:400,harvestKg:250,pickingCostPerKg:3500,isRevalued:!1,isHarvestLogged:!1}},play:async({canvasElement:o})=>{const r=M(o),a=await r.findByTestId("btn-revalue-psak69");await i.click(a);const l=await r.findByTestId("input-harvest-kg");await i.clear(l),await i.type(l,"250");const t=await r.findByTestId("btn-log-harvest");await i.click(t)}};s.__docgenInfo={description:"",methods:[],displayName:"BiologicalAssetRegistryView",props:{plot:{required:!0,tsType:{name:"PlantationPlot"},description:""},presetId:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'COA_ID_AGRICULTURE_FARM'",computed:!1}}}};var N,f,P;s.parameters={...s.parameters,docs:{...(N=s.parameters)==null?void 0:N.docs,source:{originalSource:`({
  plot: initialPlot,
  presetId = COA_ID_AGRICULTURE_FARM.id
}) => {
  const [plot, setPlot] = useState<PlantationPlot>(initialPlot);
  const [cherryKg, setCherryKg] = useState<number>(initialPlot.harvestKg);
  const totalFairValue = plot.treeCount * plot.fairValuePerTree;
  const fairValueGain = plot.isRevalued ? Math.round(totalFairValue * 0.12) : 0;
  const totalPickingCost = cherryKg * plot.pickingCostPerKg;
  const produceInventoryValue = cherryKg * 18000; // Rp 18.000 / kg market price at harvest point

  const handleRevaluePsak69 = () => {
    setPlot(prev => ({
      ...prev,
      isRevalued: true
    }));
  };
  const handleLogHarvest = () => {
    setPlot(prev => ({
      ...prev,
      isHarvestLogged: true,
      harvestKg: cherryKg
    }));
  };
  return <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <TreePine className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white">Gayo Plantation PSAK 69 / IAS 41 Registry</h1>
              <Badge variant="default" className="text-[10px] py-0 bg-emerald-600 text-white font-bold">
                SCN-01-05-01
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-mono">CoA Preset: {presetId}</p>
          </div>
        </div>

        <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 bg-emerald-500/10 font-mono">
          Plot: {plot.plotId || 'N/A'} ({plot.hectares} Ha)
        </Badge>
      </div>

      {/* Main Registry Card */}
      <div className="max-w-2xl mx-auto space-y-4">
        <Card className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-400" /> Aset Biologis Pohon Kopi (PSAK 69 / Akun 1410)
            </span>
            <span className="text-[11px] font-mono text-slate-400">{plot.locationName}</span>
          </div>

          {/* Asset Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Pohon Produktif (1410)</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {plot.treeCount.toLocaleString('id-ID')} Pohon
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Bibit Belum Menghasilkan (1420)</span>
              <span className="text-sm font-mono font-bold text-amber-400">
                {plot.immatureCount.toLocaleString('id-ID')} Bibit
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">Nilai Wajar Aset (1410)</span>
              <div className="mt-0.5">
                <PriceTag amount={totalFairValue} size="xs" variant="accent" />
              </div>
            </div>
          </div>

          {/* PSAK 69 Fair Value Gain Section */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-bold">Keuntungan Nilai Wajar Aset Biologis (Akun 4210):</span>
              <PriceTag amount={fairValueGain} size="sm" variant="accent" />
            </div>

            {plot.isRevalued ? <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Revaluasi Nilai Wajar PSAK 69 (+12%) Terposting ke Akun 1410 & 4210</span>
              </div> : <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs" onClick={handleRevaluePsak69} data-testid="btn-revalue-psak69">
                <DollarSign className="w-4 h-4 mr-1" /> Eksekusi Revaluasi Nilai Wajar PSAK 69 (Fair Value Gain)
              </Button>}
          </div>

          {/* Harvest Produce Logging Section */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-amber-400" /> Pencatatan Panen Ceri Kopi Segar (Agricultural Produce)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Hasil Petik Ceri Merah (kg):</label>
                <div className="flex items-center gap-2">
                  <Input type="number" data-testid="input-harvest-kg" value={cherryKg || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCherryKg(parseFloat(e.target.value) || 0)} placeholder="0 kg" className="bg-slate-900 border-slate-800 text-sm font-mono text-white" />
                  <span className="text-xs text-slate-400 font-bold">kg</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">Nilai Persediaan Panen (Akun 1350):</label>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                  <PriceTag amount={produceInventoryValue} size="xs" variant="accent" />
                </div>
              </div>
            </div>

            {plot.isHarvestLogged ? <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Panen {plot.harvestKg} kg Ceri Merah Masuk Persediaan (1350) & Upah Petik (5310)</span>
              </div> : <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs" onClick={handleLogHarvest} data-testid="btn-log-harvest">
                <ArrowRight className="w-4 h-4 mr-1" /> Catat Panen & Jurnal Persediaan Hasil Panen (1350)
              </Button>}
          </div>
        </Card>
      </div>
    </div>;
}`,...(P=(f=s.parameters)==null?void 0:f.docs)==null?void 0:P.source}}};var k,C,A;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    plot: {
      plotId: 'PLOT-EMPTY',
      locationName: 'Lahan Kosong Takengon',
      hectares: 0,
      treeCount: 0,
      fairValuePerTree: 45000,
      immatureCount: 0,
      harvestKg: 0,
      pickingCostPerKg: 3500,
      isRevalued: false,
      isHarvestLogged: false
    }
  }
}`,...(A=(C=d.parameters)==null?void 0:C.docs)==null?void 0:A.source}}};var j,y,K;c.parameters={...c.parameters,docs:{...(j=c.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    plot: {
      plotId: 'P1',
      locationName: 'Plot 1',
      hectares: 1,
      treeCount: 50,
      fairValuePerTree: 45000,
      immatureCount: 10,
      harvestKg: 20,
      pickingCostPerKg: 3500,
      isRevalued: false,
      isHarvestLogged: false
    }
  }
}`,...(K=(y=c.parameters)==null?void 0:y.docs)==null?void 0:K.source}}};var w,T,S;m.parameters={...m.parameters,docs:{...(w=m.parameters)==null?void 0:w.docs,source:{originalSource:`{
  args: {
    plot: {
      plotId: 'PLOT-ESTATE-TAKENGON-HIGHLANDS-GAYO-CENTRAL-ACEH-VALLEY-500HA',
      locationName: 'Perkebunan Kopi Organik Dataran Tinggi Takengon HGU No. 88/2026',
      hectares: 500,
      treeCount: 250000,
      fairValuePerTree: 18000,
      immatureCount: 50000,
      harvestKg: 75000,
      pickingCostPerKg: 3500,
      isRevalued: false,
      isHarvestLogged: false
    }
  }
}`,...(S=(T=m.parameters)==null?void 0:T.docs)==null?void 0:S.source}}};var I,L,R;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    plot: {
      plotId: 'PLOT-GAYO-KENAWAT-04',
      locationName: 'Kebun Arabica Specialty Kenawat (1,400 mdpl)',
      hectares: 5,
      treeCount: 3500,
      fairValuePerTree: 45000,
      immatureCount: 400,
      harvestKg: 250,
      pickingCostPerKg: 3500,
      isRevalued: false,
      isHarvestLogged: false
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const revalueBtn = await canvas.findByTestId('btn-revalue-psak69');
    await userEvent.click(revalueBtn);
    const harvestInput = await canvas.findByTestId('input-harvest-kg');
    await userEvent.clear(harvestInput);
    await userEvent.type(harvestInput, '250');
    const logHarvestBtn = await canvas.findByTestId('btn-log-harvest');
    await userEvent.click(logHarvestBtn);
  }
}`,...(R=(L=p.parameters)==null?void 0:L.docs)==null?void 0:R.source}}};const de=["BiologicalAssetRegistryView","EmptyState","ShortInitialState","ExtremeOverflow1Billion","MultiStateHarvestProduce"];export{s as BiologicalAssetRegistryView,d as EmptyState,m as ExtremeOverflow1Billion,p as MultiStateHarvestProduce,c as ShortInitialState,de as __namedExportsOrder,ie as default};
