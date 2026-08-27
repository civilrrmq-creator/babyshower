import {
    obtenerRegalos,
    escucharRegalos
} from "./regalosFirestore.js";
const missionButton = document.querySelector("#mission-button");
const missionSection = document.querySelector("#mission");
const storyContinue =
    document.querySelector("#story-continue");
import { guardarInvitado } from "./invitadosFirestore.js";
const pageTitle = document.querySelector("#page-title");
const babyName = document.querySelector("#baby-name");
const mainMessage = document.querySelector("#main-message");
import { guardarReserva } from "./reservasFirestore.js";
const buttonText = document.querySelector("#button-text");
const nebulaToast = document.querySelector("#nebula-toast");
const nebulaToastTitle = document.querySelector("#nebula-toast-title");
const nebulaToastMessage = document.querySelector("#nebula-toast-message");
const attendanceForm = document.querySelector("#attendance-form");
const attendanceSuccess = document.querySelector("#attendance-success");
const attendanceDetails = document.querySelector("#attendance-details");
const attendanceOptions = document.querySelectorAll(".attendance-option");
import { db } from "./firebase.js";
import { eventoId } from "./eventoActivo.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
/* =========================
   CUENTA REGRESIVA
========================= */

const countdownDays =
    document.querySelector("#countdown-days");

const countdownHours =
    document.querySelector("#countdown-hours");

const countdownMinutes =
    document.querySelector("#countdown-minutes");

const countdownSeconds =
    document.querySelector("#countdown-seconds");

let countdownInterval = null;


async function iniciarCuentaRegresiva() {
    try {
        const eventoRef =
            doc(
                db,
                "eventos",
                eventoId
            );

        const eventoSnapshot =
            await getDoc(
                eventoRef
            );

        if (!eventoSnapshot.exists()) {
            console.error(
                "No existe el evento:",
                eventoId
            );

            return;
        }

        const evento =
            eventoSnapshot.data();

        if (
            !evento.fecha ||
            !evento.fecha.toDate
        ) {
            console.error(
                "El evento no tiene una fecha válida."
            );

            return;
        }

        const fechaEvento =
            evento.fecha.toDate();
const countdownDate =
    document.querySelector("#countdown-date");

if (countdownDate) {
    countdownDate.textContent =
        `📅 ${fechaEvento.toLocaleDateString(
            "es-CO",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )} · ${fechaEvento.toLocaleTimeString(
            "es-CO",
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            }
        )}`;
}

        function actualizarContador() {
            const ahora =
                new Date();

            const diferencia =
                fechaEvento.getTime() -
                ahora.getTime();


            if (diferencia <= 0) {
                countdownDays.textContent =
                    "00";

                countdownHours.textContent =
                    "00";

                countdownMinutes.textContent =
                    "00";

                countdownSeconds.textContent =
                    "00";

                clearInterval(
                    countdownInterval
                );

                return;
            }


            const dias =
                Math.floor(
                    diferencia /
                    (1000 * 60 * 60 * 24)
                );


            const horas =
                Math.floor(
                    (
                        diferencia /
                        (1000 * 60 * 60)
                    ) % 24
                );


            const minutos =
                Math.floor(
                    (
                        diferencia /
                        (1000 * 60)
                    ) % 60
                );


            const segundos =
                Math.floor(
                    (
                        diferencia /
                        1000
                    ) % 60
                );


            countdownDays.textContent =
                String(dias)
                    .padStart(2, "0");

            countdownHours.textContent =
                String(horas)
                    .padStart(2, "0");

            countdownMinutes.textContent =
                String(minutos)
                    .padStart(2, "0");

            countdownSeconds.textContent =
                String(segundos)
                    .padStart(2, "0");
        }


        actualizarContador();


        countdownInterval =
            setInterval(
                actualizarContador,
                1000
            );


        console.log(
            "Cuenta regresiva:",
            eventoId,
            fechaEvento
        );

    } catch (error) {
        console.error(
            "Error al iniciar cuenta regresiva:",
            error
        );
    }
}
iniciarCuentaRegresiva();
/* Selección Sí / No */
attendanceOptions.forEach((button) => {
    button.addEventListener("click", () => {

        attendanceResponse = button.dataset.attendance;

        attendanceOptions.forEach((option) => {
            option.classList.remove("active");
        });

        button.classList.add("active");

        if (attendanceResponse === "si") {
            attendanceDetails.classList.remove("hidden");
        } else {
            attendanceDetails.classList.add("hidden");
        }
    });
});


