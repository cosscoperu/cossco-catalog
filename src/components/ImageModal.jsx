import React, { useState, useEffect } from 'react';

// El modal ahora recibe onAdd para el botón de "Añadir al carrito"
export default function ImageModal({ product, onClose, onAdd }) { 
  if (!product) return null;

  // --- LÓGICA DE ESTADO BASADA EN 'colorVariants' ---

  // 1. Estado para saber qué VARIANTE de color está seleccionada (por su índice)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // 2. Estado para la TALLA
  const [selectedSize, setSelectedSize] = useState(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
  
  // 3. Estado para la IMAGEN principal (el índice de la galería izquierda)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- FIN LÓGICA DE ESTADO ---

  // Obtenemos la variante de color activa
  const activeColorVariant = product.colorVariants ? product.colorVariants[selectedVariantIndex] : null;

  // Las imágenes de la galería izquierda AHORA dependen del color seleccionado
  const galleryImages = activeColorVariant ? activeColorVariant.galleryImages : [];
  
  // El nombre del color seleccionado
  const selectedColorName = activeColorVariant ? activeColorVariant.colorName : null;


  // Efecto para resetear los estados cuando el producto cambia
  useEffect(() => {
    setSelectedVariantIndex(0); // Vuelve al primer color
    setCurrentImageIndex(0);    // Vuelve a la primera foto de la galería
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null); // Resetea talla
    
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  // Función para cambiar la IMAGEN principal (galería izquierda)
  const goToImage = (index) => {
    if (index >= 0 && index < galleryImages.length) {
      setCurrentImageIndex(index);
    }
  };

  // Función para cambiar el COLOR (selectores derecha)
  const selectColorVariant = (index) => {
    setSelectedVariantIndex(index);
    setCurrentImageIndex(0); // Resetea la galería a la primera foto del nuevo color
  };

  // Función para el botón "Añadir al carrito"
  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      selectedSize: selectedSize,
      selectedColor: selectedColorName, 
    };
    onAdd(productToAdd); // Llama a la función onAdd (del App.jsx)
    
    // 👇 ¡CAMBIO AQUÍ! Se eliminó la línea 'onClose()' 👇
    // El modal ya NO se cierra automáticamente.
    
    // (Opcional) Podríamos añadir un mensaje de "¡Añadido!"
  };

  // --- Verificación de Seguridad ---
  if (!product.colorVariants || product.colorVariants.length === 0) {
    console.error("Producto sin 'colorVariants'. No se puede renderizar el modal.", product);
    onClose();
    return null; 
  }

  return (
    // Fondo oscuro
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose} 
    >
      {/* Contenedor principal del modal (Layout de 2 columnas) */}
      <div 
        className="relative bg-white w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-lg"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Botón de cerrar (X) */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-4 text-gray-400 hover:text-black text-4xl z-20 focus:outline-none"
          aria-label="Cerrar modal"
        >
          &times; 
        </button>

        {/* --- COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES (DEL COLOR SELECCIONADO) --- */}
        <div className="w-full md:w-3/5 flex flex-col md:flex-row h-1/2 md:h-full">
          {/* Miniaturas (Thumbnails) de la galería */}
          <div className="w-full md:w-20 h-24 md:h-full overflow-x-auto md:overflow-y-auto p-2 flex md:flex-col gap-2 order-2 md:order-1"> 
            {galleryImages.map((imgUrl, index) => (
              <button 
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 md:w-full md:h-auto aspect-square border-2 block rounded-md overflow-hidden focus:outline-none ${currentImageIndex === index ? 'border-dorado' : 'border-transparent opacity-70 hover:opacity-100'}`} 
              >
                <img 
                  src={imgUrl} 
                  alt={`Miniatura ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}
          </div>

          {/* Imagen Principal */}
          <div className="flex-grow flex items-center justify-center overflow-hidden relative order-1 md:order-2 bg-gray-100"> 
            <img 
              src={galleryImages[currentImageIndex]} // Muestra la imagen principal
              alt={`${product.title} - ${selectedColorName} ${currentImageIndex + 1}`} 
              className="max-w-full max-h-full h-full object-contain" 
            />
          </div>
        </div>

        {/* --- COLUMNA DERECHA: DETALLES Y ACCIONES --- */}
        <div className="w-full md:w-2/5 h-1/2 md:h-full p-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
          <div className="text-3xl font-bold text-grafito mb-4">S/ {product.price}</div>

          {/* --- Selector de Color (¡NUEVO!) --- */}
          {/* Mapea sobre 'colorVariants' para crear los selectores de color */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-800 mb-2">Color:</p>
            <div className="flex gap-2 flex-wrap">
              {product.colorVariants.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => selectColorVariant(index)}
                  title={variant.colorName}
                  className={`w-16 h-16 rounded-md border-2 overflow-hidden focus:outline-none ${selectedVariantIndex === index ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}`}
                >
                  <img 
                    src={variant.swatchImage} // Usa la 'swatchImage'
                    alt={variant.colorName}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* --- Selector de Talla --- */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-800 mb-2">Talla:</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((sizeOption, sizeIdx) => (
                  <button
                    key={sizeIdx}
                    onClick={() => setSelectedSize(sizeOption)}
                    className={`px-4 py-2 text-sm font-medium rounded border-2 focus:outline-none ${selectedSize === sizeOption ? 'bg-grafito text-white border-grafito' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {sizeOption}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- Botón de Añadir al Carrito --- */}
          <button 
            onClick={handleAddToCart}
            className="mt-6 w-full rounded-xl bg-dorado px-4 py-3 text-base font-semibold text-grafito hover:bg-doradoHover focus:outline-none"
          >
            Agregar al pedido
          </button>

          {/* Descripción (Opcional) */}
          <div className="mt-6 text-sm text-gray-600">
            <h3 className="font-semibold mb-1">Descripción</h3>
            <p>{product.description || "Descripción no disponible."}</p>
          </div>

        </div>
      </div>
    </div>
  );
}