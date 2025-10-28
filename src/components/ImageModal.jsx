import React, { useState, useEffect } from 'react';
import ImageLightbox from './ImageLightbox'; // Importamos el Lightbox

export default function ImageModal({ product, onClose, onAdd }) {
  if (!product) return null;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const activeColorVariant = product.colorVariants ? product.colorVariants[selectedVariantIndex] : null;
  const galleryImages = activeColorVariant ? activeColorVariant.galleryImages : [];
  const selectedColorName = activeColorVariant ? activeColorVariant.colorName : null;

  useEffect(() => {
    setSelectedVariantIndex(0);
    setCurrentImageIndex(0);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  const goToImage = (index) => {
    if (index >= 0 && index < galleryImages.length) {
      setCurrentImageIndex(index);
    }
  };

  const selectColorVariant = (index) => {
    setSelectedVariantIndex(index);
    setCurrentImageIndex(0);
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      selectedSize: selectedSize,
      selectedColor: selectedColorName,
    };
    onAdd(productToAdd);
    // Ya no cierra el modal
  };

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
      {/* Contenedor principal del modal */}
      <div
        className="relative bg-white w-full max-w-6xl h-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl overflow-hidden rounded-lg" // <- overflow-hidden aquí
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

        {/* --- COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES --- */}
        <div className="w-full md:w-3/5 flex flex-col md:flex-row h-1/2 md:h-full"> {/* <- Altura partida en móvil */}
          {/* Miniaturas */}
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
          <div
            className="flex-grow flex items-center justify-center overflow-hidden relative order-1 md:order-2 bg-gray-100 cursor-zoom-in h-full" // <- Asegura h-full
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={galleryImages[currentImageIndex]}
              alt={`${product.title} - ${selectedColorName} ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain" // <- object-contain aquí
            />
          </div>
        </div>

        {/* --- COLUMNA DERECHA: DETALLES Y ACCIONES --- */}
        {/* 👇 ¡CAMBIO AQUÍ! Añadido 'flex flex-col' para distribuir espacio 👇 */}
        <div className="w-full md:w-2/5 h-1/2 md:h-full flex flex-col"> {/* <- Contenedor flex vertical */}

          {/* Área de Contenido Scrollable */}
          {/* 👇 Añadido 'overflow-y-auto flex-grow' 👇 */}
          <div className="p-6 overflow-y-auto flex-grow">
            <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
            <div className="text-3xl font-bold text-grafito mb-4">S/ {product.price}</div>

            {/* --- Selector de Color --- */}
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
                      src={variant.swatchImage}
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

            {/* Descripción (Opcional) */}
            <div className="mt-6 text-sm text-gray-600">
              <h3 className="font-semibold mb-1">Descripción</h3>
              <p>{product.description || "Descripción no disponible."}</p>
            </div>
          </div> {/* <-- Fin del área scrollable */}

          {/* Área del Botón Fijo */}
          {/* 👇 Añadido 'p-6 border-t' y quitado 'mt-6' del botón 👇 */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={handleAddToCart}
              className="w-full rounded-xl bg-dorado px-4 py-3 text-base font-semibold text-grafito hover:bg-doradoHover focus:outline-none"
            >
              Agregar al pedido
            </button>
          </div>

        </div> {/* <-- Fin columna derecha */}
      </div> {/* <-- Fin contenedor principal */}

      {/* Renderizar el Lightbox si está abierto */}
      {isLightboxOpen && (
        <ImageLightbox
          images={galleryImages}
          startIndex={currentImageIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}