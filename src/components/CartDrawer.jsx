import React from 'react'
function parsePrice(p){if(!p) return 0; const m=String(p).replace(',','.').match(/([0-9]+(?:\.[0-9]+)?)/); return m?parseFloat(m[1]):0}
export default function CartDrawer({cart,onRemove,onQty}){
  const total=cart.reduce((s,it)=>s+parsePrice(it.price)*it.qty,0)
  const number="+51932395085"
  const lines=cart.map(it=>`• ${it.title} × ${it.qty}`).join('%0A')
  const msg=`Hola 👋, me interesa adquirir los siguientes productos:%0A${lines}%0A%0ATotal estimado: S/ ${total.toFixed(2)}%0A%0AEnviado desde el catálogo oficial de COSSCO — Solo productos de lujo.`
  const wa=`https://wa.me/${number}?text=${msg}`
  return (<div className="fixed bottom-4 right-4 z-30">
    <div className="w-72 rounded-2xl border border-plateado/40 bg-white shadow-suave">
      <div className="border-b border-plateado/30 p-3 font-semibold">Tu pedido</div>
      <div className="max-h-64 space-y-3 overflow-auto p-3">
        {cart.length===0&&<div className="text-sm text-plateado">Aún no has agregado productos.</div>}
        {cart.map((it,i)=>(<div key={i} className="flex items-center justify-between gap-2">
          <div className="flex-1"><div className="text-sm font-medium">{it.title}</div><div className="text-xs text-plateado">{it.price}</div></div>
          <div className="flex items-center gap-1">
            <button onClick={()=>onQty(it.title, Math.max(1,it.qty-1))} className="h-7 w-7 rounded-lg border border-plateado/40">-</button>
            <input value={it.qty} onChange={e=>onQty(it.title, parseInt(e.target.value||'1'))} className="h-7 w-10 rounded-lg border border-plateado/40 text-center"/>
            <button onClick={()=>onQty(it.title, it.qty+1)} className="h-7 w-7 rounded-lg border border-plateado/40">+</button>
          </div>
          <button onClick={()=>onRemove(it.title)} className="text-xs text-plateado hover:text-grafito">Quitar</button>
        </div>))}
      </div>
      <div className="flex items-center justify-between border-t border-plateado/30 p-3">
        <div className="text-sm">Total:</div><div className="text-base font-semibold">S/ {total.toFixed(2)}</div>
      </div>
      <div className="p-3">
        <a href={wa} target="_blank" rel="noreferrer" className="block w-full rounded-xl bg-dorado px-3 py-2 text-center font-semibold text-grafito hover:bg-doradoHover">Enviar pedido por WhatsApp</a>
      </div>
    </div>
  </div>)
}