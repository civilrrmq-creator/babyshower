import {
    db,
    auth,
    googleProvider
} from "./firebase.js";

import {
    collection,
    onSnapshot,
    query,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


const ADMIN_EMAIL = "civil.rrmq@gmail.com";


/* =========================================================
   ELEMENTOS - INVITADOS
========================================================= */

const guestsList =
    document.querySelector("#guests-list");

const summaryTotal =
    document.querySelector("#summary-total");

const summaryYes =
    document.querySelector("#summary-yes");

const summaryAdults =
    document.querySelector("#summary-adults");

const summaryChildren =
    document.querySelector("#summary-children");

const filterButtons =
    document.querySelectorAll(".filter-button");

const guestSearch =
    document.querySelector("#guest-search");


/* =========================================================
   ELEMENTOS - REGALOS
========================================================= */

const giftAdminForm =
    document.querySelector("#gift-admin-form");

const giftAdminSubmit =
    document.querySelector("#admin-gift-submit");

const adminGiftsList =
    document.querySelector("#admin-gifts-list");

const giftNameInput =
    document.querySelector("#admin-gift-name");

const giftCategoryInput =
    document.querySelector("#admin-gift-category");

const giftUnitInput =
    document.querySelector("#admin-gift-unit");

const giftTypeInput =
    document.querySelector("#admin-gift-type");

const giftDescriptionInput =
    document.querySelector("#admin-gift-description");

const giftImageInput =
    document.querySelector("#admin-gift-image");


/* =========================================================
   ESTADO GENERAL
========================================================= */

let invitados = [];
let regalos = [];

let filtroActivo = "todos";
let textoBusqueda = "";

let unsubscribeInvitados = null;
let unsubscribeRegalos = null;

let regaloEditandoId = null;
/* =========================================================
   EDICIÓN DE INVITADOS
========================================================= */

let invitadoEditandoId = null;


/* Crear modal dinámicamente */

const guestEditModal =
    document.createElement("div");

guestEditModal.className =
    "admin-guest-modal hidden";

guestEditModal.innerHTML = `
    <div class="admin-guest-modal-card">

        <h2>
            ✏️ Editar invitado
        </h2>

        <div class="form-group">

            <label for="edit-guest-name">
                Nombre
            </label>

            <input
                type="text"
                id="edit-guest-name"
            >

        </div>


        <div class="form-group">

            <label for="edit-guest-attendance">
                Asistencia
            </label>

            <select id="edit-guest-attendance">

                <option value="si">
                    🚀 Asistirá
                </option>

                <option value="no">
                    🌙 No asistirá
                </option>

            </select>

        </div>


        <div class="guest-edit-grid">

            <div class="form-group">

                <label for="edit-guest-adults">
                    Adultos
                </label>

                <input
                    type="number"
                    id="edit-guest-adults"
                    min="0"
                >

            </div>


            <div class="form-group">

                <label for="edit-guest-children">
                    Niños
                </label>

                <input
                    type="number"
                    id="edit-guest-children"
                    min="0"
                >

            </div>

        </div>


        <div class="form-group">

            <label for="edit-guest-food">
                Restricción alimentaria
            </label>

            <input
                type="text"
                id="edit-guest-food"
            >

        </div>


        <div class="form-group">

            <label for="edit-guest-message">
                Mensaje
            </label>

            <textarea
                id="edit-guest-message"
                rows="4"
            ></textarea>

        </div>


        <div class="admin-guest-modal-actions">

            <button
                type="button"
                id="cancel-guest-edit"
            >
                Cancelar
            </button>

            <button
                type="button"
                id="save-guest-edit"
            >
                💾 Guardar cambios
            </button>

        </div>

    </div>
`;

document.body.appendChild(
    guestEditModal
);


const editGuestName =
    document.querySelector(
        "#edit-guest-name"
    );

const editGuestAttendance =
    document.querySelector(
        "#edit-guest-attendance"
    );

const editGuestAdults =
    document.querySelector(
        "#edit-guest-adults"
    );

const editGuestChildren =
    document.querySelector(
        "#edit-guest-children"
    );

const editGuestFood =
    document.querySelector(
        "#edit-guest-food"
    );

const editGuestMessage =
    document.querySelector(
        "#edit-guest-message"
    );

const cancelGuestEdit =
    document.querySelector(
        "#cancel-guest-edit"
    );

const saveGuestEdit =
    document.querySelector(
        "#save-guest-edit"
    );

/* =========================================================
   LOGIN
========================================================= */

const authBox =
    document.createElement("div");

authBox.innerHTML = `
    <div
        id="admin-auth-box"
        class="admin-auth-box"
    >
        <p id="admin-auth-status">
            Inicia sesión para administrar el Showerfest.
        </p>

        <button
            id="admin-login-button"
            type="button"
            class="admin-action-button"
        >
            Entrar con Google
        </button>

        <button
            id="admin-logout-button"
            type="button"
            class="admin-action-button"
            hidden
        >
            Cerrar sesión
        </button>
    </div>
`;

const adminHeader =
    document.querySelector(".admin-header");

adminHeader.insertAdjacentElement(
    "afterend",
    authBox
);

const loginButton =
    document.querySelector("#admin-login-button");

const logoutButton =
    document.querySelector("#admin-logout-button");

const authStatus =
    document.querySelector("#admin-auth-status");


/* =========================================================
   BOTÓN CANCELAR EDICIÓN
========================================================= */

const cancelEditButton =
    document.createElement("button");

cancelEditButton.type = "button";
cancelEditButton.id = "cancel-gift-edit";
cancelEditButton.className =
    "admin-secondary-button";

cancelEditButton.textContent =
    "Cancelar edición";

cancelEditButton.hidden = true;

giftAdminSubmit.insertAdjacentElement(
    "afterend",
    cancelEditButton
);


/* =========================================================
   LOGIN / LOGOUT
========================================================= */

loginButton.addEventListener(
    "click",
    async () => {
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
    }
);


logoutButton.addEventListener(
    "click",
    async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(
                "Error al cerrar sesión:",
                error
            );
        }
    }
);