/* Guardar confirmación */
attendanceForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document
        .querySelector("#attendance-name")
        .value
        .trim();

    const adultos = Number(
        document.querySelector("#attendance-adults").value
    );

    const ninos = Number(
        document.querySelector("#attendance-children").value
    );

    const restriccionAlimentaria = document
        .querySelector("#attendance-food")
        .value
        .trim();

    const mensaje = document
        .querySelector("#attendance-message")
        .value
        .trim();

    if (!nombre) {
        mostrarToast({
            titulo: "Falta tu nombre",
            mensaje: "Escribe tu nombre para confirmar asistencia.",
            tipo: "error",
            icono: "👤"
        });

        return;
    }

    if (!attendanceResponse) {
        mostrarToast({
            titulo: "Confirma tu asistencia",
            mensaje: "Indica si podrás acompañarnos.",
            tipo: "error",
            icono: "🚀"
        });

        return;
    }

    try {
        const vaAsistir = attendanceResponse === "si";
nombreInvitadoConfirmado = nombre;

mostrarToast({
    titulo: vaAsistir
        ? "¡Nos vemos en la misión! 🚀"
        : "Gracias por avisarnos 💜",

    mensaje: vaAsistir
        ? "Nos alegra muchísimo que puedas acompañarnos. Ahora puedes elegir un regalo para Thiago."
        : "Lamentamos no poder compartir este momento contigo. Si aun así deseas acompañarnos con un regalo para Thiago, lo recibiremos con muchísimo cariño y gratitud.",

    tipo: "success",

    icono: vaAsistir
        ? "🚀"
        : "💜"
});


const giftsSection =
    document.querySelector("#gifts");

setTimeout(() => {
    giftsSection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}, 6500);

        await guardarInvitado({
            nombre,
            asiste: vaAsistir,
            adultos: vaAsistir ? adultos : 0,
            ninos: vaAsistir ? ninos : 0,
            restriccionAlimentaria: vaAsistir
                ? restriccionAlimentaria
                : "",
            mensaje
        });
nombreInvitadoConfirmado = nombre;
mostrarToast({
    titulo: vaAsistir
        ? "¡Nos vemos en la misión! 🚀"
        : "Gracias por avisarnos 💜",

    mensaje: vaAsistir
        ? "Nos alegra muchísimo que puedas acompañarnos. Ahora puedes elegir un regalo para Thiago."
        : "Lamentamos no poder compartir este momento contigo. Si aun así deseas acompañarnos con un regalo para Thiago, lo recibiremos con muchísimo cariño y gratitud.",

    tipo: "success",

    icono: vaAsistir
        ? "🚀"
        : "💜"
});
setTimeout(() => {
    giftsSection?.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}, 6500);
        mostrarToast({
            titulo: "¡Confirmación recibida!",
            mensaje: vaAsistir
                ? "Nos alegra mucho que puedas acompañarnos."
                : "Lamentamos no poder compartir este momento contigo. Si aun así deseas acompañarnos con un regalo para Thiago, lo recibiremos con muchísimo cariño y gratitud.",
            tipo: "success",
            icono: "✨"
        });

        const successTitle =
            attendanceSuccess.querySelector("h3");

        const successMessage =
            attendanceSuccess.querySelector("p");

        const successIcon =
            attendanceSuccess.querySelector(
                ".attendance-success-icon"
            );

        if (vaAsistir) {
            successIcon.textContent = "✨";
            successTitle.textContent = "¡Misión confirmada!";
            successMessage.textContent =
                `Gracias, ${nombre}. Nos alegra mucho que puedas acompañarnos en esta aventura.`;
        } else {
            successIcon.textContent = "🌙";
            successTitle.textContent = "Gracias por avisarnos 💜";
            successMessage.textContent =
                `Gracias por avisarnos, ${nombre}. Te tendremos presente en esta misión tan especial.`;
        }

        attendanceForm.classList.add("hidden");
        attendanceSuccess.classList.remove("hidden");

        attendanceForm.reset();
        attendanceResponse = "";

        attendanceDetails.classList.add("hidden");

        attendanceOptions.forEach((option) => {
            option.classList.remove("active");
        });

    } catch (error) {
        console.error(
            "Error al guardar invitado:",
            error
        );

        mostrarToast({
            titulo: "No pudimos registrar tu respuesta",
            mensaje: "Intenta nuevamente en unos segundos.",
            tipo: "error",
            icono: "⚠️"
        });
    }
});
let attendanceResponse = "";
let nombreInvitadoConfirmado = "";
function mostrarToast({
    titulo,
    mensaje,
    tipo = "success",
    icono = "🚀"
}) {
    if (!nebulaToast) {
        return;
    }

    const iconElement = nebulaToast.querySelector(".nebula-toast-icon");

    nebulaToastTitle.textContent = titulo;
    nebulaToastMessage.textContent = mensaje;

    if (iconElement) {
        iconElement.textContent = icono;
    }

    nebulaToast.classList.toggle("error", tipo === "error");
    nebulaToast.classList.remove("hidden");

    setTimeout(() => {
        nebulaToast.classList.add("hidden");
    }, 6500);
}
/**
 * Lee la información general del evento
 * desde el archivo data/evento.json.
 */
