/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Tus colores y sombras
      colors: {
        'dorado': '#D4AF37', 
        'doradoHover': '#E0C160', 
        'plateado': '#C0C0C0', 
        'grafito': '#232323', 
        'marfil': '#FAF3E0', // Añade este si lo usas en App.jsx bg-marfil
      },
      boxShadow: {
        'suave': '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'fondo-lujo': "url('/fondo-lujoso.jpg')", // Lo dejamos por si lo usas
      }
    },
  },
  // 👇 ¡AÑADE ESTA SECCIÓN 'plugins'! 👇
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}