import React from 'react';
import ProductCard from './ProductCard'; // <-- Importamos el nuevo componente

// 'ProductGrid' ya no necesita 'useState', ahora solo organiza las tarjetas
export default function ProductGrid({ products, onAdd, onImageClick }) {
  
  // Si no hay productos, muestra un mensaje (esto es opcional pero bueno)
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 col-span-full">No se encontraron productos.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {products.map((p, idx) => (
        // Ahora solo llamamos a 'ProductCard' para cada producto
        <ProductCard 
          key={p.id || idx}
          product={p}
          onAdd={onAdd}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  )
}