import { db } from "./firebase.js";
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/**
 * Obtiene todos los regalos guardados en Firestore.
 */
export async function obtenerRegalos() {
    const regalosRef = collection(db, "regalos");
    const snapshot = await getDocs(regalosRef);

    return snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
    }));
}