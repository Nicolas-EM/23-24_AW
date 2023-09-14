// Ejecutar cuando se cargue la pagina
window.addEventListener('load', (event) => {
    createPriceFilterEventListener();
})

function createPriceFilterEventListener() {
    const rangeInput = document.getElementById("customRange1");
    const rangeValue = document.getElementById("rangeValue");
    rangeInput.addEventListener("input", function () { rangeValue.textContent = rangeInput.value; });
}