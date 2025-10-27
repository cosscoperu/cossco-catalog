import React, { useMemo, useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

// Tus componentes
import Header from "./components/Header.jsx";
import ProductGrid from "./components/ProductGrid.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import AboutSection from "./components/AboutSection.jsx";
import Footer from "./components/Footer.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import ImageModal from "./components/ImageModal.jsx";

export default function App() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [welcome, setWelcome] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [productsData, setProductsData] = useState([]);

  // --- NUEVOS ESTADOS PARA EL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  // --- FIN NUEVOS ESTADOS ---

  // Cargar productos de Firebase
  useEffect(() => {
    const productsRef = collection(db, "products");
    const unsub = onSnapshot(productsRef, (snapshot) => {
      const firebaseProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProductsData(firebaseProducts);
      console.log("Productos cargados desde Firebase:", firebaseProducts);
    });
    return () => unsub();
  }, []);

  // Mensaje de bienvenida
  useEffect(() => {
    const t = setTimeout(() => setWelcome(false), 2000);
    return () => clearTimeout(t);
  }, []);

  // Filtrar productos
  const products = useMemo(() => {
    let currentProducts = productsData;
    if (selectedCategory !== "Todos") {
      currentProducts = currentProducts.filter(product => product.category === selectedCategory);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      currentProducts = currentProducts.filter((p) =>
        String(p.title).toLowerCase().includes(q)
      );
    }
    return currentProducts;
  }, [query, selectedCategory, productsData]);

  // --- NUEVAS FUNCIONES PARA EL MODAL ---
  const openModal = (product) => {
    console.log("Abriendo modal para:", product); // Para depurar
    setSelectedProductForModal(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProductForModal(null);
  };
  // --- FIN NUEVAS FUNCIONES ---

  // --- Funciones del carrito (actualizadas) ---
  const generateCartItemId = (item) => {
    return `${item.id}-${item.selectedSize || 'no-size'}-${item.selectedColor || 'no-color'}`;
  };

  function addToCart(item) {
    setCart((prev) => {
      const cartItemId = generateCartItemId(item);
      const existingItemIndex = prev.findIndex((x) => generateCartItemId(x) === cartItemId);
      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = { ...updatedCart[existingItemIndex], qty: updatedCart[existingItemIndex].qty + 1 };
        return updatedCart;
      } else {
        return [...prev, { ...item, qty: 1 }];
      }
    });
  }

  function removeFromCart(itemToRemove) {
    const cartItemIdToRemove = generateCartItemId(itemToRemove);
    setCart((prev) => prev.filter((item) => generateCartItemId(item) !== cartItemIdToRemove));
  }

  function changeQty(itemToUpdate, newQty) {
    const cartItemIdToUpdate = generateCartItemId(itemToUpdate);
    setCart((prev) =>
      prev.map((item) =>
        generateCartItemId(item) === cartItemIdToUpdate ? { ...item, qty: Math.max(1, newQty) } : item
      )
    );
  }
  // --- FIN Funciones del carrito ---

  // Mostrar panel de admin
  if (window.location.pathname === "/admin") {
    return <AdminPanel />;
  }

  // Pantalla principal
  return (
    <div className="relative min-h-screen bg-marfil text-grafito">
      <Header query={query} setQuery={setQuery} />
      {welcome && (
        <div className="max-w-6xl mx-auto px-4 pt-3">
          <div className="rounded-xl border border-plateado/40 bg-white p-3 text-center shadow-suave">
            <div className="font-semibold text-dorado">
              Bienvenido a COSSCO — Solo productos de lujo
            </div>
          </div>
        </div>
      )}

      {/* --- DIV DE LOS BOTONES DE CATEGORÍA --- */}
      {/* 👇 ¡CAMBIO AQUÍ! Añadido overflow-x-auto, justify-start y clases para ocultar scrollbar 👇 */}
      <div className="flex overflow-x-auto justify-start md:justify-center gap-2 md:gap-4 p-4 mt-4 scrollbar-hide">
        {["Todos", "Hombre", "Mujer", "Niño", "Niña", "Accesorios"].map((categoryName) => (
          <button
            key={categoryName}
            onClick={() => setSelectedCategory(categoryName)}
            // --- MODIFICACIÓN: Añadido flex-shrink-0 para evitar que se achiquen ---
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
              ${selectedCategory === categoryName
                ? 'bg-yellow-400 text-gray-900 shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {categoryName}
          </button>
        ))}
      </div>
      {/* --- FIN DIV BOTONES --- */}


      <main className="mx-auto max-w-5xl p-4">
        <ProductGrid products={products} onImageClick={openModal} />
      </main>

      <div className="h-64 md:h-0" /> {/* Espaciador, verificar si es necesario */}

      <AboutSection />
      <Footer />
      <CartDrawer cart={cart} onRemove={removeFromCart} onQty={changeQty} />

      <a
        href="/admin"
        className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700 shadow-lg z-10" // Añadido z-index
      >
        👑 Admin
      </a>

      {/* Renderizamos el modal condicionalmente */}
      {isModalOpen && (
        <ImageModal
          product={selectedProductForModal}
          onClose={closeModal}
          onAdd={addToCart}
        />
      )}
    </div>
  );
}