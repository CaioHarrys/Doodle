import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Importa apenas o getAuth principal por enquanto
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCh-YIwVX2tsHbb6RrVglATCNaS0lmj8Qg",
  authDomain: "doodle-df91a.firebaseapp.com",
  projectId: "doodle-df91a",
  storageBucket: "doodle-df91a.firebasestorage.app",
  messagingSenderId: "189303125266",
  appId: "1:189303125266:web:3c19140961d18f8ece6fcb",
  measurementId: "G-XRME18H0QN"
};

// Inicializa o Firebase App
const app = initializeApp(firebaseConfig);

// Inicializa o Auth da forma mais simples.
// Isso vai gerar um AVISO no console, mas não deve quebrar o app.
const auth = getAuth(app);

// Exporta os serviços que vamos usar
export { auth };
export const db = getFirestore(app);
