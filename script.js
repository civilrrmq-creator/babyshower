const missionButton = document.querySelector("#mission-button");
const missionSection = document.querySelector("#mission");

const pageTitle = document.querySelector("#page-title");
const babyName = document.querySelector("#baby-name");
const mainMessage = document.querySelector("#main-message");
const buttonText = document.querySelector("#button-text");

/**
 * Lee la información general del evento
 * desde el archivo data/evento.json.
 */
async function loadEventData() {
    try {
        const response = await fetch("data/evento.json");

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
function createGiftCard(gift) {
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
            ● Disponible
        </span>

        <button
            class="gift-button"
            type="button"
            data-gift-id="${gift.id}"
        >
            Reservar misión
        </button>
    `;

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
        const response = await fetch("data/regalos.json");

        if (!response.ok) {
            throw new Error(
                "No fue posible cargar la lista de regalos."
            );
        }

        const gifts = await response.json();

        giftsContainer.innerHTML = "";

        const fragment = document.createDocumentFragment();

        gifts.forEach((gift) => {
            const card = createGiftCard(gift);
            fragment.appendChild(card);
        });

        giftsContainer.appendChild(fragment);
    } catch (error) {
        console.error(
            "Error al cargar regalos.json:",
            error
        );

        giftsContainer.innerHTML = `
            <p class="loading-message">
                No fue posible cargar la lista de regalos.
            </p>
        `;
    }
}

loadGifts();