async function loadEventData() {
    try {
        const response = await fetch("../data/evento.json");

        if (!response.ok) {
            throw new Error("No fue posible cargar los datos del evento.");
        }

        const eventData = await response.json();

        document.title = `${eventData.nombrePagina} 🚀`;

       if (pageTitle) {
    pageTitle.childNodes[0].textContent = "Houston tenemos un ";
}

if (babyName) {
    babyName.textContent = "NIÑO!";
}

        if (mainMessage) {
            mainMessage.textContent = eventData.mensajePrincipal;
        }

        if (buttonText) {
            buttonText.textContent = eventData.textoBoton;
        }
    } catch (error) {
        console.error("Error al cargar evento.json:", error);
    }
}

const countdownSection =
    document.querySelector("#countdown");
const rsvpStage =
    document.querySelector(".rsvp-stage");
const countdownContinue =
    document.querySelector("#countdown-continue");
/* =========================================
   NUESTRA HISTORIA → CONTADOR + REGISTRO
========================================= */

if (storyContinue && rsvpStage) {

    storyContinue.addEventListener("click", () => {

        rsvpStage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

}

if (missionButton && missionSection) {
    missionButton.addEventListener("click", () => {
        missionSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}


if (countdownContinue && missionSection) {
    countdownContinue.addEventListener("click", () => {
        missionSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

loadEventData();

console.log("🚀 Proyecto Nebula iniciado correctamente");
const giftsContainer = document.querySelector("#gifts-container");

escucharRegalos((regalos) => {

    if (!giftsContainer) {
        return;
    }

    giftsContainer.innerHTML = "";

    /* =========================================
       AGRUPAR REGALOS POR CATEGORÍA
    ========================================= */

    const regalosPorCategoria = {};

    regalos.forEach((gift) => {

        const categoria =
            gift.categoria?.trim() || "Otros";

        if (!regalosPorCategoria[categoria]) {
            regalosPorCategoria[categoria] = [];
        }

        regalosPorCategoria[categoria].push(gift);
    });


    /* =========================================
       ORDEN DE LAS CATEGORÍAS
    ========================================= */

    const ordenCategorias = [
        "Cuidado",
        "Higiene",
        "Ropa",
        "Alimentación",
        "Descanso",
        "Transporte",
        "Juguetes",
        "Otros"
    ];


    const categoriasOrdenadas =
        Object.entries(regalosPorCategoria)
            .sort(([categoriaA], [categoriaB]) => {

                const posicionA =
                    ordenCategorias.indexOf(categoriaA);

                const posicionB =
                    ordenCategorias.indexOf(categoriaB);

                const valorA =
                    posicionA === -1
                        ? 999
                        : posicionA;

                const valorB =
                    posicionB === -1
                        ? 999
                        : posicionB;

                return valorA - valorB;
            });


    /* =========================================
       CREAR CADA GRUPO
    ========================================= */

    categoriasOrdenadas.forEach(
        ([categoria, regalosCategoria], index) => {

            const group =
                document.createElement("section");

            group.className =
                "gift-group";


            /* =====================================
               BOTÓN / CABECERA
            ===================================== */

            const header =
                document.createElement("button");

            header.type = "button";

            header.className =
                "gift-group-header";

            header.innerHTML = `

                <div class="gift-group-heading">

                    <span class="gift-group-icon">
                        ${getGiftIcon(categoria)}
                    </span>

                    <div class="gift-group-text">

                        <strong>
                            ${categoria}
                        </strong>

                        <span>
                            ${regalosCategoria.length}
                            ${
                                regalosCategoria.length === 1
                                    ? " regalo"
                                    : " regalos"
                            }
                        </span>

                    </div>

                </div>


                <span class="gift-group-arrow">
                    ▼
                </span>

            `;


            /* =====================================
               CONTENEDOR INTERIOR
            ===================================== */

            const content =
                document.createElement("div");

            content.className =
                "gift-group-content";


            regalosCategoria.forEach((gift) => {

                const card =
                    createGiftCard(gift);

                content.appendChild(card);

            });


            /* =====================================
               PRIMER GRUPO ABIERTO
            ===================================== */

            if (index === 0) {

                group.classList.add("is-open");

            }


            /* =====================================
               ABRIR / CERRAR
            ===================================== */

            header.addEventListener(
                "click",
                () => {

                    group.classList.toggle(
                        "is-open"
                    );

                }
            );


            group.appendChild(header);
            group.appendChild(content);

            giftsContainer.appendChild(group);
        }
    );
});
/**
 * Retorna un emoji según la categoría del regalo.
 */
function getGiftIcon(category) {
    const icons = {
        Cuidado: "🧴",
        Ropa: "👕",
        Descanso: "🌙",
        Alimentación: "🍼"
    };

    return icons[category] || "🎁";
}

/**
 * Construye una tarjeta HTML para un regalo.
 */
const reservationModal = document.querySelector("#reservation-modal");
const cancelReservationButton = document.querySelector("#cancel-reservation");
const confirmReservationButton = document.querySelector("#confirm-reservation");
cancelReservationButton.addEventListener("click", () => {
    reservationModal.classList.add("hidden");
});
reservationModal.addEventListener("click", (event) => {
    if (event.target === reservationModal) {
        reservationModal.classList.add("hidden");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        reservationModal.classList.add("hidden");
    }
});
confirmReservationButton.addEventListener("click", async () => {
    const guestNameInput = document.querySelector("#guest-name");
    const giftQuantityInput = document.querySelector("#gift-quantity");

   const nombre = guestNameInput.value.trim();
const cantidad = Number(giftQuantityInput.value);

if (!nombre) {
    mostrarToast({
        titulo: "Falta tu nombre",
        mensaje: "Escribe tu nombre antes de confirmar la misión.",
        tipo: "error",
        icono: "👤"
    });

    return;
}

if (!Number.isInteger(cantidad) || cantidad <= 0) {
    mostrarToast({
        titulo: "Cantidad inválida",
        mensaje: "Escribe una cantidad mayor que cero.",
        tipo: "error",
        icono: "⚠️"
    });

    return;
}
    try {
        confirmReservationButton.disabled = true;
        confirmReservationButton.textContent = "Guardando...";

        await guardarReserva({
            nombre,
            regaloId: reservationModal.dataset.giftId,
            regaloNombre: reservationModal.dataset.giftName,
            cantidad,
            unidad: reservationModal.dataset.giftUnit
        });

        mostrarToast({
    titulo: "¡Misión confirmada!",
    mensaje: "Tu reserva quedó guardada correctamente.",
    tipo: "success",
    icono: "🚀"
});

        reservationModal.classList.add("hidden");

    } catch (error) {

    console.error(
        "Error al reservar:",
        error
    );


    if (
        error.message ===
        "META_COMPLETADA"
    ) {

        mostrarToast({
            titulo: "¡Meta completada!",
            mensaje:
                "Este regalo ya alcanzó la cantidad necesaria. 💙",
            tipo: "success",
            icono: "🎯"
        });

        reservationModal
            .classList
            .add("hidden");

    } else if (
        error.message ===
        "CANTIDAD_SUPERA_META"
    ) {

        mostrarToast({
            titulo: "Cantidad demasiado alta",
            mensaje:
                "La cantidad que elegiste supera lo que falta para completar este regalo.",
            tipo: "error",
            icono: "⚠️"
        });

        // Dejamos el modal abierto
        // para que la persona pueda
        // corregir la cantidad.

    } else if (
        error.message ===
        "REGALO_YA_RESERVADO"
    ) {

        mostrarToast({
            titulo: "Misión bloqueada",
            mensaje:
                "Esta misión acaba de ser reservada por otro invitado.",
            tipo: "error",
            icono: "🔒"
        });

        reservationModal
            .classList
            .add("hidden");

    } else {

        mostrarToast({
            titulo: "No pudimos guardar la reserva",
            mensaje:
                "Inténtalo nuevamente en unos segundos.",
            tipo: "error",
            icono: "⚠️"
        });
    }
    } finally {
        confirmReservationButton.disabled = false;
        confirmReservationButton.textContent = "Confirmar misión";
    }
});


function createGiftCard(gift) {
    console.log("Creando tarjeta:", gift.nombre);

    const article = document.createElement("article");
    article.classList.add("gift-card");
const cantidadReservada =
    Number(gift.cantidadReservada || 0);

const cantidadMeta =
    Number(gift.cantidadMeta || 0);

const metaAlcanzada =
    gift.tipo === "ABIERTO" &&
    cantidadMeta > 0 &&
    cantidadReservada >= cantidadMeta;

const bloqueado =
    gift.estado === "reservado" ||
    metaAlcanzada;
    article.innerHTML = `
        <div class="gift-image-placeholder">
            ${getGiftIcon(gift.categoria)}
        </div>

        <span class="gift-category">
            ${gift.categoria}
        </span>

        <h3>${gift.nombre}</h3>

        <p>${gift.descripcion}</p>

       <span class="gift-status">
    ${
        gift.tipo === "ABIERTO"
            ? (
                cantidadMeta > 0
                    ? (
                        metaAlcanzada
                            ? `🎯 Meta completada · ${cantidadReservada} de ${cantidadMeta} ${gift.unidad || "unidades"}`
                            : `🚀 ${cantidadReservada} de ${cantidadMeta} ${gift.unidad || "unidades"} reservados`
                    )
                    : `♾️ Misión abierta · Puedes sumarte`
            )
            : gift.estado === "reservado"
                ? `🔒 Reservado por ${gift.reservadoPor || "otro invitado"}`
                : "● Disponible"
    }
</span>

        <button
            class="gift-button"
            type="button"
            data-gift-id="${gift.id}"
${bloqueado ? "disabled" : ""}
        >
            ${
    metaAlcanzada
        ? "🎯 Meta completada"
        : gift.estado === "reservado"
            ? "Misión reservada"
            : "Reservar misión"
}
        </button>
    `;

    const giftButton = article.querySelector(".gift-button");

    giftButton.addEventListener("click", () => {

    if (!nombreInvitadoConfirmado) {
        mostrarToast({
            titulo: "Antes de continuar 💜",
            mensaje: "Cuéntanos primero si podremos contar contigo. Después podrás elegir un regalo para Thiago.",
            tipo: "error",
            icono: "🚀"
        });

        document
            .querySelector("#attendance")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        return;
    }

    const modalGiftName =
        document.querySelector("#modal-gift-name");

    const guestNameInput =
        document.querySelector("#guest-name");

    const giftQuantityInput =
        document.querySelector("#gift-quantity");

    modalGiftName.textContent = gift.nombre;

guestNameInput.value =
    nombreInvitadoConfirmado || "";

guestNameInput.readOnly = true;

giftQuantityInput.value = "1";

giftQuantityInput.readOnly =
    gift.tipo === "UNICO";

if (gift.tipo === "UNICO") {
    giftQuantityInput.title =
        "Esta misión solo puede reservarse una vez.";
} else {
    giftQuantityInput.title = "Puedes elegir cuántas unidades deseas aportar.";
}
        reservationModal.dataset.giftId = gift.id;
        reservationModal.dataset.giftName = gift.nombre;
        reservationModal.dataset.giftUnit = gift.unidad;

        reservationModal.classList.remove("hidden");
        guestNameInput.focus();
    });

    return article;
}
/**
 * Lee regalos.json y muestra sus elementos en la página.
 */
async function loadGifts() {
    if (!giftsContainer) {
        return;
    }

    try {
        const gifts = await obtenerRegalos();

if (!gifts.length) {
    throw new Error(
        "No se encontraron regalos en Firestore."
    );
}

        giftsContainer.innerHTML = "";

        const fragment = document.createDocumentFragment();

        gifts.forEach((gift) => {
            const card = createGiftCard(gift);
            fragment.appendChild(card);
        });

        giftsContainer.appendChild(fragment);
} catch (error) {
    console.error("Error al reservar:", error);

if (error.message === "REGALO_YA_RESERVADO") {
    mostrarToast({
        titulo: "Misión reservada",
        mensaje: "Esta misión acaba de ser reservada por otro invitado.",
        tipo: "error",
        icono: "🔒"
    });

    reservationModal.classList.add("hidden");
    } else {
        mostrarToast({
    titulo: "Error de conexión",
    mensaje: "No fue posible guardar la reserva. Intenta nuevamente.",
    tipo: "error",
    icono: "⚠️"
});
    }
}
}

//loadGifts();
window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
});
const introScreen =
    document.querySelector("#intro-screen");

const introSkip =
    document.querySelector("#intro-skip");


function cerrarIntro() {
    if (!introScreen) {
        return;
    }
window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
});
    introScreen.classList.add(
        "intro-fade-out"
    );

    setTimeout(() => {
        introScreen.remove();
    }, 900);
}


if (introSkip) {
    introSkip.addEventListener(
        "click",
        cerrarIntro
    );
}


/* Cierre automático */
setTimeout(() => {
    cerrarIntro();
}, 4800);