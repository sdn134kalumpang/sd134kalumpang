// js/config/firebase-config.js - FIREBASE CONFIG REAL - SDN 134 KALUMPANG
// Project: sdn134kalumpang - Sudah ada di Firebase Console
// Path: /sd134kalumpang/js/config/firebase-config.js
// Versi: Modular v10.12.2 (sesuai yang sudah kamu upload)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, addDoc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, where, writeBatch, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

// Enable offline persistence (agar bisa offline di GitHub Pages)
enableIndexedDbPersistence(db).catch(err => {
  console.warn("Firestore persistence error:", err.code);
});

// Export juga ke window untuk kompatibilitas dengan service-menu.js lama
window.firebaseApp = app;
window.db = db;
window.auth = auth;
window.firebaseConfig = firebaseConfig;

// Helper global untuk Firestore
window.FirestoreHelpers = { collection, doc, addDoc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, where, writeBatch };

console.log("✅ Firebase Firestore terkoneksi:", firebaseConfig.projectId, "- NPSN 40312947");

// Signal ready untuk index.html status
window.dispatchEvent(new CustomEvent('firebase-ready', { detail: { db, projectId: firebaseConfig.projectId } }));

// Juga export compat global untuk file lama yang pakai window.db
export const firebaseApp = app;
