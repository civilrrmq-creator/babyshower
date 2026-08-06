const parametros = new URLSearchParams(window.location.search);

export const eventoId =
    parametros.get("evento") || "familia-2026";

console.log("Evento activo:", eventoId);