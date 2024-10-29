// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, signOut } from "firebase/auth"; // Import the necessary auth functions
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdnoRV0AqZgJOktVJMQJ74_gpfElCb7ww",
  authDomain: "quikchat-84d7c.firebaseapp.com",
  projectId: "quikchat-84d7c",
  storageBucket: "quikchat-84d7c.appspot.com",
  messagingSenderId: "564897976447",
  appId: "1:564897976447:web:b4a5474550ed681234ef4a",
  measurementId: "G-N34DK64QWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Auth
const firestore = getFirestore(app); // Initialize Firestore

export { auth, firestore, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously, signOut }; // Export the necessary functions
