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

  // --- MODIFICACIÓN: Mensaje de WhatsApp ---
  const lines = cart.map(it => {
    let itemDescription = `${it.title}`;
    if (it.selectedColor) {
      itemDescription += ` (Color: ${it.selectedColor})`;
    }
    if (it.selectedSize) {
      itemDescription += ` (Talla: ${it.selectedSize})`;
    }
    return `${itemDescription} × ${it.qty}`;
  }).join("%0A");

  const msg = `Hola 👋, me interesa adquirir los siguientes productos:%0A${lines}%0A%0ATotal estimado: S/ ${total.toFixed(
    2
  )}%0A%0AEnviado desde el catálogo oficial de COSSCO — Solo productos de lujo.`;
  const wa = `https://wa.me/${number}?text=${msg}`;
  // --- FIN MODIFICACIÓN ---

  // Imagen de respaldo por si algo falla
  const placeholderImage = "https://placehold.co/150x150?text=Foto";

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
                {cart.map((it, i) => {
                  
                  // --- NUEVA LÓGICA: Encontrar la imagen correcta ---
                  // Buscamos en 'colorVariants' la variante que coincida con el 'selectedColor'
                  const selectedVariant = it.colorVariants?.find(
                    variant => variant.colorName === it.selectedColor
                  );
                  // Usamos la 'swatchImage' de esa variante, o la primera que encontremos como respaldo
                  const imageUrl = selectedVariant?.swatchImage || 
                                   (it.colorVariants && it.colorVariants.length > 0 ? it.colorVariants[0].swatchImage : placeholderImage);
                  // --- FIN NUEVA LÓGICA ---

                  return (
                    <div
                      key={`${it.id}-${it.selectedSize || 'no-size'}-${it.selectedColor || 'no-color'}`}
                      // --- MODIFICACIÓN: Añadido flex y items-center ---
                      className="flex items-center justify-between py-2 border-b border-plateado/20 last:border-none text-sm gap-2"
                    >
                      {/* --- NUEVO: Imagen del Producto --- */}
                      <img 
                        src={imageUrl} 
                        alt={it.title}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-md object-cover shadow-sm flex-shrink-0"
                      />
                      {/* --- FIN NUEVO --- */}

                      <div className="flex-1 font-medium min-w-0">
                        <p className="truncate">{it.title}</p>
                        {(it.selectedColor || it.selectedSize) && (
                          <p className="text-xs text-gray-500">
                            {it.selectedColor && `Color: ${it.selectedColor}`}
                            {it.selectedColor && it.selectedSize && " | "}
                            {it.selectedSize && `Talla: ${it.selectedSize}`}
                          </p>
                        )}
                      </div>

                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onQty(it, Math.max(1, it.qty - 1))}
                          className="px-2 border border-plateado/40 rounded hover:bg-plateado/10"
                        >
                          -
                        </button>
                        <input
                          type="number" // <-- Mejorado para accesibilidad
                          value={it.qty}
                          onChange={e =>
                            onQty(it, parseInt(e.target.value || "1"))
                          }
                          className="w-10 text-center border border-plateado/40 rounded"
                        />
                        <button
                          onClick={() => onQty(it, it.qty + 1)}
                          className="px-2 border border-plateado/40 rounded hover:bg-plateado/10"
                        >
                          +
                        </button>
                      </div>

                      {/* Botón quitar */}
                      <button
                        onClick={() => onRemove(it)}
                        className="text-red-500 hover:text-red-700 ml-1 flex-shrink-0"
                        title="Quitar producto"
                      >
                        {/* --- MODIFICACIÓN: Ícono de basura --- */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {/* --- FIN MODIFICACIÓN --- */}
                      </button>
                    </div>
                  );
                })}

                {/* Total */}
                <div className="flex justify-between mt-4 text-base font-semibold">
                  <span>Total:</span>
                  <span className="text-dorado">S/ {total.toFixed(2)}</span>
                </div>

                {/* Botón WhatsApp */}
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  // --- MODIFICACIÓN: Estilo más premium ---
                  className="block w-full bg-green-500 text-white text-center font-bold py-3 mt-4 rounded-xl hover:bg-green-600 transition shadow-lg"
                >
                  ✅ Enviar pedido por WhatsApp
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}