// src/firebase.js
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBQbijFIV0LEavSNMxaa46b43ZkCCr6OK4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "akyildiz-yonetim.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "akyildiz-yonetim",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "akyildiz-yonetim.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1049267525895",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1049267525895:web:bff98aec91ad8fd69ecda2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-921KP8N3WW"
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
