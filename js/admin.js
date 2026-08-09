import {
    db,
    auth,
    googleProvider
} from "./firebase.js";

import {
    collection,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


const guestsList = document.querySelector("#guests-list");

const summaryTotal = document.querySelector("#summary-total");
const summaryYes = document.querySelector("#summary-yes");
const summaryAdults = document.querySelector("#summary-adults");
const summaryChildren = document.querySelector("#summary-children");

const filterButtons = document.querySelectorAll(".filter-button");

let invitados = [];
let filtroActivo = "todos";
let unsubscribeInvitados = null;


/* =========================
   LOGIN DE ADMINISTRADOR
========================= */

const authBox = document.createElement("div");

authBox.innerHTML = `
    <div
        id="admin-auth-box"
        style="
            margin-bottom: 28px;
            padding: 20px;
            border: 1px solid rgba(35, 213, 255, 0.25);
            border-radius: 18px;
            background: rgba(16, 20, 70, 0.72);
        "
    >
        <p
            id="admin-auth-status"
            style="
                margin: 0 0 14px;
                color: rgba(255,255,255,0.75);
            "
        >
            Inicia sesión para ver los invitados.
        </p>

        <button
            id="admin-login-button"
            type="button"
            style="
                padding: 12px 18px;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 700;
            "
        >
            Entrar con Google
        </button>

        <button
            id="admin-logout-button"
            type="button"
            hidden
            style="
                margin-left: 10px;
                padding: 12px 18px;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 700;
            "
        >
            Cerrar sesión
        </button>
    </div>
`;

const adminHeader = document.querySelector(".admin-header");
adminHeader.insertAdjacentElement("afterend", authBox);

const loginButton =
    document.querySelector("#admin-login-button");

const logoutButton =
    document.querySelector("#admin-logout-button");

const authStatus =
    document.querySelector("#admin-auth-status");


loginButton.addEventListener("click", async () => {
    try {
        await signInWithPopup(
            auth,
            googleProvider
        );
    } catch (error) {
        console.error(
            "Error al iniciar sesión:",
            error
        );

        authStatus.textContent =
            "No fue posible iniciar sesión.";
    }
});


logoutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(
            "Error al cerrar sesión:",
            error
        );
    }
});


/* =========================
   UTILIDADES
========================= */

function formatearFecha(timestamp) {
    if (!timestamp || !timestamp.toDate) {
        return "Sin fecha";
    }

    return timestamp.toDate().toLocaleString(
        "es-CO",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );
}


function actualizarResumen(lista) {
    const total = lista.length;

    const asistentes = lista.filter(
        (invitado) =>
            invitado.asiste === true
    );

    const adultos = asistentes.reduce(
        (total, invitado) =>
            total +
            Number(invitado.adultos || 0),
        0
    );

    const ninos = asistentes.reduce(
        (total, invitado) =>
            total +
            Number(invitado.ninos || 0),
        0
    );

    summaryTotal.textContent = total;
    summaryYes.textContent = asistentes.length;
    summaryAdults.textContent = adultos;
    summaryChildren.textContent = ninos;
}


function aplicarFiltro() {
    let listaFiltrada = [...invitados];

    if (filtroActivo === "si") {
        listaFiltrada = invitados.filter(
            (invitado) =>
                invitado.asiste === true
        );
    }

    if (filtroActivo === "no") {
        listaFiltrada = invitados.filter(
            (invitado) =>
                invitado.asiste === false
        );
    }

    if (
        filtroActivo === "familia-2026" ||
        filtroActivo === "amigos-2026"
    ) {
        listaFiltrada = invitados.filter(
            (invitado) =>
                invitado.eventoId ===
                filtroActivo
        );
    }

    renderizarInvitados(listaFiltrada);
}


