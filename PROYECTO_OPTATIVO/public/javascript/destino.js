"use strict";
$('#calendar').attr("value", "");
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

$('#calendar').daterangepicker({
    autoUpdateInput: false,
    locale: {
        cancelLabel: 'Clear'
    },
    "minDate": new Date(),
}, function (start, end) {
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));

    $('#calendar').attr("placeholder", `De ${start.format('DD-MM-YYYY')} a ${end.format('DD-MM-YYYY')}`);
    $('#calendar').attr("value", `De ${start.format('DD-MM-YYYY')} a ${end.format('DD-MM-YYYY')}`);
    $('#startDate').attr("value", start.format('YYYY-MM-DD'));
    $('#endDate').attr("value", end.format('YYYY-MM-DD'));
    $('#precioTotal').data("days", end.diff(start, 'days') + 1);

    calcTotalPrice();
});

function calcTotalPrice() {
    const numPersonas = $('#numPersonas').val();
    const days = $('#precioTotal').data("days");
    const precioPorNoche = $('#precioTotal').data("precio");

    if (days === undefined)
        return;

    $('#precioTotal').text(`${precioPorNoche * days * numPersonas}€`);
    document.getElementById("precio").classList.remove("d-none");
}

$('#numPersonas').on("change", e => {
    calcTotalPrice();
})
