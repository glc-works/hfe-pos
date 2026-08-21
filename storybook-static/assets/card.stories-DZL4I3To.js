import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r}from"./index-Bc2G9s8g.js";import{c as n}from"./utils-CzmKNr9_.js";import{B as j}from"./button-C5fvjkcT.js";import{A as g}from"./award-Cv9eLhjA.js";import"./createLucideIcon-CS0JafeY.js";const o=r.forwardRef(({className:a,...s},t)=>e.jsx("div",{ref:t,className:n("rounded-2xl border border-slate-800 bg-slate-900/60 text-slate-100 shadow-xl backdrop-blur-sm",a),...s}));o.displayName="Card";const l=r.forwardRef(({className:a,...s},t)=>e.jsx("div",{ref:t,className:n("flex flex-col space-y-1.5 p-6",a),...s}));l.displayName="CardHeader";const m=r.forwardRef(({className:a,...s},t)=>e.jsx("h3",{ref:t,className:n("font-bold text-base leading-none tracking-tight text-white",a),...s}));m.displayName="CardTitle";const c=r.forwardRef(({className:a,...s},t)=>e.jsx("p",{ref:t,className:n("text-xs text-slate-400",a),...s}));c.displayName="CardDescription";const x=r.forwardRef(({className:a,...s},t)=>e.jsx("div",{ref:t,className:n("p-6 pt-0",a),...s}));x.displayName="CardContent";const p=r.forwardRef(({className:a,...s},t)=>e.jsx("div",{ref:t,className:n("flex items-center p-6 pt-0",a),...s}));p.displayName="CardFooter";o.__docgenInfo={description:"",methods:[],displayName:"Card"};l.__docgenInfo={description:"",methods:[],displayName:"CardHeader"};p.__docgenInfo={description:"",methods:[],displayName:"CardFooter"};m.__docgenInfo={description:"",methods:[],displayName:"CardTitle"};c.__docgenInfo={description:"",methods:[],displayName:"CardDescription"};x.__docgenInfo={description:"",methods:[],displayName:"CardContent"};const P={title:"UI/Card",component:o,tags:["autodocs"]},d={render:()=>e.jsxs(o,{className:"max-w-sm",children:[e.jsxs(l,{children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs(m,{className:"text-amber-400 flex items-center gap-1.5 text-sm",children:[e.jsx(g,{className:"w-4 h-4"})," Kopi Barista (Gold Tier)"]}),e.jsx("span",{className:"bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-bold",children:"450 Poin Hfe"})]}),e.jsx(c,{children:"Antrean Barista Prioritas & Diskon Biji Kopi 10%"})]}),e.jsx(x,{className:"text-xs text-slate-300",children:"1.5x Point Multiplier aktif untuk transaksi Anda hari ini."}),e.jsx(p,{children:e.jsx(j,{size:"sm",className:"w-full",children:"Tukar Poin Diskon"})})]})},i={render:()=>e.jsxs(o,{className:"max-w-md p-3 flex gap-3",children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80",alt:"Espresso Aren Latte",className:"w-20 h-20 rounded-xl object-cover border border-slate-800"}),e.jsxs("div",{className:"flex-1 flex flex-col justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20",children:"Coffee"}),e.jsx("span",{className:"text-xs font-bold text-emerald-400",children:"Rp 28.000"})]}),e.jsx("h4",{className:"font-bold text-sm text-slate-100 mt-1",children:"Espresso Aren Latte"}),e.jsx("p",{className:"text-[11px] text-slate-400",children:"Double espresso dengan gula aren organik"})]}),e.jsx(j,{size:"sm",className:"self-end text-xs",children:"+ Tambah Pesanan"})]})]})};var f,b,u;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: () => <Card className="max-w-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-amber-400 flex items-center gap-1.5 text-sm">
            <Award className="w-4 h-4" /> Kopi Barista (Gold Tier)
          </CardTitle>
          <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
            450 Poin Hfe
          </span>
        </div>
        <CardDescription>
          Antrean Barista Prioritas & Diskon Biji Kopi 10%
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs text-slate-300">
        1.5x Point Multiplier aktif untuk transaksi Anda hari ini.
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">Tukar Poin Diskon</Button>
      </CardFooter>
    </Card>
}`,...(u=(b=d.parameters)==null?void 0:b.docs)==null?void 0:u.source}}};var N,h,C;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <Card className="max-w-md p-3 flex gap-3">
      <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80" alt="Espresso Aren Latte" className="w-20 h-20 rounded-xl object-cover border border-slate-800" />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Coffee
            </span>
            <span className="text-xs font-bold text-emerald-400">Rp 28.000</span>
          </div>
          <h4 className="font-bold text-sm text-slate-100 mt-1">Espresso Aren Latte</h4>
          <p className="text-[11px] text-slate-400">Double espresso dengan gula aren organik</p>
        </div>
        <Button size="sm" className="self-end text-xs">
          + Tambah Pesanan
        </Button>
      </div>
    </Card>
}`,...(C=(h=i.parameters)==null?void 0:h.docs)==null?void 0:C.source}}};const A=["LoyaltyBadgeCard","ProductMenuItemCard"];export{d as LoyaltyBadgeCard,i as ProductMenuItemCard,A as __namedExportsOrder,P as default};
