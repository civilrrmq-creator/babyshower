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
// Validamos la cantidad solicitada.
const cantidadSolicitada =
    Number(cantidad);

if (
    !Number.isInteger(cantidadSolicitada) ||
    cantidadSolicitada <= 0
) {
    throw new Error(
        "CANTIDAD_INVALIDA"
    );
}


// Los regalos ABIERTOS pueden tener una meta máxima.
if (regalo.tipo === "ABIERTO") {

    const cantidadReservada =
        Number(
            regalo.cantidadReservada || 0
        );

    const cantidadMeta =
        Number(
            regalo.cantidadMeta || 0
        );


    // Si no tiene cantidadMeta o es 0,
    // conservamos el comportamiento antiguo:
    // regalo abierto sin límite.
    if (cantidadMeta > 0) {

        if (
            cantidadReservada >= cantidadMeta
        ) {
            throw new Error(
                "META_COMPLETADA"
            );
        }


        if (
            cantidadReservada +
            cantidadSolicitada >
            cantidadMeta
        ) {
            throw new Error(
                "CANTIDAD_SUPERA_META"
            );
        }
    }
}
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