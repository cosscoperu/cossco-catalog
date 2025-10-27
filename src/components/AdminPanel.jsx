import React, { useState, useEffect } from "react";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

// --- Estado Inicial para una Variante de Color ---
const initialVariantState = {
  colorName: "",
  swatchImage: null, // Aquí irá el ARCHIVO de la miniatura
  galleryImages: null, // Aquí irá la LISTA DE ARCHIVOS de la galería
};

export default function AdminPanel() {
  // --- Estados del Producto ---
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState(""); // Sigue siendo un string "S, M, L"

  // --- NUEVO ESTADO PARA VARIANTES DE COLOR ---
  const [colorVariants, setColorVariants] = useState([{ ...initialVariantState }]);

  // --- Estados de la UI ---
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  
  const productsRef = collection(db, "products");
  const placeholderImage = "https://placehold.co/150x150?text=No+Image";

  // Cargar productos para la lista
  useEffect(() => {
    // Como la base de datos está vacía, esto simplemente escuchará
    const unsub = onSnapshot(productsRef, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Limpiar formulario
  const clearForm = () => {
    setTitle("");
    setPrice("");
    setStock("");
    setCategory("");
    setSizes("");
    setColorVariants([{ ...initialVariantState }]); // Resetea las variantes
    setEditId(null);
    // Limpiar todos los inputs de archivo (esto es complejo, un reseteo simple)
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = null);
  };

  // --- Funciones para manejar el estado de las variantes ---
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...colorVariants];
    newVariants[index][field] = value;
    setColorVariants(newVariants);
  };

  const handleAddVariant = () => {
    setColorVariants([...colorVariants, { ...initialVariantState }]);
  };

  const handleRemoveVariant = (index) => {
    const newVariants = colorVariants.filter((_, i) => i !== index);
    setColorVariants(newVariants);
  };
  // --- Fin funciones de variantes ---

  // --- Función auxiliar para subir un archivo ---
  const uploadFile = async (file) => {
    if (!file) return null;
    console.log("Subiendo archivo:", file.name);
    const imageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    try {
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      console.log("Archivo subido:", url);
      return url;
    } catch (error) {
      console.error("Error al subir archivo:", error);
      return null;
    }
  };

  // --- FUNCIÓN 'ADD PRODUCT' REESCRITA ---
  const addProduct = async () => {
    if (!title || !price || !stock || !category || colorVariants.length === 0) {
      alert("Por favor completa todos los campos (Título, Precio, Stock, Categoría y al menos 1 Variante de Color)");
      return;
    }

    setIsUploading(true);
    
    // 1. Procesar todas las imágenes de todas las variantes
    let finalColorVariants = [];
    for (const variant of colorVariants) {
      if (!variant.colorName || !variant.swatchImage || !variant.galleryImages) {
        alert(`Por favor completa todos los campos para la variante de color (Nombre, Miniatura y Galería).`);
        setIsUploading(false);
        return;
      }

      // 1a. Subir la imagen miniatura (swatchImage)
      const swatchImageUrl = await uploadFile(variant.swatchImage);

      // 1b. Subir las imágenes de la galería (galleryImages)
      let galleryImageUrls = [];
      for (const file of variant.galleryImages) {
        const url = await uploadFile(file);
        if (url) galleryImageUrls.push(url);
      }

      if (!swatchImageUrl || galleryImageUrls.length === 0) {
        alert("Error al subir imágenes. Revisa la consola.");
        setIsUploading(false);
        return;
      }
      
      finalColorVariants.push({
        colorName: variant.colorName,
        swatchImage: swatchImageUrl,
        galleryImages: galleryImageUrls,
      });
    }

    // 2. Procesar Tallas
    const processedSizes = sizes.split(',').map(s => s.trim()).filter(s => s !== '');

    // 3. Crear el objeto final del producto
    const productData = {
      title,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      sizes: processedSizes,
      colorVariants: finalColorVariants, // <--- ¡LA NUEVA ESTRUCTURA!
    };

    console.log("Datos a guardar en Firestore:", productData);

    // 4. Guardar en Firestore
    try {
      await addDoc(productsRef, productData);
      console.log("¡Producto agregado a Firebase con éxito!");
      clearForm();
    } catch (error) {
      console.error("Error al guardar en Firebase:", error);
      alert("Hubo un error al guardar en Firebase. Revisa la consola (F12) para detalles.");
    }
    
    setIsUploading(false);
  };

  // --- Funciones de Editar y Borrar ---
  const removeProduct = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      console.log("Producto eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const startEdit = (p) => {
    // Nota: La edición de variantes es compleja. Por ahora, solo editamos los datos principales.
    setEditId(p.id);
    setTitle(p.title);
    setPrice(p.price);
    setStock(p.stock);
    setCategory(p.category || "");
    setSizes(p.sizes ? p.sizes.join(', ') : "");
    // No cargamos las variantes para editar, el formulario se ocultará.
  };

  const saveEdit = async () => {
    if (!title || !price || !stock || !category) {
      alert("Por favor completa los campos obligatorios");
      return;
    }

    setIsUploading(true);
    const processedSizes = sizes.split(',').map(s => s.trim()).filter(s => s !== '');

    // SOLO ACTUALIZAMOS LOS DATOS SIMPLES
    const productData = {
      title,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      sizes: processedSizes,
      // No tocamos 'colorVariants' al editar
    };

    console.log("Datos a actualizar en Firestore:", productData);

    try {
      await updateDoc(doc(db, "products", editId), productData);
      console.log("¡Producto actualizado en Firebase con éxito!");
      clearForm();
    } catch (error) {
      console.error("Error al actualizar en Firebase:", error);
    }
    setIsUploading(false);
  };
  // --- Fin Funciones ---

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          👑 Panel de Administración COSSCO
        </h1>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-xl font-bold mb-4">{editId ? 'Editar Producto' : 'Agregar Producto'}</h2>

          {/* --- Formulario Principal (Título, Precio, Stock) --- */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Título:</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Título del producto"/>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Precio (ej: 40)"/>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Stock (ej: 100)"/>
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Categoría:</label>
            <select id="category" name="category" value={category} onChange={e => setCategory(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
              <option value="">Selecciona una categoría</option>
              {["Hombre", "Mujer", "Niño", "Niña", "Accesorios"].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="sizes" className="block text-gray-700 text-sm font-bold mb-2">Tallas (separadas por comas, ej: S, M, L):</label>
            <input type="text" id="sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="S, M, L, XL"/>
          </div>
          
          {/* --- FIN Formulario Principal --- */}


          {/* --- INICIO: NUEVO FORMULARIO DE VARIANTES DE COLOR --- */}
          {/* Este formulario solo aparece al "Agregar Producto" (!editId) */}
          {!editId && (
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-lg font-bold mb-3 text-gray-700">Variantes de Color</h3>
              
              {colorVariants.map((variant, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4 relative">
                  
                  <h4 className="font-semibold mb-2">Color #{index + 1}</h4>
                  
                  {/* Botón para eliminar variante */}
                  {index > 0 && (
                    <button 
                      onClick={() => handleRemoveVariant(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold"
                    >
                      &times;
                    </button>
                  )}
                  
                  {/* Campo para Nombre del Color */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nombre del Color (ej: Negro, Azul Marino):</label>
                    <input 
                      type="text" 
                      value={variant.colorName}
                      onChange={(e) => handleVariantChange(index, 'colorName', e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" 
                      placeholder="Negro"
                    />
                  </div>
                  
                  {/* Campo para Imagen Miniatura (Swatch) */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Imagen Miniatura (para el selector de color):</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleVariantChange(index, 'swatchImage', e.target.files[0])}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  
                  {/* Campo para Imágenes de Galería */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Imágenes de Galería (puedes seleccionar varias):</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleVariantChange(index, 'galleryImages', e.target.files)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                  </div>
                </div>
              ))}
              
              {/* Botón para Añadir otra Variante */}
              <button 
                onClick={handleAddVariant} 
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                + Añadir otra variante de color
              </button>
            </div>
          )}
          {/* --- FIN: NUEVO FORMULARIO DE VARIANTES DE COLOR --- */}


          {/* --- Botones de Acción --- */}
          <div className="flex items-center justify-between mt-6 mb-4">
            {editId ? (
              <button onClick={saveEdit} disabled={isUploading} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                {isUploading ? "Guardando..." : "Guardar edición"}
              </button>
            ) : (
              <button onClick={addProduct} disabled={isUploading} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                {isUploading ? "Agregando..." : "Agregar producto"}
              </button>
            )}
            {editId && (
              <button onClick={clearForm} className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">
                Cancelar edición
              </button>
            )}
          </div>
        </div>

        {/* --- Lista de productos (actualizada) --- */}
        <h2 className="text-lg font-semibold mb-2 text-gray-700">Lista de productos:</h2>
        <ul className="space-y-3">
          {products.map((p) => (
            <li key={p.id} className="border rounded-lg p-3 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                <img 
                  // Muestra la miniatura del PRIMER color
                  src={p.colorVariants && p.colorVariants.length > 0 ? p.colorVariants[0].swatchImage : placeholderImage} 
                  alt={p.title || 'Producto sin título'} 
                  className="w-16 h-16 object-cover rounded-md" 
                />
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-gray-600">
                    S/ {p.price} — Stock: {p.stock} — Categoría: {p.category || 'N/A'}
                  </p>
                  {p.sizes && p.sizes.length > 0 && (
                    <p className="text-xs text-gray-500">Tallas: {p.sizes.join(', ')}</p>
                  )}
                  {/* Muestra los nombres de los colores */}
                  {p.colorVariants && p.colorVariants.length > 0 && (
                    <p className="text-xs text-gray-500">Colores: {p.colorVariants.map(v => v.colorName).join(', ')}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">✏️</button>
                <button onClick={() => removeProduct(p.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">🗑️</button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:underline text-sm font-medium">🔙 Volver al catálogo</a>
        </div>
      </div>
    </div>
  );
}