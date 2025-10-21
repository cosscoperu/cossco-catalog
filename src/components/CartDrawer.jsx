import React, { useState } from "react";

function parsePrice(p) {
  if (!p) return 0;
  const m = String(p).replace(",", ".").match(/([0-9]+(?:\.[0-9]+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

export default function CartDrawer({ cart, onRemove, onQty }) {
  const [minimized, setMinimized] = useState(false);
  const total = cart.reduce((s, it) => s + parsePrice(it.price) * it.qty, 0);
  const number = "51982463746"; // Tu número de WhatsApp

  const lines = cart.map(it => `${it.title} × ${it.qty}`).join("%0A");
  const msg = `Hola 👋, me interesa adquirir los siguientes productos:%0A${lines}%0A%0ATotal estimado: S/ ${total.toFixed(
    2
  )}%0A%0AEnviado desde el catálogo oficial de COSSCO — Solo productos de lujo.`;
  const wa = `https://wa.me/${number}?text=${msg}`;

  return (
    <div className="fixed bottom-4 right-4 z-30 w-[90%] max-w-sm md:max-w-md transition-all duration-500 ease-in-out">
      <div className="rounded-2xl border border-dorado/50 bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
        {/* Encabezado elegante */}
        <div className="flex justify-between items-center p-3 border-b border-plateado/40 bg-gradient-to-r from-dorado/20 to-transparent">
          <h3 className="font-semibold text-grafito text-base">Tu pedido</h3>
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-sm font-semibold text-dorado hover:text-grafito transition-all"
          >
            {minimized ? "🛒 Mostrar" : "🔽 Minimizar"}
          </button>
        </div>

        {/* Contenido */}
        {!minimized && (
          <div className="p-4 max-h-80 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-sm text-plateado text-center py-4">
                🛍️ Aún no has agregado productos.
              </p>
            ) : (
              <>
                {cart.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-plateado/20 last:border-none text-sm"
                  >
                    <div className="flex-1 font-medium">{it.title}</div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onQty(it.title, Math.max(1, it.qty - 1))}
                        className="px-2 border border-plateado/40 rounded hover:bg-plateado/10"
                      >
                        -
                      </button>
                      <input
                        value={it.qty}
                        onChange={e =>
                          onQty(it.title, parseInt(e.target.value || "1"))
                        }
                        className="w-10 text-center border border-plateado/40 rounded"
                      />
                      <button
                        onClick={() => onQty(it.title, it.qty + 1)}
                        className="px-2 border border-plateado/40 rounded hover:bg-plateado/10"
                      >
                        +
                      </button>
                    </div>

                    {/* Botón quitar */}
                    <button
                      onClick={() => onRemove(it.title)}
                      className="text-xs text-plateado hover:text-grafito ml-2"
                    >
                      Quitar
                    </button>
                  </div>
                ))}

                {/* Total */}
                <div className="flex justify-between mt-4 text-sm font-semibold">
                  <span>Total:</span>
                  <span className="text-dorado">S/ {total.toFixed(2)}</span>
                </div>

                {/* Botón WhatsApp */}
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full bg-dorado text-white text-center font-semibold py-2 mt-4 rounded-xl hover:bg-dorado/80 transition"
                >
                  Enviar pedido por WhatsApp
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
