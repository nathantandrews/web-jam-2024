// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCn2d0GSyCNStNXtwAXMWY35mYBO1vP4Fg",
  authDomain: "food-inventory-app-c2e2b.firebaseapp.com",
  projectId: "food-inventory-app-c2e2b",
  storageBucket: "food-inventory-app-c2e2b.firebasestorage.app",
  messagingSenderId: "662786278923",
  appId: "1:662786278923:web:6daf30160cf37bf155290e",
  measurementId: "G-HR399GKGYF"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app);
const db = getFirestore(app);
export { app, auth, db }