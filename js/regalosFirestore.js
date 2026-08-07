import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    onSnapshot
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

export function escucharRegalos(callback) {
    const regalosRef = collection(db, "regalos");

    return onSnapshot(regalosRef, (snapshot) => {
        const regalos = snapshot.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
        }));

        callback(regalos);
    });
}
/**
 * Marca un regalo como reservado.
 */
export async function marcarRegaloReservado(regaloId, nombreInvitado) {
    const regaloRef = doc(db, "regalos", regaloId);

    await updateDoc(regaloRef, {
        estado: "reservado",
        reservadoPor: nombreInvitado
    });
}