// src/firebase.js
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBQbijFIV0LEavSNMxaa46b43ZkCCr6OK4",
  authDomain: "akyildiz-yonetim.firebaseapp.com",
  projectId: "akyildiz-yonetim",
  storageBucket: "akyildiz-yonetim.firebasestorage.app",
  messagingSenderId: "1049267525895",
  appId: "1:1049267525895:web:bff98aec91ad8fd69ecda2",
  measurementId: "G-921KP8N3WW"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