function renderizarInvitados(lista) {
    guestsList.innerHTML = "";

    if (!lista.length) {
        guestsList.innerHTML = `
            <p class="admin-loading">
                No hay invitados para este filtro.
            </p>
        `;
        return;
    }

    const fragment =
        document.createDocumentFragment();

    lista.forEach((invitado) => {
        const card =
            document.createElement("article");

        card.classList.add("guest-card");

        const asiste =
            invitado.asiste === true;

        card.innerHTML = `
            <div class="guest-top">

                <div>
                    <h2 class="guest-name">
                        ${
                            invitado.nombre ||
                            "Sin nombre"
                        }
                    </h2>
                </div>

                <span
                    class="guest-status ${
                        asiste
                            ? "yes"
                            : "no"
                    }"
                >
                    ${
                        asiste
                            ? "🚀 Asistirá"
                            : "🌙 No asistirá"
                    }
                </span>

            </div>

            <div class="guest-data">

                <div>
                    <span>Evento</span>
                    <strong>
                        ${
                            invitado.eventoId ||
                            "Sin evento"
                        }
                    </strong>
                </div>

                <div>
                    <span>Adultos</span>
                    <strong>
                        ${
                            asiste
                                ? invitado.adultos || 0
                                : 0
                        }
                    </strong>
                </div>

                <div>
                    <span>Niños</span>
                    <strong>
                        ${
                            asiste
                                ? invitado.ninos || 0
                                : 0
                        }
                    </strong>
                </div>

                <div>
                    <span>Registrado</span>
                    <strong>
                        ${
                            formatearFecha(
                                invitado.fechaRegistro
                            )
                        }
                    </strong>
                </div>

            </div>

            ${
                asiste &&
                invitado.restriccionAlimentaria
                    ? `
                        <div class="guest-message">
                            <strong>
                                Restricción alimentaria:
                            </strong>

                            ${
                                invitado
                                    .restriccionAlimentaria
                            }
                        </div>
                    `
                    : ""
            }

            ${
                invitado.mensaje
                    ? `
                        <div class="guest-message">
                            ${invitado.mensaje}
                        </div>
                    `
                    : ""
            }
        `;

        fragment.appendChild(card);
    });

    guestsList.appendChild(fragment);
}


/* =========================
   FILTROS
========================= */

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filtroActivo =
            button.dataset.filter;

        filterButtons.forEach(
            (option) => {
                option.classList.remove(
                    "active"
                );
            }
        );

        button.classList.add("active");

        aplicarFiltro();
    });
});


/* =========================
   FIRESTORE
========================= */

function escucharInvitados() {
    const invitadosRef = query(
        collection(db, "invitados"),
        orderBy(
            "fechaRegistro",
            "desc"
        )
    );

    unsubscribeInvitados =
        onSnapshot(
            invitadosRef,
            (snapshot) => {
                invitados =
                    snapshot.docs.map(
                        (documento) => ({
                            id: documento.id,
                            ...documento.data()
                        })
                    );

                actualizarResumen(
                    invitados
                );

                aplicarFiltro();
            },
            (error) => {
                console.error(
                    "Error al cargar invitados:",
                    error
                );

                guestsList.innerHTML = `
                    <p class="admin-loading">
                        No fue posible cargar los invitados.
                    </p>
                `;
            }
        );
}


/* =========================
   ESTADO DE SESIÓN
========================= */

onAuthStateChanged(
    auth,
    (user) => {

        if (unsubscribeInvitados) {
            unsubscribeInvitados();
            unsubscribeInvitados = null;
        }

        if (user) {
            authStatus.textContent =
                `Sesión iniciada como ${user.email}`;

            loginButton.hidden = true;
            logoutButton.hidden = false;

            guestsList.innerHTML = `
                <p class="admin-loading">
                    Cargando invitados...
                </p>
            `;

            escucharInvitados();

        } else {
            authStatus.textContent =
                "Inicia sesión para ver los invitados.";

            loginButton.hidden = false;
            logoutButton.hidden = true;

            invitados = [];

            summaryTotal.textContent = "0";
            summaryYes.textContent = "0";
            summaryAdults.textContent = "0";
            summaryChildren.textContent = "0";

            guestsList.innerHTML = `
                <p class="admin-loading">
                    Inicia sesión con Google para acceder al panel.
                </p>
            `;
        }
    }
);