// Importa las funciones que necesitas
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// Tu configuración de Firebase (¡Claves reales de tu proyecto!)
const firebaseConfig = {
  apiKey: "AIzaSyAS6187NhyvqbBpxeRWdsIkkCWcHeVVC2Y",
  authDomain: "cossco-a6474.firebaseapp.com",
  projectId: "cossco-a6474",
  storageBucket: "cossco-a6474.firebasestorage.app", // <--- ¡AQUÍ ESTÁ LA CORRECCIÓN!
  messagingSenderId: "184352192650",
  appId: "1:84352192650:web:c1bf981dfddc4dd1fe6664"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta los servicios que usarás
export const db = getFirestore(app);
export const storage = getStorage(app);