import React from 'react';

// --- ¡FUNCIÓN CORREGIDA! ---
// Ahora busca la imagen en 'colorVariants'
const getImageUrl = (product) => {
  // 1. Busca en la nueva estructura 'colorVariants'
  if (product.colorVariants && product.colorVariants.length > 0 && product.colorVariants[0].swatchImage) {
    return product.colorVariants[0].swatchImage; // <-- ¡ESTA ES LA LÍNEA CORRECTA!
  }
  
  // 2. (Respaldo) Busca en la estructura antigua, por si acaso
  if (product.imageUrls && product.imageUrls.length > 0) {
    return product.imageUrls[0];
  }
  if (product.image) {
    return product.image;
  }
  
  // 3. Si no hay nada
  return null;
};
// --- FIN DE LA CORRECCIÓN ---

export default function ProductCard({ product, onImageClick }) {
  
  const imageUrl = getImageUrl(product);

  return (
    <div 
      // Esta clase redondea la tarjeta completa
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* --- DIV DE IMAGEN CLICABLE --- */}
      <div 
        className="aspect-square cursor-pointer bg-gray-100" // Fondo gris claro si no hay imagen
        onClick={() => onImageClick(product)} // Esto abre el modal
        tabIndex="0"
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.title} 
            className="h-full w-full object-cover" // object-cover para el look Temu
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">Sin imagen</div>
        )}
      </div>
      {/* --- FIN DIV DE IMAGEN --- */}

      {/* --- DIV DE TEXTO (AHORA TAMBIÉN CLICABLE) --- */}
      <div 
        className="p-3 bg-white cursor-pointer"
        onClick={() => onImageClick(product)}
      > 
        <div className="line-clamp-2 text-sm font-medium text-gray-800">{product.title}</div>
        
        {/* Mostramos el precio */}
        <div className="mt-1 text-base font-semibold text-gray-900">S/ {product.price}</div>
      </div>
    </div>
  );
}