/* =========================================================
   UTILIDADES
========================================================= */

function formatearFecha(timestamp) {
    if (
        !timestamp ||
        !timestamp.toDate
    ) {
        return "Sin fecha";
    }

    return timestamp
        .toDate()
        .toLocaleString(
            "es-CO",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
}


function mostrarEstado(mensaje) {
    authStatus.textContent = mensaje;
}


/* =========================================================
   INVITADOS - RESUMEN
========================================================= */

function actualizarResumen(lista) {
    const total = lista.length;

    const asistentes =
        lista.filter(
            (invitado) =>
                invitado.asiste === true
        );

    const adultos =
        asistentes.reduce(
            (total, invitado) =>
                total +
                Number(
                    invitado.adultos || 0
                ),
            0
        );

    const ninos =
        asistentes.reduce(
            (total, invitado) =>
                total +
                Number(
                    invitado.ninos || 0
                ),
            0
        );

    summaryTotal.textContent = total;
    summaryYes.textContent = asistentes.length;
    summaryAdults.textContent = adultos;
    summaryChildren.textContent = ninos;
}


/* =========================================================
   INVITADOS - FILTROS
========================================================= */

function obtenerListaFiltrada() {
    let listaFiltrada =
        [...invitados];

    if (filtroActivo === "si") {
        listaFiltrada =
            listaFiltrada.filter(
                (invitado) =>
                    invitado.asiste === true
            );
    }

    if (filtroActivo === "no") {
        listaFiltrada =
            listaFiltrada.filter(
                (invitado) =>
                    invitado.asiste === false
            );
    }

    if (
        filtroActivo === "familia-2026" ||
        filtroActivo === "amigos-2026"
    ) {
        listaFiltrada =
            listaFiltrada.filter(
                (invitado) =>
                    invitado.eventoId ===
                    filtroActivo
            );
    }

    if (textoBusqueda) {
        listaFiltrada =
            listaFiltrada.filter(
                (invitado) => {
                    const nombre =
                        String(
                            invitado.nombre || ""
                        )
                            .toLowerCase()
                            .trim();

                    return nombre.includes(
                        textoBusqueda
                    );
                }
            );
    }

    return listaFiltrada;
}


function aplicarFiltro() {
    renderizarInvitados(
        obtenerListaFiltrada()
    );
}


/* =========================================================
   INVITADOS - RENDER
========================================================= */

function renderizarInvitados(lista) {
    guestsList.innerHTML = "";

    if (!lista.length) {
        guestsList.innerHTML = `
            <p class="admin-loading">
                No se encontraron invitados.
            </p>
        `;

        return;
    }

    const fragment =
        document.createDocumentFragment();

    lista.forEach((invitado) => {
        const row =
            document.createElement("article");

        row.classList.add(
            "guest-row"
        );

        const asiste =
            invitado.asiste === true;

        row.innerHTML = `
            <div class="guest-row-main">

                <div class="guest-row-name">
                    <strong>
                        ${invitado.nombre || "Sin nombre"}
                    </strong>

                    <span>
                        ${
                            invitado.eventoId ||
                            "Sin evento"
                        }
                    </span>
                </div>


                <div class="guest-row-status">
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


                <div class="guest-row-count">
                    <span>Adultos</span>
                    <strong>
                        ${
                            asiste
                                ? invitado.adultos || 0
                                : 0
                        }
                    </strong>
                </div>


                <div class="guest-row-count">
                    <span>Niños</span>
                    <strong>
                        ${
                            asiste
                                ? invitado.ninos || 0
                                : 0
                        }
                    </strong>
                </div>


                <div class="guest-row-date">
                    <span>
                        ${formatearFecha(
                            invitado.fechaRegistro
                        )}
                    </span>
                </div>


                <div class="guest-row-actions">

                    <button
                        type="button"
                        class="guest-edit-button"
                        data-id="${invitado.id}"
                    >
                        ✏️ Editar
                    </button>

                    <button
                        type="button"
                        class="guest-delete-button"
                        data-id="${invitado.id}"
                    >
                        🗑️ Eliminar
                    </button>

                </div>

            </div>


            ${
                invitado.restriccionAlimentaria
                    ? `
                        <div class="guest-row-extra">
                            <strong>
                                Restricción:
                            </strong>
                            ${invitado.restriccionAlimentaria}
                        </div>
                    `
                    : ""
            }


            ${
                invitado.mensaje
                    ? `
                        <div class="guest-row-extra">
                            <strong>
                                Mensaje:
                            </strong>
                            ${invitado.mensaje}
                        </div>
                    `
                    : ""
            }
        `;


        const editButton =
            row.querySelector(
                ".guest-edit-button"
            );

        const deleteButton =
            row.querySelector(
                ".guest-delete-button"
            );


        editButton.addEventListener(
            "click",
            () => {
                editarInvitado(
                    invitado.id
                );
            }
        );


        deleteButton.addEventListener(
            "click",
            () => {
                eliminarInvitado(
                    invitado.id,
                    deleteButton
                );
            }
        );


        fragment.appendChild(
            row
        );
    });

    guestsList.appendChild(
        fragment
    );
}
function editarInvitado(invitadoId) {
    const invitado =
        invitados.find(
            (item) =>
                item.id === invitadoId
        );

    if (!invitado) {
        return;
    }

    invitadoEditandoId =
        invitado.id;

    editGuestName.value =
        invitado.nombre || "";

    editGuestAttendance.value =
        invitado.asiste
            ? "si"
            : "no";

    editGuestAdults.value =
        invitado.adultos || 0;

    editGuestChildren.value =
        invitado.ninos || 0;

    editGuestFood.value =
        invitado.restriccionAlimentaria || "";

    editGuestMessage.value =
        invitado.mensaje || "";

    guestEditModal.classList.remove(
        "hidden"
    );
}


async function eliminarInvitado(
    invitadoId,
    button
) {
    if (
        button.dataset.confirmDelete !==
        "true"
    ) {
        button.dataset.confirmDelete =
            "true";

        button.textContent =
            "⚠️ Confirmar";

        return;
    }

    try {
        await deleteDoc(
            doc(
                db,
                "invitados",
                invitadoId
            )
        );

        mostrarEstado(
            "Invitado eliminado."
        );

    } catch (error) {
        console.error(
            "Error al eliminar invitado:",
            error
        );

        mostrarEstado(
            "No fue posible eliminar el invitado."
        );
    }
}
cancelGuestEdit.addEventListener(
    "click",
    () => {
        guestEditModal.classList.add(
            "hidden"
        );

        invitadoEditandoId = null;
    }
);


saveGuestEdit.addEventListener(
    "click",
    async () => {
        if (!invitadoEditandoId) {
            return;
        }

        try {
            const asiste =
                editGuestAttendance.value ===
                "si";

            await updateDoc(
                doc(
                    db,
                    "invitados",
                    invitadoEditandoId
                ),
                {
                    nombre:
                        editGuestName.value.trim(),

                    asiste,

                    adultos:
                        asiste
                            ? Number(
                                editGuestAdults.value
                            )
                            : 0,

                    ninos:
                        asiste
                            ? Number(
                                editGuestChildren.value
                            )
                            : 0,

                    restriccionAlimentaria:
                        asiste
                            ? editGuestFood.value.trim()
                            : "",

                    mensaje:
                        editGuestMessage.value.trim()
                }
            );

            guestEditModal.classList.add(
                "hidden"
            );

            invitadoEditandoId = null;

            mostrarEstado(
                "Invitado actualizado."
            );

        } catch (error) {
            console.error(
                "Error al actualizar invitado:",
                error
            );

            mostrarEstado(
                "No fue posible actualizar el invitado."
            );
        }
    }
);
/* =========================================================
   INVITADOS - CONTROLES
========================================================= */

filterButtons.forEach(
    (button) => {
        button.addEventListener(
            "click",
            () => {
                filtroActivo =
                    button.dataset.filter;

                filterButtons.forEach(
                    (option) => {
                        option.classList.remove(
                            "active"
                        );
                    }
                );

                button.classList.add(
                    "active"
                );

                aplicarFiltro();
            }
        );
    }
);


guestSearch.addEventListener(
    "input",
    () => {
        textoBusqueda =
            guestSearch.value
                .toLowerCase()
                .trim();

        aplicarFiltro();
    }
);


/* =========================================================
   INVITADOS - FIRESTORE
========================================================= */

function escucharInvitados() {
    const invitadosRef =
        query(
            collection(
                db,
                "invitados"
            ),
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


/* =========================================================
   REGALOS - LIMPIAR FORMULARIO
========================================================= */

function limpiarFormularioRegalo() {
    giftAdminForm.reset();

    giftTypeInput.value =
        "UNICO";

    regaloEditandoId = null;

    giftAdminSubmit.textContent =
        "🚀 Agregar regalo";

    cancelEditButton.hidden =
        true;
}


/* =========================================================
   REGALOS - CREAR / EDITAR
========================================================= */

giftAdminForm.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const user =
            auth.currentUser;

        if (
            !user ||
            user.email !== ADMIN_EMAIL
        ) {
            mostrarEstado(
                "No tienes permiso para administrar regalos."
            );

            return;
        }

        const nombre =
            giftNameInput.value.trim();

        const categoria =
            giftCategoryInput.value;

        const unidad =
            giftUnitInput.value.trim();

        const tipo =
            giftTypeInput.value;

        const descripcion =
            giftDescriptionInput
                .value
                .trim();

        const imagen =
            giftImageInput
                .value
                .trim();

        if (
            !nombre ||
            !categoria ||
            !unidad ||
            !tipo ||
            !descripcion
        ) {
            mostrarEstado(
                "Completa todos los campos obligatorios."
            );

            return;
        }

        try {
            giftAdminSubmit.disabled =
                true;

            giftAdminSubmit.textContent =
                regaloEditandoId
                    ? "Guardando cambios..."
                    : "Guardando...";

            if (regaloEditandoId) {

                const regaloRef =
                    doc(
                        db,
                        "regalos",
                        regaloEditandoId
                    );

                const regaloActual =
                    regalos.find(
                        (regalo) =>
                            regalo.id ===
                            regaloEditandoId
                    );

                const cambios = {
                    nombre,
                    categoria,
                    unidad,
                    tipo,
                    descripcion,
                    imagen,

                    fechaActualizacion:
                        serverTimestamp()
                };

                if (
                    tipo === "ABIERTO" &&
                    regaloActual?.tipo !==
                        "ABIERTO"
                ) {
                    cambios.cantidadReservada =
                        0;
                }

                await updateDoc(
                    regaloRef,
                    cambios
                );

                mostrarEstado(
                    `Regalo actualizado: ${nombre}`
                );

            } else {

                const nuevoRegalo = {
                    nombre,
                    categoria,
                    descripcion,
                    unidad,
                    tipo,
                    imagen,

                    activo: true,

                    estado:
                        "disponible",

                    creadoPor:
                        user.email,

                    fechaCreacion:
                        serverTimestamp()
                };

                if (tipo === "ABIERTO") {
                    nuevoRegalo
                        .cantidadReservada = 0;
                }

                await addDoc(
                    collection(
                        db,
                        "regalos"
                    ),
                    nuevoRegalo
                );

                mostrarEstado(
                    `Regalo agregado: ${nombre}`
                );
            }

            limpiarFormularioRegalo();

        } catch (error) {
            console.error(
                "Error al guardar regalo:",
                error
            );

            mostrarEstado(
                "No fue posible guardar el regalo."
            );

        } finally {
            giftAdminSubmit.disabled =
                false;
        }
    }
);


/* =========================================================
   REGALOS - CANCELAR EDICIÓN
========================================================= */

cancelEditButton.addEventListener(
    "click",
    () => {
        limpiarFormularioRegalo();

        mostrarEstado(
            `Sesión iniciada como ${
                auth.currentUser?.email || ""
            }`
        );
    }
);


/* =========================================================
   REGALOS - EDITAR
========================================================= */

function editarRegalo(regaloId) {
    const regalo =
        regalos.find(
            (item) =>
                item.id === regaloId
        );

    if (!regalo) {
        return;
    }

    regaloEditandoId =
        regalo.id;

    giftNameInput.value =
        regalo.nombre || "";

    giftCategoryInput.value =
        regalo.categoria || "";

    giftUnitInput.value =
        regalo.unidad || "";

    giftTypeInput.value =
        regalo.tipo || "UNICO";

    giftDescriptionInput.value =
        regalo.descripcion || "";

    giftImageInput.value =
        regalo.imagen || "";

    giftAdminSubmit.textContent =
        "💾 Guardar cambios";

    cancelEditButton.hidden =
        false;

    giftAdminForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   REGALOS - ACTIVAR / DESACTIVAR
========================================================= */

async function cambiarEstadoRegalo(
    regaloId,
    activoActual
) {
    try {
        const regaloRef =
            doc(
                db,
                "regalos",
                regaloId
            );

        await updateDoc(
            regaloRef,
            {
                activo:
                    !activoActual,

                fechaActualizacion:
                    serverTimestamp()
            }
        );

        mostrarEstado(
            !activoActual
                ? "Regalo activado."
                : "Regalo desactivado."
        );

    } catch (error) {
        console.error(
            "Error al cambiar estado:",
            error
        );

        mostrarEstado(
            "No fue posible cambiar el estado del regalo."
        );
    }
}


/* =========================================================
   REGALOS - ELIMINAR
========================================================= */

async function eliminarRegalo(
    regaloId,
    button
) {
    /*
     * Primer clic:
     * pedimos confirmación sin alert()
     */

    if (
        button.dataset.confirmDelete !==
        "true"
    ) {
        button.dataset.confirmDelete =
            "true";

        button.textContent =
            "⚠️ Confirmar eliminación";

        button.classList.add(
            "confirm-delete"
        );

        return;
    }


    /*
     * Segundo clic:
     * eliminamos.
     */

    try {
        await deleteDoc(
            doc(
                db,
                "regalos",
                regaloId
            )
        );

        mostrarEstado(
            "Regalo eliminado definitivamente."
        );

    } catch (error) {
        console.error(
            "Error al eliminar regalo:",
            error
        );

        mostrarEstado(
            "No fue posible eliminar el regalo."
        );
    }
}


/* =========================================================
   REGALOS - RENDER
========================================================= */

function renderizarRegalos(lista) {
    adminGiftsList.innerHTML = "";

    if (!lista.length) {
        adminGiftsList.innerHTML = `
            <p class="admin-loading">
                No hay regalos registrados.
            </p>
        `;

        return;
    }

    const fragment =
        document.createDocumentFragment();

    lista.forEach((regalo) => {
        const card =
            document.createElement(
                "article"
            );

        card.classList.add(
            "admin-gift-card"
        );

        if (regalo.activo === false) {
            card.classList.add(
                "gift-disabled"
            );
        }

        const esAbierto =
            regalo.tipo === "ABIERTO";

        const reservado =
            regalo.estado ===
            "reservado";

        card.innerHTML = `
            <div class="admin-gift-header">

                <div>

                    <h3>
                        ${
                            regalo.nombre ||
                            "Regalo sin nombre"
                        }
                    </h3>

                    <div class="admin-gift-meta">

                        <span>
                            ${
                                regalo.categoria ||
                                "Sin categoría"
                            }
                        </span>

                        <span>
                            ${
                                esAbierto
                                    ? "♾️ Abierto"
                                    : "🎁 Único"
                            }
                        </span>

                        <span>
                            ${
                                reservado
                                    ? "🔒 Reservado"
                                    : "● Disponible"
                            }
                        </span>

                        <span>
                            ${
                                regalo.activo ===
                                false
                                    ? "⛔ Desactivado"
                                    : "✅ Activo"
                            }
                        </span>

                        <span>
                            ${
                                regalo.unidad ||
                                "Sin unidad"
                            }
                        </span>

                        ${
                            esAbierto
                                ? `
                                    <span>
                                        ${
                                            regalo
                                                .cantidadReservada || 0
                                        }
                                        reservados
                                    </span>
                                `
                                : ""
                        }

                    </div>

                </div>

            </div>

            ${
                regalo.descripcion
                    ? `
                        <p class="admin-gift-description">
                            ${regalo.descripcion}
                        </p>
                    `
                    : ""
            }

            ${
                reservado &&
                regalo.reservadoPor
                    ? `
                        <p class="admin-gift-reserved">
                            🔒 Reservado por
                            ${regalo.reservadoPor}
                        </p>
                    `
                    : ""
            }

            <div class="admin-gift-actions">

                <button
                    type="button"
                    class="gift-edit-button"
                    data-id="${regalo.id}"
                >
                    ✏️ Editar
                </button>

                <button
                    type="button"
                    class="gift-toggle-button"
                    data-id="${regalo.id}"
                >
                    ${
                        regalo.activo ===
                        false
                            ? "✅ Activar"
                            : "⛔ Desactivar"
                    }
                </button>

                <button
                    type="button"
                    class="gift-delete-button"
                    data-id="${regalo.id}"
                >
                    🗑️ Eliminar
                </button>

            </div>
        `;


        const editButton =
            card.querySelector(
                ".gift-edit-button"
            );

        const toggleButton =
            card.querySelector(
                ".gift-toggle-button"
            );

        const deleteButton =
            card.querySelector(
                ".gift-delete-button"
            );


        editButton.addEventListener(
            "click",
            () => {
                editarRegalo(
                    regalo.id
                );
            }
        );


        toggleButton.addEventListener(
            "click",
            () => {
                cambiarEstadoRegalo(
                    regalo.id,
                    regalo.activo !== false
                );
            }
        );


        deleteButton.addEventListener(
            "click",
            () => {
                eliminarRegalo(
                    regalo.id,
                    deleteButton
                );
            }
        );


        fragment.appendChild(
            card
        );
    });

    adminGiftsList.appendChild(
        fragment
    );
}


/* =========================================================
   REGALOS - FIRESTORE
========================================================= */

function escucharRegalosAdmin() {
    const regalosRef =
        collection(
            db,
            "regalos"
        );

    unsubscribeRegalos =
        onSnapshot(
            regalosRef,

            (snapshot) => {
                regalos =
    snapshot.docs.map(
        (documento) => ({
            ...documento.data(),

            // El ID real de Firestore siempre gana,
            // incluso en regalos antiguos que tienen
            // un campo "id" numérico.
            id: documento.id
        })
    );

                regalos.sort(
                    (a, b) =>
                        String(
                            a.nombre || ""
                        ).localeCompare(
                            String(
                                b.nombre || ""
                            ),
                            "es"
                        )
                );

                renderizarRegalos(
                    regalos
                );
            },

            (error) => {
                console.error(
                    "Error al cargar regalos:",
                    error
                );

                adminGiftsList.innerHTML = `
                    <p class="admin-loading">
                        No fue posible cargar los regalos.
                    </p>
                `;
            }
        );
}


/* =========================================================
   FORMULARIO HABILITADO / DESHABILITADO
========================================================= */

function establecerEstadoRegalos(
    habilitado
) {
    const controles =
        giftAdminForm.querySelectorAll(
            "input, select, textarea, button"
        );

    controles.forEach(
        (control) => {
            control.disabled =
                !habilitado;
        }
    );
}


/* =========================================================
   ESTADO DE AUTENTICACIÓN
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (unsubscribeInvitados) {
            unsubscribeInvitados();
            unsubscribeInvitados = null;
        }

        if (unsubscribeRegalos) {
            unsubscribeRegalos();
            unsubscribeRegalos = null;
        }

        if (user) {

            if (
                user.email !==
                ADMIN_EMAIL
            ) {
                authStatus.textContent =
                    "Esta cuenta no está autorizada.";

                establecerEstadoRegalos(
                    false
                );

                await signOut(auth);

                return;
            }

            authStatus.textContent =
                `Sesión iniciada como ${user.email}`;

            loginButton.hidden = true;
            logoutButton.hidden = false;

            guestSearch.disabled = false;

            establecerEstadoRegalos(
                true
            );

            guestsList.innerHTML = `
                <p class="admin-loading">
                    Cargando invitados...
                </p>
            `;

            adminGiftsList.innerHTML = `
                <p class="admin-loading">
                    Cargando regalos...
                </p>
            `;

            escucharInvitados();
            escucharRegalosAdmin();

        } else {

            authStatus.textContent =
                "Inicia sesión para administrar el Showerfest.";

            loginButton.hidden = false;
            logoutButton.hidden = true;

            invitados = [];
            regalos = [];

            textoBusqueda = "";

            guestSearch.value = "";
            guestSearch.disabled = true;

            establecerEstadoRegalos(
                false
            );

            summaryTotal.textContent =
                "0";

            summaryYes.textContent =
                "0";

            summaryAdults.textContent =
                "0";

            summaryChildren.textContent =
                "0";

            guestsList.innerHTML = `
                <p class="admin-loading">
                    Inicia sesión con Google para acceder al panel.
                </p>
            `;

            adminGiftsList.innerHTML = `
                <p class="admin-loading">
                    Inicia sesión para administrar los regalos.
                </p>
            `;
        }
    }
);