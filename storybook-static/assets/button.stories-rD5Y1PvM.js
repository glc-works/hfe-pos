import{j as s}from"./jsx-runtime-DFAAy_2V.js";import{B as o}from"./button-C5fvjkcT.js";import{C as S}from"./coffee-Hp_z8jgf.js";import{C as B}from"./credit-card-iWSFWPWy.js";import"./index-Bc2G9s8g.js";import"./utils-CzmKNr9_.js";import"./createLucideIcon-CS0JafeY.js";const K={title:"UI/Button",component:o,tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","secondary","destructive","outline","ghost","link"]},size:{control:"select",options:["default","sm","lg","icon"]}}},r={args:{children:"Tambah Pesanan",variant:"default"}},a={args:{children:"Tutup Shift Kasir",variant:"secondary"}},e={render:()=>s.jsxs(o,{variant:"outline",children:[s.jsx(S,{className:"w-4 h-4 mr-2 text-amber-500"})," Pesan Kopi Sekarang"]})},t={render:()=>s.jsxs(o,{size:"lg",className:"w-full font-bold",children:[s.jsx(B,{className:"w-4 h-4 mr-2"})," Bayar QRIS & Kirim Dapur (Rp 86.000)"]})};var n,i,c;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    children: 'Tambah Pesanan',
    variant: 'default'
  }
}`,...(c=(i=r.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var m,u,d;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: 'Tutup Shift Kasir',
    variant: 'secondary'
  }
}`,...(d=(u=a.parameters)==null?void 0:u.docs)==null?void 0:d.source}}};var l,p,f;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <Button variant="outline">
      <Coffee className="w-4 h-4 mr-2 text-amber-500" /> Pesan Kopi Sekarang
    </Button>
}`,...(f=(p=e.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};var h,g,y;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <Button size="lg" className="w-full font-bold">
      <CreditCard className="w-4 h-4 mr-2" /> Bayar QRIS & Kirim Dapur (Rp 86.000)
    </Button>
}`,...(y=(g=t.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};const N=["PrimaryAmber","Secondary","OutlineWithIcon","PayFirstCheckoutButton"];export{e as OutlineWithIcon,t as PayFirstCheckoutButton,r as PrimaryAmber,a as Secondary,N as __namedExportsOrder,K as default};
