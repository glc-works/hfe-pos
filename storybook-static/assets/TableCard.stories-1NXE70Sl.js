import{j as a}from"./jsx-runtime-DFAAy_2V.js";import{P as B}from"./PriceTag-C-7sONHk.js";import{C as I,T as O,M as D}from"./MinSpendPill-DTmKeL-z.js";import"./index-Bc2G9s8g.js";const g=({table:e,slotSpan:h=1,viewMode:k="compact",isSelected:S=!1,onClick:y,onOpenOpsModal:o,className:T=""})=>{const t=e.status!=="free"&&e.status!=="reserved",j=e.zoneId==="vip-private"||!!(e.minSpend&&e.minSpend>0),d=k==="expanded",C={free:"dark:bg-slate-900/60 bg-white border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 hover:border-slate-400 dark:hover:border-slate-500",occupied:"dark:bg-amber-950/20 bg-amber-50 border-amber-400 dark:border-amber-500/50 text-amber-950 dark:text-amber-100 hover:border-amber-500 dark:hover:border-amber-400","open-tab":"dark:bg-amber-950/20 bg-amber-50 border-amber-400 dark:border-amber-500/50 text-amber-950 dark:text-amber-100 hover:border-amber-500 dark:hover:border-amber-400",billing:"dark:bg-emerald-950/20 bg-emerald-50 border-emerald-400 dark:border-emerald-500/50 text-emerald-950 dark:text-emerald-100 hover:border-emerald-500 dark:hover:border-emerald-400",reserved:"dark:bg-blue-950/20 bg-blue-50 border-blue-400 dark:border-blue-500/50 text-blue-950 dark:text-blue-100 hover:border-blue-500 dark:hover:border-blue-400"}[e.status]||"dark:bg-slate-900/40 bg-slate-50 border-slate-200 dark:border-slate-800",w=S?"ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 shadow-lg shadow-amber-500/10":"",N=h===2?"col-span-2":"col-span-1",M=e.maxCapacity||e.pax||4;return a.jsxs("div",{onClick:y,className:`relative flex flex-col justify-between p-2.5 rounded-xl border transition-all duration-150 cursor-pointer select-none min-w-[105px] ${N} ${C} ${w} ${T}`,children:[a.jsxs("div",{className:"flex items-center justify-between gap-1.5 min-w-0",children:[a.jsxs("div",{className:"flex items-center gap-1.5 min-w-0",children:[a.jsx("span",{className:"font-mono font-bold text-sm text-slate-900 dark:text-slate-100 truncate",children:e.name}),j&&a.jsx("span",{className:"text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-semibold shrink-0",children:"VIP"})]}),a.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[a.jsx(I,{seatedGuests:e.seatedGuests,maxCapacity:M,isOccupied:t}),e.seatedDurationMinutes!==void 0&&e.seatedDurationMinutes>0&&a.jsx(O,{elapsedMinutes:e.seatedDurationMinutes})]})]}),a.jsx("div",{className:"my-2 flex-1 min-w-0 flex flex-col justify-center",children:t?a.jsxs("div",{className:"space-y-1 min-w-0",children:[e.customerName&&a.jsx("p",{className:"text-xs text-slate-800 dark:text-slate-200 font-medium truncate",children:e.customerName}),d&&e.orderCount>0&&a.jsxs("p",{className:"text-[10px] text-slate-600 dark:text-slate-400 truncate",children:["🍽️ ",e.orderCount," Menu dipesan"]}),e.minSpend&&e.minSpend>0&&a.jsx("div",{className:"mt-1",children:a.jsx(D,{currentBill:e.totalBill||0,minimumSpend:e.minSpend})})]}):a.jsx("div",{className:"py-1",children:a.jsx("span",{className:"text-[11px] text-slate-500 dark:text-slate-400 font-mono",children:e.status==="reserved"?"📅 Dipesan":"✨ Siap Digunakan"})})}),a.jsxs("div",{className:"flex items-center justify-between gap-1 pt-1.5 border-t border-slate-200 dark:border-slate-800/60 min-w-0",children:[a.jsx("div",{className:"min-w-0 flex-1",children:t&&e.totalBill!==void 0?a.jsx(B,{amount:e.totalBill,size:d?"md":"sm",variant:e.status==="billing"?"emerald":"accent"}):a.jsx("span",{className:"text-[10px] text-slate-400 dark:text-slate-500 font-mono",children:"IDR 0"})}),o&&t&&a.jsx("button",{type:"button",onClick:i=>{i.stopPropagation(),o(i)},className:"p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 text-xs",title:"Opsi Meja (Pindah/Gabung)",children:"⚙️"})]})]})};g.__docgenInfo={description:"",methods:[],displayName:"TableCard",props:{table:{required:!0,tsType:{name:"TableStatus"},description:""},slotSpan:{required:!1,tsType:{name:"union",raw:"1 | 2",elements:[{name:"literal",value:"1"},{name:"literal",value:"2"}]},description:"",defaultValue:{value:"1",computed:!1}},viewMode:{required:!1,tsType:{name:"union",raw:"'compact' | 'expanded'",elements:[{name:"literal",value:"'compact'"},{name:"literal",value:"'expanded'"}]},description:"",defaultValue:{value:"'compact'",computed:!1}},isSelected:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onOpenOpsModal:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.MouseEvent) => void",signature:{arguments:[{type:{name:"ReactMouseEvent",raw:"React.MouseEvent"},name:"e"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const U={title:"Tier 3 Widgets/TableCard",component:g,parameters:{layout:"centered"},tags:["autodocs"]},r={args:{table:{id:"OUT-01",name:"OUT-01",zoneId:"outdoor",status:"free",maxCapacity:4,seatedGuests:0,totalBill:0,orderCount:0},slotSpan:1,viewMode:"compact",isSelected:!1}},s={args:{table:{id:"OUT-04",name:"OUT-04",zoneId:"outdoor",status:"occupied",maxCapacity:4,seatedGuests:3,totalBill:86e3,seatedDurationMinutes:45,orderCount:2,customerName:"Aldi (QR)"},slotSpan:1,viewMode:"compact",isSelected:!0}},n={args:{table:{id:"VIP-01",name:"VIP-01",zoneId:"vip-private",status:"occupied",maxCapacity:10,seatedGuests:8,totalBill:148e4,minSpend:2e6,seatedDurationMinutes:75,orderCount:5,customerName:"Drs. H. Bambang Soeprapto"},slotSpan:2,viewMode:"compact",isSelected:!1}};var l,m,c;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    table: {
      id: 'OUT-01',
      name: 'OUT-01',
      zoneId: 'outdoor',
      status: 'free',
      maxCapacity: 4,
      seatedGuests: 0,
      totalBill: 0,
      orderCount: 0
    },
    slotSpan: 1,
    viewMode: 'compact',
    isSelected: false
  }
}`,...(c=(m=r.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var u,p,x;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    table: {
      id: 'OUT-04',
      name: 'OUT-04',
      zoneId: 'outdoor',
      status: 'occupied',
      maxCapacity: 4,
      seatedGuests: 3,
      totalBill: 86000,
      seatedDurationMinutes: 45,
      orderCount: 2,
      customerName: 'Aldi (QR)'
    },
    slotSpan: 1,
    viewMode: 'compact',
    isSelected: true
  }
}`,...(x=(p=s.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var b,v,f;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    table: {
      id: 'VIP-01',
      name: 'VIP-01',
      zoneId: 'vip-private',
      status: 'occupied',
      maxCapacity: 10,
      seatedGuests: 8,
      totalBill: 1480000,
      minSpend: 2000000,
      seatedDurationMinutes: 75,
      orderCount: 5,
      customerName: 'Drs. H. Bambang Soeprapto'
    },
    slotSpan: 2,
    viewMode: 'compact',
    isSelected: false
  }
}`,...(f=(v=n.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};const q=["FreeTable","OccupiedTable","VipTable"];export{r as FreeTable,s as OccupiedTable,n as VipTable,q as __namedExportsOrder,U as default};
