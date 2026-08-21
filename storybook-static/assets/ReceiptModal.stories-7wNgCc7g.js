import{j as r}from"./jsx-runtime-DFAAy_2V.js";import{T as N}from"./ThermalPrinterService-CffwxUAc.js";import{C as f}from"./circle-check-DNYhvYL_.js";import{X as x}from"./x-DR7-x6Gd.js";import{S as y}from"./send-CSwXrqLe.js";import{P as T}from"./printer-DQaZSxTF.js";import"./index-Bc2G9s8g.js";import"./createLucideIcon-CS0JafeY.js";function $(e){const o="--------------------------------",n="================================";let t="";t+=`${m(e.storeName.toUpperCase())}
`,t+=`${m(e.storeAddress)}
`,e.storeNpwp&&(t+=`${m(`NPWP: ${e.storeNpwp}`)}
`),t+=`${n}
`;let a="";if(e.orderType==="dine-in")e.tableNo?a=`[ DINE-IN - ${e.tableNo.toUpperCase().startsWith("MEJA")?e.tableNo.toUpperCase():`MEJA ${e.tableNo.toUpperCase()}`} ]`:a="[ DINE-IN ]";else if(e.orderType==="takeaway"){const s=e.queueNo||(e.tableNo&&e.tableNo.toLowerCase().includes("antrean")?e.tableNo:e.tableNo?`#${e.tableNo}`:"");s?a=`[ TAKEAWAY - ${s.toUpperCase().includes("ANTREAN")?s.toUpperCase():`ANTREAN ${s.startsWith("#")?s:`#${s}`}`} ]`:a="[ TAKEAWAY ]"}else e.orderType==="delivery"&&(a="[ DELIVERY ]");return a&&(t+=`${m(a)}
`,t+=`${o}
`),t+=`No. Struk : ${e.receiptNo}
`,e.transactionRef&&(t+=`Ref Trans : ${e.transactionRef}
`),t+=`Tgl/Waktu : ${e.timestamp}
`,t+=`Kasir     : ${e.cashierName}
`,t+=`Tamu      : ${e.customerName||"Tamu Umum"}
`,t+=`Tipe/Meja : ${e.orderType.toUpperCase()} ${e.tableNo?`(${e.tableNo})`:""}
`,t+=`${o}
`,e.items.forEach(s=>{const p=`${s.name} x${s.qty}`,c=`Rp ${(s.price*s.qty).toLocaleString("id-ID")}`;t+=`${l(p,c,32)}
`}),t+=`${o}
`,t+=`${l("Subtotal",`Rp ${e.subtotal.toLocaleString("id-ID")}`,32)}
`,t+=`${l("PB1 Tax (10%)",`Rp ${e.pb1Tax.toLocaleString("id-ID")}`,32)}
`,e.serviceCharge&&e.serviceCharge>0&&(t+=`${l("Service Fee",`Rp ${e.serviceCharge.toLocaleString("id-ID")}`,32)}
`),e.packagingFee&&e.packagingFee>0&&(t+=`${l("Biaya Kemasan",`Rp ${e.packagingFee.toLocaleString("id-ID")}`,32)}
`),t+=`${n}
`,t+=`${l("TOTAL BAYAR",`Rp ${e.grandTotal.toLocaleString("id-ID")}`,32)}
`,t+=`${o}
`,t+=`Metode Bayar: ${e.paymentMethod.toUpperCase()}
`,e.paymentMethod==="cash"&&e.cashGiven&&(t+=`Tunai Diterima: Rp ${e.cashGiven.toLocaleString("id-ID")}
`,t+=`Kembalian     : Rp ${(e.changeReturned||0).toLocaleString("id-ID")}
`),t+=`${n}
`,t+=`${m("Terima Kasih Atas Kunjungan Anda!")}
`,t}function m(e,o=32){if(e.length>=o)return e.substring(0,o);const n=Math.floor((o-e.length)/2);return" ".repeat(n)+e}function l(e,o,n=32){const t=n-o.length-1,a=e.length>t?e.substring(0,t-1)+"…":e,s=Math.max(1,n-a.length-o.length);return a+" ".repeat(s)+o}const g=({show:e,onClose:o,receiptData:n,onSendWhatsAppReceipt:t})=>{if(!e||!n)return null;const a=$(n),s=async()=>{try{await N.getInstance().printReceipt({storeName:n.storeName||"Kopi Nusantara Senopati",address:n.storeAddress,receiptNumber:n.receiptNo,tableName:n.tableNo,queueNumber:n.queueNo,orderType:n.orderType,cashierName:n.cashierName||"Kasir",timestamp:n.timestamp,items:n.items.map(i=>({name:i.name,qty:i.qty,price:i.price,total:i.price*i.qty})),subtotal:n.subtotal,taxPb1:n.pb1Tax,serviceFee:n.serviceCharge,packagingFee:n.packagingFee,total:n.grandTotal,paymentMethod:n.paymentMethod||"cash",amountTendered:n.cashGiven,changeDue:n.changeReturned,glPostingId:n.glPostingId,transactionRef:n.transactionRef,sha256Hash:n.sha256Hash})}catch{window.print()}},p=()=>{const c="6281298765432";if(t)t(c);else{const i=encodeURIComponent(`*STRUK PELUNASAN DIGITAL*
${a}`);window.open(`https://wa.me/${c}?text=${i}`,"_blank")}};return r.jsx("div",{className:"fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4",children:r.jsxs("div",{className:"bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200",children:[r.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 pb-3",children:[r.jsxs("div",{className:"flex items-center gap-2",children:[r.jsx(f,{className:"w-5 h-5 text-emerald-400"}),r.jsx("h3",{className:"text-sm font-bold text-white",children:"Struk Pelunasan Pembayaran"})]}),r.jsx("button",{type:"button",onClick:o,className:"p-1 text-slate-400 hover:text-white bg-slate-800 rounded-xl",children:r.jsx(x,{className:"w-4 h-4"})})]}),r.jsx("div",{className:"bg-white text-slate-950 font-mono text-[11px] p-4 rounded-2xl border border-slate-300 shadow-inner overflow-y-auto max-h-80 select-all leading-tight",children:r.jsx("pre",{className:"whitespace-pre-wrap font-mono",children:a})}),r.jsxs("div",{className:"grid grid-cols-2 gap-2 pt-1",children:[r.jsxs("button",{type:"button",onClick:p,className:"py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all",children:[r.jsx(y,{className:"w-4 h-4 text-emerald-400"})," Kirim Struk WA"]}),r.jsxs("button",{type:"button",onClick:s,className:"py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md",children:[r.jsx(T,{className:"w-4 h-4"})," Cetak Thermal (ESC/POS)"]})]})]})})};g.__docgenInfo={description:"",methods:[],displayName:"ReceiptModal",props:{show:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},receiptData:{required:!0,tsType:{name:"union",raw:"ReceiptData | null",elements:[{name:"ReceiptData"},{name:"null"}]},description:""},onSendWhatsAppReceipt:{required:!1,tsType:{name:"signature",type:"function",raw:"(phone: string) => void",signature:{arguments:[{type:{name:"string"},name:"phone"}],return:{name:"void"}}},description:""}}};const L={title:"POS/ReceiptModal",component:g,parameters:{layout:"centered"}},d={args:{show:!0,onClose:()=>{},receiptData:{receiptNo:"REC-2026-0816-042",storeName:"Kopitiam Senopati & Roastery",storeAddress:"Jl. Senopati No. 45, Jakarta Selatan",storeNpwp:"01.234.567.8",cashierName:"Siti Nurhaliza",customerName:"Budi Santoso",tableNo:"Meja 04",orderType:"dine-in",timestamp:"2026-08-16 12:30",items:[{name:"Espresso Aren Latte",qty:2,price:28e3},{name:"Almond Croissant",qty:1,price:32e3}],subtotal:88e3,pb1Tax:8800,grandTotal:96800,paymentMethod:"cash",cashGiven:1e5,changeReturned:3200,sha256Hash:"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}}};var u,h,b;d.parameters={...d.parameters,docs:{...(u=d.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    show: true,
    onClose: () => {},
    receiptData: {
      receiptNo: 'REC-2026-0816-042',
      storeName: 'Kopitiam Senopati & Roastery',
      storeAddress: 'Jl. Senopati No. 45, Jakarta Selatan',
      storeNpwp: '01.234.567.8',
      cashierName: 'Siti Nurhaliza',
      customerName: 'Budi Santoso',
      tableNo: 'Meja 04',
      orderType: 'dine-in',
      timestamp: '2026-08-16 12:30',
      items: [{
        name: 'Espresso Aren Latte',
        qty: 2,
        price: 28000
      }, {
        name: 'Almond Croissant',
        qty: 1,
        price: 32000
      }],
      subtotal: 88000,
      pb1Tax: 8800,
      grandTotal: 96800,
      paymentMethod: 'cash',
      cashGiven: 100000,
      changeReturned: 3200,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    }
  }
}`,...(b=(h=d.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};const k=["ThermalSettlementReceipt"];export{d as ThermalSettlementReceipt,k as __namedExportsOrder,L as default};
