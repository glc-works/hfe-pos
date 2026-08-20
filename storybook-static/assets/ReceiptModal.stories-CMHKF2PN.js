import{j as r}from"./jsx-runtime-DFAAy_2V.js";import{P as f,T as N}from"./ThermalPrinterService-BdNoeZq0.js";import{C as y}from"./circle-check-DNYhvYL_.js";import{X as $}from"./x-DR7-x6Gd.js";import{S}from"./shield-check-DAfhbeBX.js";import{S as T}from"./send-CSwXrqLe.js";import"./index-Bc2G9s8g.js";import"./createLucideIcon-CS0JafeY.js";function j(e){const s="--------------------------------",n="================================";let t="";return t+=`${m(e.storeName.toUpperCase())}
`,t+=`${m(e.storeAddress)}
`,e.storeNpwp&&(t+=`${m(`NPWP: ${e.storeNpwp}`)}
`),t+=`${n}
`,t+=`No. Struk : ${e.receiptNo}
`,t+=`Tgl/Waktu : ${e.timestamp}
`,t+=`Kasir     : ${e.cashierName}
`,t+=`Tamu      : ${e.customerName||"Tamu Umum"}
`,t+=`Tipe/Meja : ${e.orderType.toUpperCase()} ${e.tableNo?`(${e.tableNo})`:""}
`,t+=`${s}
`,e.items.forEach(a=>{const p=`${a.name} x${a.qty}`,d=`Rp ${(a.price*a.qty).toLocaleString("id-ID")}`;t+=`${i(p,20)}${l(d,12)}
`}),t+=`${s}
`,t+=`${i("Subtotal",20)}${l(`Rp ${e.subtotal.toLocaleString("id-ID")}`,12)}
`,t+=`${i("PB1 Tax (10%)",20)}${l(`Rp ${e.pb1Tax.toLocaleString("id-ID")}`,12)}
`,e.serviceCharge&&(t+=`${i("Service Fee",20)}${l(`Rp ${e.serviceCharge.toLocaleString("id-ID")}`,12)}
`),t+=`${n}
`,t+=`${i("TOTAL BAYAR",20)}${l(`Rp ${e.grandTotal.toLocaleString("id-ID")}`,12)}
`,t+=`${s}
`,t+=`Metode Bayar: ${e.paymentMethod.toUpperCase()}
`,e.paymentMethod==="cash"&&e.cashGiven&&(t+=`Tunai Diterima: Rp ${e.cashGiven.toLocaleString("id-ID")}
`,t+=`Kembalian     : Rp ${(e.changeReturned||0).toLocaleString("id-ID")}
`),t+=`${n}
`,e.sha256Hash&&(t+=`HCB Verify: ${e.sha256Hash.substring(0,16)}...
`),t+=`${m("Terima Kasih Atas Kunjungan Anda!")}
`,t}function m(e,s=32){if(e.length>=s)return e.substring(0,s);const n=Math.floor((s-e.length)/2);return" ".repeat(n)+e}function i(e,s){return e.length>=s?e.substring(0,s):e+" ".repeat(s-e.length)}function l(e,s){return e.length>=s?e.substring(0,s):" ".repeat(s-e.length)+e}const g=({show:e,onClose:s,receiptData:n,onSendWhatsAppReceipt:t})=>{if(!e||!n)return null;const a=j(n),p=async()=>{try{await N.getInstance().printReceipt({storeName:n.storeName||"Kopi Nusantara Senopati",address:n.storeAddress,receiptNumber:n.receiptNo,tableName:n.tableNo,cashierName:n.cashierName||"Kasir",timestamp:n.timestamp,items:n.items.map(o=>({name:o.name,qty:o.qty,price:o.price,total:o.price*o.qty})),subtotal:n.subtotal,taxPb1:n.pb1Tax,serviceFee:n.serviceCharge,total:n.grandTotal,paymentMethod:n.paymentMethod||"cash",amountTendered:n.cashGiven,changeDue:n.changeReturned})}catch{window.print()}},d=()=>{const u="6281298765432";if(t)t(u);else{const o=encodeURIComponent(`*STRUK PELUNASAN DIGITAL*
${a}`);window.open(`https://wa.me/${u}?text=${o}`,"_blank")}};return r.jsx("div",{className:"fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4",children:r.jsxs("div",{className:"bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200",children:[r.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 pb-3",children:[r.jsxs("div",{className:"flex items-center gap-2",children:[r.jsx(y,{className:"w-5 h-5 text-emerald-400"}),r.jsx("h3",{className:"text-sm font-bold text-white",children:"Struk Pelunasan Pembayaran"})]}),r.jsx("button",{type:"button",onClick:s,className:"p-1 text-slate-400 hover:text-white bg-slate-800 rounded-xl",children:r.jsx($,{className:"w-4 h-4"})})]}),r.jsx("div",{className:"bg-white text-slate-950 font-mono text-[11px] p-4 rounded-2xl border border-slate-300 shadow-inner overflow-y-auto max-h-80 select-all leading-tight",children:r.jsx("pre",{className:"whitespace-pre-wrap font-mono",children:a})}),n.sha256Hash&&r.jsxs("div",{className:"bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex items-center gap-2 text-emerald-400 text-xs",children:[r.jsx(S,{className:"w-4 h-4 text-emerald-400 flex-shrink-0"}),r.jsxs("span",{className:"truncate",children:["Terverifikasi Jurnal HCB: ",r.jsxs("strong",{children:[n.sha256Hash.substring(0,12),"..."]})]})]}),r.jsxs("div",{className:"grid grid-cols-2 gap-2 pt-1",children:[r.jsxs("button",{type:"button",onClick:d,className:"py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all",children:[r.jsx(T,{className:"w-4 h-4 text-emerald-400"})," Kirim Struk WA"]}),r.jsxs("button",{type:"button",onClick:p,className:"py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md",children:[r.jsx(f,{className:"w-4 h-4"})," Cetak Thermal (ESC/POS)"]})]})]})})};g.__docgenInfo={description:"",methods:[],displayName:"ReceiptModal",props:{show:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},receiptData:{required:!0,tsType:{name:"union",raw:"ReceiptData | null",elements:[{name:"ReceiptData"},{name:"null"}]},description:""},onSendWhatsAppReceipt:{required:!1,tsType:{name:"signature",type:"function",raw:"(phone: string) => void",signature:{arguments:[{type:{name:"string"},name:"phone"}],return:{name:"void"}}},description:""}}};const M={title:"POS/ReceiptModal",component:g,parameters:{layout:"centered"}},c={args:{show:!0,onClose:()=>{},receiptData:{receiptNo:"REC-2026-0816-042",storeName:"Kopitiam Senopati & Roastery",storeAddress:"Jl. Senopati No. 45, Jakarta Selatan",storeNpwp:"01.234.567.8",cashierName:"Siti Nurhaliza",customerName:"Budi Santoso",tableNo:"Meja 04",orderType:"dine-in",timestamp:"2026-08-16 12:30",items:[{name:"Espresso Aren Latte",qty:2,price:28e3},{name:"Almond Croissant",qty:1,price:32e3}],subtotal:88e3,pb1Tax:8800,grandTotal:96800,paymentMethod:"cash",cashGiven:1e5,changeReturned:3200,sha256Hash:"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}}};var h,b,x;c.parameters={...c.parameters,docs:{...(h=c.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(x=(b=c.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};const q=["ThermalSettlementReceipt"];export{c as ThermalSettlementReceipt,q as __namedExportsOrder,M as default};
