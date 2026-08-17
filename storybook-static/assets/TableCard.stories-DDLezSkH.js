import{j as a}from"./jsx-runtime-DFAAy_2V.js";import{P as B}from"./PriceTag-C-7sONHk.js";import{C as I,T as V,M as P}from"./CapacityBadge-C8Y9RhSA.js";import"./index-Bc2G9s8g.js";const b=({table:e,slotSpan:T=1,viewMode:h="compact",isSelected:S=!1,onClick:y,onOpenOpsModal:i,className:j=""})=>{const s=e.status!=="free"&&e.status!=="reserved",N=e.zoneId==="vip-private"||!!(e.minSpend&&e.minSpend>0),o=h==="expanded",w={free:"border-slate-700/60 bg-slate-900/60 hover:border-slate-500",occupied:"border-amber-500/50 bg-amber-950/20 hover:border-amber-400","open-tab":"border-amber-500/50 bg-amber-950/20 hover:border-amber-400",billing:"border-emerald-500/50 bg-emerald-950/20 hover:border-emerald-400",reserved:"border-blue-500/50 bg-blue-950/20 hover:border-blue-400"}[e.status]||"border-slate-800 bg-slate-900/40",M=S?"ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 shadow-lg shadow-amber-500/10":"",C=T===2?"col-span-2":"col-span-1",O=e.maxCapacity||e.pax||4;return a.jsxs("div",{onClick:y,className:`relative flex flex-col justify-between p-2.5 rounded-xl border transition-all duration-150 cursor-pointer select-none min-w-[105px] ${C} ${w} ${M} ${j}`,children:[a.jsxs("div",{className:"flex items-center justify-between gap-1.5 min-w-0",children:[a.jsxs("div",{className:"flex items-center gap-1.5 min-w-0",children:[a.jsx("span",{className:"font-mono font-bold text-sm text-slate-100 truncate",children:e.name}),N&&a.jsx("span",{className:"text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold shrink-0",children:"VIP"})]}),a.jsxs("div",{className:"flex items-center gap-1 shrink-0",children:[a.jsx(I,{seatedGuests:e.seatedGuests,maxCapacity:O,isOccupied:s}),e.seatedDurationMinutes!==void 0&&e.seatedDurationMinutes>0&&a.jsx(V,{elapsedMinutes:e.seatedDurationMinutes})]})]}),a.jsx("div",{className:"my-2 flex-1 min-w-0 flex flex-col justify-center",children:s?a.jsxs("div",{className:"space-y-1 min-w-0",children:[e.customerName&&a.jsx("p",{className:"text-xs text-slate-200 font-medium truncate",children:e.customerName}),o&&e.orderCount>0&&a.jsxs("p",{className:"text-[10px] text-slate-400 truncate",children:["🍽️ ",e.orderCount," Menu dipesan"]}),e.minSpend&&e.minSpend>0&&a.jsx("div",{className:"mt-1",children:a.jsx(P,{currentBill:e.totalBill||0,minimumSpend:e.minSpend})})]}):a.jsx("div",{className:"py-1",children:a.jsx("span",{className:"text-[11px] text-slate-500 font-mono",children:e.status==="reserved"?"📅 Dipesan":"✨ Siap Digunakan"})})}),a.jsxs("div",{className:"flex items-center justify-between gap-1 pt-1.5 border-t border-slate-800/60 min-w-0",children:[a.jsx("div",{className:"min-w-0 flex-1",children:s&&e.totalBill!==void 0?a.jsx(B,{amount:e.totalBill,size:o?"md":"sm",variant:e.status==="billing"?"emerald":"accent"}):a.jsx("span",{className:"text-[10px] text-slate-500 font-mono",children:"IDR 0"})}),i&&s&&a.jsx("button",{type:"button",onClick:d=>{d.stopPropagation(),i(d)},className:"p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0 text-xs",title:"Opsi Meja (Pindah/Gabung)",children:"⚙️"})]})]})};b.__docgenInfo={description:"",methods:[],displayName:"TableCard",props:{table:{required:!0,tsType:{name:"TableStatus"},description:""},slotSpan:{required:!1,tsType:{name:"union",raw:"1 | 2",elements:[{name:"literal",value:"1"},{name:"literal",value:"2"}]},description:"",defaultValue:{value:"1",computed:!1}},viewMode:{required:!1,tsType:{name:"union",raw:"'compact' | 'expanded'",elements:[{name:"literal",value:"'compact'"},{name:"literal",value:"'expanded'"}]},description:"",defaultValue:{value:"'compact'",computed:!1}},isSelected:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onClick:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onOpenOpsModal:{required:!1,tsType:{name:"signature",type:"function",raw:"(e: React.MouseEvent) => void",signature:{arguments:[{type:{name:"ReactMouseEvent",raw:"React.MouseEvent"},name:"e"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const q={title:"Tier 3 Widgets/TableCard",component:b,parameters:{layout:"centered"},tags:["autodocs"]},t={args:{table:{id:"OUT-01",name:"OUT-01",zoneId:"outdoor",status:"free",capacity:4,seatedGuests:0,totalBill:0,activeTimerMinutes:0,occupiedOrdersCount:0},slotSpan:1,viewMode:"compact",isSelected:!1}},n={args:{table:{id:"OUT-04",name:"OUT-04",zoneId:"outdoor",status:"occupied",capacity:4,seatedGuests:3,totalBill:86e3,activeTimerMinutes:45,occupiedOrdersCount:2,guestName:"Aldi (QR)"},slotSpan:1,viewMode:"compact",isSelected:!0}},r={args:{table:{id:"VIP-01",name:"VIP-01",zoneId:"vip-private",status:"occupied",capacity:10,seatedGuests:8,totalBill:148e4,minSpend:2e6,activeTimerMinutes:75,occupiedOrdersCount:5,guestName:"Drs. H. Bambang Soeprapto"},slotSpan:2,viewMode:"compact",isSelected:!1}};var c,l,m;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    table: {
      id: 'OUT-01',
      name: 'OUT-01',
      zoneId: 'outdoor',
      status: 'free',
      capacity: 4,
      seatedGuests: 0,
      totalBill: 0,
      activeTimerMinutes: 0,
      occupiedOrdersCount: 0
    },
    slotSpan: 1,
    viewMode: 'compact',
    isSelected: false
  }
}`,...(m=(l=t.parameters)==null?void 0:l.docs)==null?void 0:m.source}}};var u,p,x;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    table: {
      id: 'OUT-04',
      name: 'OUT-04',
      zoneId: 'outdoor',
      status: 'occupied',
      capacity: 4,
      seatedGuests: 3,
      totalBill: 86000,
      activeTimerMinutes: 45,
      occupiedOrdersCount: 2,
      guestName: 'Aldi (QR)'
    },
    slotSpan: 1,
    viewMode: 'compact',
    isSelected: true
  }
}`,...(x=(p=n.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var v,f,g;r.parameters={...r.parameters,docs:{...(v=r.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    table: {
      id: 'VIP-01',
      name: 'VIP-01',
      zoneId: 'vip-private',
      status: 'occupied',
      capacity: 10,
      seatedGuests: 8,
      totalBill: 1480000,
      minSpend: 2000000,
      activeTimerMinutes: 75,
      occupiedOrdersCount: 5,
      guestName: 'Drs. H. Bambang Soeprapto'
    },
    slotSpan: 2,
    viewMode: 'compact',
    isSelected: false
  }
}`,...(g=(f=r.parameters)==null?void 0:f.docs)==null?void 0:g.source}}};const R=["FreeTable","OccupiedTable","VipTable"];export{t as FreeTable,n as OccupiedTable,r as VipTable,R as __namedExportsOrder,q as default};
