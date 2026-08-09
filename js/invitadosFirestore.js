import { db } from "./firebase.js";
import { eventoId } from "./eventoActivo.js";

import {
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

export async function guardarInvitado({
    nombre,
    asiste,
    adultos,
    ninos,
    restriccionAlimentaria,
    mensaje
}) {
    const invitadosRef = collection(db, "invitados");

    const documento = await addDoc(invitadosRef, {
        nombre,
        asiste,
        adultos,
        ninos,
        restriccionAlimentaria,
        mensaje,
        eventoId,
        fechaRegistro: serverTimestamp()
    });

    return documento.id;
}