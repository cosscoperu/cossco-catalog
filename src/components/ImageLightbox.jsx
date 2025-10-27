import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable'; // Importamos la librería que instalamos

export default function ImageLightbox({ images, startIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Aquí configuramos el "swipe"
  const handlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrevious,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true // Permite deslizar con el mouse en PC
  });

  return (
    // Fondo oscuro semi-transparente
    <div 
      // 👇 ¡CAMBIO AQUÍ! 'z-50' se cambió a 'z-[999]' 👇
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose} // Cierra al hacer clic en el fondo
    >
      {/* Botón de Cerrar (X) */}
      <button
        className="absolute top-4 right-4 text-white text-4xl z-50"
        onClick={onClose}
      >
        &times;
      </button>

      {/* Botón Anterior (<) */}
      <button
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white z-50"
        onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      {/* Contenedor de la Imagen (Aquí aplicamos el 'swipe') */}
      <div 
        {...handlers} 
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Evita que el clic en la imagen cierre el modal
      >
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="max-w-[90vw] max-h-[90vh] object-contain" // La imagen se ajusta a la pantalla
        />
      </div>

      {/* Botón Siguiente (>) */}
      <button
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white z-50"
        onClick={(e) => { e.stopPropagation(); goToNext(); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}