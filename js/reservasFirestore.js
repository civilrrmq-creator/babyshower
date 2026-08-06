import { db } from "./firebase.js";
import { eventoId } from "./eventoActivo.js";

import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

export async function guardarReserva({
    nombre,
    regaloId,
    regaloNombre,
    cantidad,
    unidad
}) {
    const reservasRef = collection(db, "reservas");

    const documento = await addDoc(reservasRef, {
        nombreInvitado: nombre,
        regaloId,
        regaloNombre,
        cantidad,
        unidad,
        eventoId,
        estado: "activa",
        fechaReserva: serverTimestamp()
    });

    return documento.id;
}