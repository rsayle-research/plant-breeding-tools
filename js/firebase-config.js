// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJ7qb1-Nfq5Qtz6LGhWIumAVIW32jZdj4",
  authDomain: "genexis-cloud-user-storage.firebaseapp.com",
  projectId: "genexis-cloud-user-storage",
  storageBucket: "genexis-cloud-user-storage.firebasestorage.app",
  messagingSenderId: "478021509775",
  appId: "1:478021509775:web:71d8e4d86f031bae7c06fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firebase initialized for Genexis Cloud');

// Dispatch event to let dashboard know Firebase is ready
window.dispatchEvent(new CustomEvent('firebaseReady', {
  detail: {
    db: db,
    modules: {
      doc,
      getDoc,
      setDoc,
      serverTimestamp,
      collection
    }
  }
}));
