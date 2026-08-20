// GANTI DENGAN CONFIG MILIK KAMU DARI FIREBASE CONSOLE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2aclnahnWPkqOP76avsbDtjPBfGDszBo",
  authDomain: "sdn134kalumpang.firebaseapp.com",
  projectId: "sdn134kalumpang",
  storageBucket: "sdn134kalumpang.firebasestorage.app",
  messagingSenderId: "938107297073",
  appId: "1:938107297073:web:f96f039f0ecdaf8c732410",
  measurementId: "G-12QBM20YTJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
