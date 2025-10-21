import React from 'react'
export default function Header({query,setQuery}){
  return (<header className="sticky top-0 z-20 border-b border-plateado/30 bg-marfil/80 backdrop-blur">
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="COSSCO" className="h-9 w-9 rounded-xl shadow-suave"/>
        <div><div className="text-lg font-semibold tracking-wide">COSSCO</div>
        <div className="text-xs text-plateado -mt-0.5">Solo productos de lujo</div></div>
      </div>
      <div className="relative w-full max-w-xl">
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar productos…" className="w-full rounded-xl border border-plateado/40 bg-white px-4 py-2 outline-none focus:border-dorado"/>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-plateado">🔎</div>
      </div>
      <div className="text-sm text-plateado">🛒</div>
    </div></header>)
}