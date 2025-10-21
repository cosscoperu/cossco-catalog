COSSCO — Catálogo Interactivo (React + TailwindCSS)

Descripción
COSSCO es un catálogo web moderno para productos de lujo.
Los clientes pueden seleccionar productos y enviar su pedido por WhatsApp.

Requisitos
- Node.js 18+

Instalación y ejecución local
1) npm install
2) npm run dev
3) Abre http://localhost:5173

Publicación rápida
- Vercel (recomendada): importa la carpeta y despliega.
- Netlify: arrastra la carpeta al panel y despliega.

Editar productos
- Abre src/data/products.json (o usa src/data/products-template.json como base)
- Coloca imágenes en /public/img/

Mensaje automático de WhatsApp
Hola 👋, me interesa adquirir los siguientes productos:
• [nombre del producto] × [cantidad]
• [nombre del producto] × [cantidad]

Total estimado: S/ [monto total]

Enviado desde el catálogo oficial de COSSCO — Solo productos de lujo.

Para ajustar el formato o el número, edita:
src/components/CartDrawer.jsx
