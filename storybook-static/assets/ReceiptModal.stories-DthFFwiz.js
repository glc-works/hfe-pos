import{j as n}from"./jsx-runtime-DFAAy_2V.js";import{C as f}from"./circle-check-DNYhvYL_.js";import{X as N}from"./x-DR7-x6Gd.js";import{S as y}from"./shield-check-DAfhbeBX.js";import{S as $}from"./send-CSwXrqLe.js";import{c as S}from"./createLucideIcon-CS0JafeY.js";import"./index-Bc2G9s8g.js";/**
 * @license lucide-react v0.453.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=S("Printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);function j(e){const r="--------------------------------",a="================================";let t="";return t+=`${l(e.storeName.toUpperCase())}
`,t+=`${l(e.storeAddress)}
`,e.storeNpwp&&(t+=`${l(`NPWP: ${e.storeNpwp}`)}
`),t+=`${a}
`,t+=`No. Struk : ${e.receiptNo}
`,t+=`Tgl/Waktu : ${e.timestamp}
`,t+=`Kasir     : ${e.cashierName}
`,t+=`Tamu      : ${e.customerName||"Tamu Umum"}
`,t+=`Tipe/Meja : ${e.orderType.toUpperCase()} ${e.tableNo?`(${e.tableNo})`:""}
`,t+=`${r}
`,e.items.forEach(s=>{const m=`${s.name} x${s.qty}`,p=`Rp ${(s.price*s.qty).toLocaleString("id-ID")}`;t+=`${o(m,20)}${i(p,12)}
`}),t+=`${r}
`,t+=`${o("Subtotal",20)}${i(`Rp ${e.subtotal.toLocaleString("id-ID")}`,12)}
`,t+=`${o("PB1 Tax (10%)",20)}${i(`Rp ${e.pb1Tax.toLocaleString("id-ID")}`,12)}
`,e.serviceCharge&&(t+=`${o("Service Fee",20)}${i(`Rp ${e.serviceCharge.toLocaleString("id-ID")}`,12)}
`),t+=`${a}
`,t+=`${o("TOTAL BAYAR",20)}${i(`Rp ${e.grandTotal.toLocaleString("id-ID")}`,12)}
`,t+=`${r}
`,t+=`Metode Bayar: ${e.paymentMethod.toUpperCase()}
`,e.paymentMethod==="cash"&&e.cashGiven&&(t+=`Tunai Diterima: Rp ${e.cashGiven.toLocaleString("id-ID")}
`,t+=`Kembalian     : Rp ${(e.changeReturned||0).toLocaleString("id-ID")}
`),t+=`${a}
`,e.sha256Hash&&(t+=`HCB Verify: ${e.sha256Hash.substring(0,16)}...
`),t+=`${l("Terima Kasih Atas Kunjungan Anda!")}
`,t}function l(e,r=32){if(e.length>=r)return e.substring(0,r);const a=Math.floor((r-e.length)/2);return" ".repeat(a)+e}function o(e,r){return e.length>=r?e.substring(0,r):e+" ".repeat(r-e.length)}function i(e,r){return e.length>=r?e.substring(0,r):" ".repeat(r-e.length)+e}const b=({show:e,onClose:r,receiptData:a,onSendWhatsAppReceipt:t})=>{if(!e||!a)return null;const s=j(a),m=()=>{window.print()},p=()=>{const d="6281298765432";if(t)t(d);else{const g=encodeURIComponent(`*STRUK PELUNASAN DIGITAL*
${s}`);window.open(`https://wa.me/${d}?text=${g}`,"_blank")}};return n.jsx("div",{className:"fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4",children:n.jsxs("div",{className:"bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-4 sm:p-6 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200",children:[n.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 pb-3",children:[n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsx(f,{className:"w-5 h-5 text-emerald-400"}),n.jsx("h3",{className:"text-sm font-bold text-white",children:"Struk Pelunasan Pembayaran"})]}),n.jsx("button",{type:"button",onClick:r,className:"p-1 text-slate-400 hover:text-white bg-slate-800 rounded-xl",children:n.jsx(N,{className:"w-4 h-4"})})]}),n.jsx("div",{className:"bg-white text-slate-950 font-mono text-[11px] p-4 rounded-2xl border border-slate-300 shadow-inner overflow-y-auto max-h-80 select-all leading-tight",children:n.jsx("pre",{className:"whitespace-pre-wrap font-mono",children:s})}),a.sha256Hash&&n.jsxs("div",{className:"bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 flex items-center gap-2 text-emerald-400 text-xs",children:[n.jsx(y,{className:"w-4 h-4 text-emerald-400 flex-shrink-0"}),n.jsxs("span",{className:"truncate",children:["Terverifikasi Jurnal HCB: ",n.jsxs("strong",{children:[a.sha256Hash.substring(0,12),"..."]})]})]}),n.jsxs("div",{className:"grid grid-cols-2 gap-2 pt-1",children:[n.jsxs("button",{type:"button",onClick:p,className:"py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all",children:[n.jsx($,{className:"w-4 h-4 text-emerald-400"})," Kirim Struk WA"]}),n.jsxs("button",{type:"button",onClick:m,className:"py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md",children:[n.jsx(T,{className:"w-4 h-4"})," Cetak Thermal (ESC/POS)"]})]})]})})};b.__docgenInfo={description:"",methods:[],displayName:"ReceiptModal",props:{show:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},receiptData:{required:!0,tsType:{name:"union",raw:"ReceiptData | null",elements:[{name:"ReceiptData"},{name:"null"}]},description:""},onSendWhatsAppReceipt:{required:!1,tsType:{name:"signature",type:"function",raw:"(phone: string) => void",signature:{arguments:[{type:{name:"string"},name:"phone"}],return:{name:"void"}}},description:""}}};const M={title:"POS/ReceiptModal",component:b,parameters:{layout:"centered"}},c={args:{show:!0,onClose:()=>{},receiptData:{receiptNo:"REC-2026-0816-042",storeName:"Kopitiam Senopati & Roastery",storeAddress:"Jl. Senopati No. 45, Jakarta Selatan",storeNpwp:"01.234.567.8",cashierName:"Siti Nurhaliza",customerName:"Budi Santoso",tableNo:"Meja 04",orderType:"dine-in",timestamp:"2026-08-16 12:30",items:[{name:"Espresso Aren Latte",qty:2,price:28e3},{name:"Almond Croissant",qty:1,price:32e3}],subtotal:88e3,pb1Tax:8800,grandTotal:96800,paymentMethod:"cash",cashGiven:1e5,changeReturned:3200,sha256Hash:"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}}};var u,h,x;c.parameters={...c.parameters,docs:{...(u=c.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(x=(h=c.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};const P=["ThermalSettlementReceipt"];export{c as ThermalSettlementReceipt,P as __namedExportsOrder,M as default};
