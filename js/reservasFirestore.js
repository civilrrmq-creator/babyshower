import { db } from "./firebase.js";
import { eventoId } from "./eventoActivo.js";

import {
    collection,
    doc,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

export async function guardarReserva({
    nombre,
    regaloId,
    regaloNombre,
    cantidad,
    unidad
}) {
    const regaloRef = doc(db, "regalos", regaloId);
    const reservaRef = doc(collection(db, "reservas"));

    await runTransaction(db, async (transaction) => {
        const regaloSnapshot = await transaction.get(regaloRef);

        if (!regaloSnapshot.exists()) {
            throw new Error("REGALO_NO_EXISTE");
        }

        const regalo = regaloSnapshot.data();

        // Los regalos UNICOS solo pueden reservarse una vez.
        if (
            regalo.tipo === "UNICO" &&
            regalo.estado === "reservado"
        ) {
            throw new Error("REGALO_YA_RESERVADO");
        }

        // Creamos la reserva.
        transaction.set(reservaRef, {
            nombreInvitado: nombre,
            regaloId,
            regaloNombre,
            cantidad,
            unidad,
            eventoId,
            estado: "activa",
            fechaReserva: serverTimestamp()
        });

        // Solo bloqueamos los regalos UNICOS.
        // Solo bloqueamos los regalos UNICOS.
    if (regalo.tipo === "UNICO") {
        transaction.update(regaloRef, {
            estado: "reservado",
            reservadoPor: nombre
        });
    }

    if (regalo.tipo === "ABIERTO") {
        const cantidadActual = regalo.cantidadReservada || 0;

        transaction.update(regaloRef, {
            cantidadReservada: cantidadActual + cantidad
        });
    }

}); 

return reservaRef.id;
}