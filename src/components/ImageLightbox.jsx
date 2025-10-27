import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export default function ImageLightbox({ images, startIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrevious,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  // --- NUEVA FUNCIÓN ---
  // Al hacer clic en "Añadir", simplemente cerramos el lightbox
  const handleAddToCartClick = (e) => {
    e.stopPropagation(); // Evita que se cierre por el clic en el fondo
    onClose(); // Cierra el lightbox para volver al modal
  }
  // --- FIN NUEVA FUNCIÓN ---

  return (
    // Fondo oscuro - Aplicamos handlers aquí
    <div
      {...handlers}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80" // Flexbox centrado
      onClick={onClose}
    >
      {/* Botón de Cerrar (X) */}
      <button
        className="absolute top-4 right-4 text-white text-4xl z-[1001]"
        onClick={onClose}
      >
        &times;
      </button>

      {/* Botón Anterior (<) */}
      <button
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white z-[1001]"
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      {/* Imagen */}
      <img
        src={images[currentIndex]}
        alt={`Imagen ${currentIndex + 1}`}
        className="block m-auto max-w-[90vw] max-h-[85vh] object-contain" // Reducido max-h para dejar espacio al botón
        onClick={(e) => e.stopPropagation()}
      />


      {/* Botón Siguiente (>) */}
      <button
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white z-[1001]"
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* --- NUEVO BOTÓN: Añadir al Carrito --- */}
      <div className="absolute bottom-4 left-4 right-4 z-[1001]">
        <button
          onClick={handleAddToCartClick}
          className="w-full bg-dorado text-grafito font-bold py-3 px-4 rounded-lg hover:bg-doradoHover transition"
        >
          Añadir al carrito
        </button>
      </div>
      {/* --- FIN NUEVO BOTÓN --- */}

    </div>
  );
}