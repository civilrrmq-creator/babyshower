import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
    getAuth,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyBvLcqOgtFuiMbKXE5AstIPVIFyitj1QXY",
    authDomain: "proyecto-nebula333.firebaseapp.com",
    projectId: "proyecto-nebula333",
    storageBucket: "proyecto-nebula333.firebasestorage.app",
    messagingSenderId: "409755485146",
    appId: "1:409755485146:web:bcadefae329bd7e4e876e3"
};


const app = initializeApp(firebaseConfig);


// Firestore
export const db = getFirestore(app);


// Authentication
export const auth = getAuth(app);


// Proveedor de Google
export const googleProvider = new GoogleAuthProvider();


console.log("🔥 Firebase conectado");