const missionButton = document.querySelector("#mission-button");
const missionSection = document.querySelector("#mission");
const starsContainer = document.querySelector("#stars");

/**
 * Crea las estrellas del fondo espacial.
 *
 * Cada estrella recibe una posición, tamaño,
 * transparencia y velocidad de parpadeo diferentes.
 */
function createStars(amount = 140) {
    if (!starsContainer) {
        return;
    }

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < amount; index += 1) {
        const star = document.createElement("span");

        const size = Math.random() * 2.5 + 1;
        const opacity = Math.random() * 0.65 + 0.35;
        const duration = Math.random() * 3 + 2;

        star.classList.add("star");

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        star.style.setProperty("--star-size", `${size}px`);
        star.style.setProperty("--star-opacity", opacity);
        star.style.setProperty(
            "--twinkle-duration",
            `${duration}s`
        );

        star.style.animationDelay = `${Math.random() * 4}s`;

        fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
}

/**
 * Desplaza suavemente la página
 * hacia la siguiente sección.
 */
if (missionButton && missionSection) {
    missionButton.addEventListener("click", () => {
        missionSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

createStars();

console.log("🌌 Galaxia de Proyecto Nebula activada");