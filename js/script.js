import {
    obtenerRegalos,
    escucharRegalos
} from "./regalosFirestore.js";
const missionButton = document.querySelector("#mission-button");
const missionSection = document.querySelector("#mission");

const pageTitle = document.querySelector("#page-title");
const babyName = document.querySelector("#baby-name");
const mainMessage = document.querySelector("#main-message");
const buttonText = document.querySelector("#button-text");
import { guardarReserva } from "./reservasFirestore.js";
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
            pageTitle.childNodes[0].textContent = "Showerfest de ";
        }

        if (babyName) {
            babyName.textContent = eventData.nombreBebe;
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

/**
 * Lleva al visitante hacia la siguiente sección.
 */
if (missionButton && missionSection) {
    missionButton.addEventListener("click", () => {
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

    const fragment = document.createDocumentFragment();

    regalos.forEach((gift) => {
        const card = createGiftCard(gift);
        fragment.appendChild(card);
    });

    giftsContainer.appendChild(fragment);
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

confirmReservationButton.addEventListener("click", async () => {
    const guestNameInput = document.querySelector("#guest-name");
    const giftQuantityInput = document.querySelector("#gift-quantity");

    const nombre = guestNameInput.value.trim();
    const cantidad = Number(giftQuantityInput.value);

    if (!nombre) {
        alert("Escribe tu nombre.");
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        alert("Escribe una cantidad válida.");
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

        alert("🚀 Misión confirmada. Tu reserva quedó guardada.");

        reservationModal.classList.add("hidden");

    } catch (error) {
        console.error("Error al reservar:", error);

        alert("🔒 Esta misión acaba de ser reservada por otro invitado.");

        reservationModal.classList.add("hidden");

    } finally {
        confirmReservationButton.disabled = false;
        confirmReservationButton.textContent = "Confirmar misión";
    }
});


function createGiftCard(gift) {
    console.log("Creando tarjeta:", gift.nombre);

    const article = document.createElement("article");
    article.classList.add("gift-card");

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
            ? `♾️ Misión abierta · Puedes sumarte`
            : gift.estado === "reservado"
                ? `🔒 Reservado por ${gift.reservadoPor || "otro invitado"}`
                : "● Disponible"
    }
</span>

        <button
            class="gift-button"
            type="button"
            data-gift-id="${gift.id}"
            ${gift.estado === "reservado" ? "disabled" : ""}
        >
            ${
                gift.estado === "reservado"
                    ? "Misión reservada"
                    : "Reservar misión"
            }
        </button>
    `;

    const giftButton = article.querySelector(".gift-button");

    giftButton.addEventListener("click", () => {
        const modalGiftName = document.querySelector("#modal-gift-name");
        const guestNameInput = document.querySelector("#guest-name");
        const giftQuantityInput = document.querySelector("#gift-quantity");

        modalGiftName.textContent = gift.nombre;
        guestNameInput.value = "";
        giftQuantityInput.value = "1";
giftQuantityInput.readOnly = gift.tipo === "UNICO";
if (gift.tipo === "UNICO") {
    giftQuantityInput.title = "Esta misión solo puede reservarse una vez.";
} else {
    giftQuantityInput.title = "Puedes elegir cuántas unidades deseas aportar.";
}
        reservationModal.dataset.giftId = gift.id;
        reservationModal.dataset.giftName = gift.nombre;
        reservationModal.dataset.giftUnit = gift.unidad;

        reservationModal.classList.remove("hidden");
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
        alert("🔒 Esta misión acaba de ser reservada por otro invitado.");
        reservationModal.classList.add("hidden");
    } else {
        alert("⚠️ No fue posible guardar la reserva. Intenta nuevamente.");
    }
}
}

loadGifts();