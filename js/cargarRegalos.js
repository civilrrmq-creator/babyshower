import { db } from "./firebase.js";

import {
    collection,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

async function cargarRegalos() {
    const respuesta = await fetch("../data/regalos.json");
    const regalos = await respuesta.json();

    for (const regalo of regalos) {
        const regaloId = regalo.id.toString();

        await setDoc(
            doc(collection(db, "regalos"), regaloId),
            {
                ...regalo,
                activo: true
            }
        );

        console.log("Regalo cargado:", regaloId);
    }

    console.log("Todos los regalos fueron cargados.");
}

cargarRegalos();