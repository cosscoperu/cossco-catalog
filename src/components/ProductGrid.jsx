import React from 'react'
export default function ProductGrid({products,onAdd}){
  return (<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
    {products.map((p,idx)=>(<div key={idx} className="overflow-hidden rounded-2xl border border-plateado/40 bg-white shadow-suave transition hover:-translate-y-0.5">
      <div className="aspect-square bg-white p-2 flex items-center justify-center">
        {p.image?(<img src={p.image} alt={p.title} className="h-full w-full object-contain"/>):(<div className="text-xs text-plateado">Sin imagen</div>)}
      </div>
      <div className="p-3">
        <div className="line-clamp-2 text-sm font-medium">{p.title}</div>
        <div className="mt-1 text-base font-semibold">{p.price}</div>
        <button onClick={()=>onAdd(p)} className="mt-2 w-full rounded-xl bg-dorado px-3 py-2 text-sm font-semibold text-grafito hover:bg-doradoHover">Agregar al pedido</button>
      </div>
    </div>))}
  </div>)
}