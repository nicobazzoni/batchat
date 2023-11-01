
import { initializeApp } from "firebase/app";
import { signOut } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

import { getAuth, GoogleAuthProvider, } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyA3EhsYyz2RzRKoAINzvZoxGqjtCn8M9Tw",
  authDomain: "batchat-92e70.firebaseapp.com",
  projectId: "batchat-92e70",
  storageBucket: "batchat-92e70.appspot.com",
  messagingSenderId: "565479051408",
  appId: "1:565479051408:web:0da9abde7e9f77367f8815"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, db, googleProvider, storage, signOut  };