import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBvLcQ0gtFuiMbKXE5AstIPVIFyitj1QXY",
    authDomain: "proyecto-nebula333.firebaseapp.com",
    projectId: "proyecto-nebula333",
    storageBucket: "proyecto-nebula333.firebasestorage.app",
    messagingSenderId: "409755485146",
    appId: "1:409755485146:web:bcadefae329bd7e4e876e3"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

console.log("🔥 Firebase conectado");