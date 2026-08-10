import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";


/*
 * Obtiene los regalos visibles
 * para la página pública.
 */
export async function obtenerRegalos() {
    const regalosRef =
        collection(
            db,
            "regalos"
        );

    const snapshot =
        await getDocs(
            regalosRef
        );

    return snapshot.docs
        .map(
        (documento) => ({
    ...documento.data(),
    id: documento.id
})
        )
        .filter(
            (regalo) =>
                regalo.activo !== false
        );
}


/*
 * Escucha cambios de regalos
 * en tiempo real.
 */
export function escucharRegalos(
    callback
) {
    const regalosRef =
        collection(
            db,
            "regalos"
        );

    return onSnapshot(
        regalosRef,
        (snapshot) => {

            const regalos =
                snapshot.docs
                    .map(
          (documento) => ({
    ...documento.data(),
    id: documento.id
})
                    )
                    .filter(
                        (regalo) =>
                            regalo.activo !==
                            false
                    );

            callback(
                regalos
            );
        }
    );
}


/*
 * Compatibilidad con la lógica
 * anterior del proyecto.
 */
export async function marcarRegaloReservado(
    regaloId,
    nombreInvitado
) {
    const regaloRef =
        doc(
            db,
            "regalos",
            regaloId
        );

    await updateDoc(
        regaloRef,
        {
            estado:
                "reservado",

            reservadoPor:
                nombreInvitado
        }
    );
}