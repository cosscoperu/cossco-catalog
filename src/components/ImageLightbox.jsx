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

  return (
    // Fondo oscuro - Aplicamos handlers aquí
    <div
      {...handlers}
      className="fixed inset-0 z-[999] bg-black bg-opacity-80" // Quitamos flex
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

      {/* Imagen con posicionamiento absoluto y transform para centrar */}
      {/* 👇 ¡CAMBIO PRINCIPAL AQUÍ! 👇 */}
      <img
        src={images[currentIndex]}
        alt={`Imagen ${currentIndex + 1}`}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] max-h-[90vh] object-contain" // Centrado absoluto
        onClick={(e) => e.stopPropagation()}
      />
      {/* --- FIN CAMBIO --- */}


      {/* Botón Siguiente (>) */}
      <button
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white z-[1001]"
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}