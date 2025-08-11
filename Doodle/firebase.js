// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCh-YIwVX2tsHbb6RrVglATCNaS0lmj8Qg",
  authDomain: "doodle-df91a.firebaseapp.com",
  projectId: "doodle-df91a",
  storageBucket: "doodle-df91a.firebasestorage.app",
  messagingSenderId: "189303125266",
  appId: "1:189303125266:web:3c19140961d18f8ece6fcb",
  measurementId: "G-XRME18H0QN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Export the initialized app and analytics

export const auth = getAuth(app);
export const db = getFirestore(app);