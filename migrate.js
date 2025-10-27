// Este es el contenido de 'migrate.js'

import { db } from './src/firebaseConfig.js'; 
import { collection, getDocs, writeBatch, doc, deleteField } from "firebase/firestore";

console.log("Iniciando script de migración...");
console.log("Conectando a Firebase...");

async function migrateProducts() {
  const productsRef = collection(db, "products");
  const batch = writeBatch(db); 
  let productsMigrated = 0;
  let productsSkipped = 0;

  try {
    const snapshot = await getDocs(productsRef);
    console.log(`✅ Conexión exitosa. Se encontraron ${snapshot.docs.length} productos.`);

    snapshot.docs.forEach((document) => {
      const product = document.data();
      const productRef = doc(db, "products", document.id);

      // 1. Si ya tiene 'colorVariants' (como el que hicimos a mano), lo saltamos.
      if (product.colorVariants) {
        console.log(`-> ⚪ Saltando: "${product.title}" (ya está migrado)`);
        productsSkipped++;
        return; 
      }

      // 2. Si no tiene los campos viejos, no podemos migrarlo.
      if (!product.imageUrls || !product.colors) {
        console.log(`-> ⚪ Saltando: "${product.title}" (datos incompletos, faltan 'imageUrls' o 'colors')`);
        productsSkipped++;
        return;
      }

      console.log(`-> 🚀 Migrando: "${product.title}"...`);

      // 3. Crear el nuevo campo 'colorVariants'
      const newColorVariants = [];
      const oldColors = product.colors;
      const oldImages = product.imageUrls;

      oldColors.forEach((colorName, index) => {
        // Asumimos que la imagen en oldImages[index] corresponde al color en oldColors[index]
        const imageUrl = oldImages[index] || oldImages[0]; // Si falta una imagen, usa la primera como respaldo

        if (imageUrl) {
          const newVariant = {
            colorName: colorName,
            swatchImage: imageUrl,       // Usamos la misma imagen para la miniatura
            galleryImages: [imageUrl]    // y para la galería
          };
          newColorVariants.push(newVariant);
        }
      });

      // 4. Si creamos variantes, las añadimos al lote para actualizarlas
      if (newColorVariants.length > 0) {
        batch.update(productRef, {
          colorVariants: newColorVariants, // Añade el campo nuevo
          colors: deleteField(),           // Borra el campo antiguo
          imageUrls: deleteField()         // Borra el campo antiguo
        });
        productsMigrated++;
      } else {
        console.log(`-> ⚪ Saltando: "${product.title}" (no se pudieron crear variantes)`);
        productsSkipped++;
      }
    });

    // 5. Ejecutar todas las actualizaciones de una sola vez
    if (productsMigrated > 0) {
      await batch.commit();
      console.log(`\n🎉 ¡MIGRACIÓN COMPLETADA! 🎉`);
      console.log(`✅ ${productsMigrated} productos actualizados a la nueva estructura.`);
      console.log(`⚪ ${productsSkipped} productos saltados.`);
    } else {
      console.log(`\nNo se migró ningún producto nuevo.`);
      console.log(`⚪ ${productsSkipped} productos saltados.`);
    }

  } catch (error) {
    console.error("\n❌ ¡ERROR DURANTE LA MIGRACIÓN!", error);
  }
}

// Ejecutar la función de migración
migrateProducts();