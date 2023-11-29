"use strict";

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

$('#reservaForm').on("submit", e => {
    e.preventDefault();
    const destinoId = $('#destinoId').val();
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    const numPersonas = $('#numPersonas').val();
    
    $.ajax({
        url: '/reservas/create',
        method: 'POST',
        data: {
            _csrf: $("#csrfToken").val(),
            destinoId,
            startDate,
            endDate,
            numPersonas
        },
        success: function(data) {
            $("#toastMsg").html(data);
            toast.show();
        },
        error: function(xhr, status, error) {
            $("#toastMsg").html(xhr.responseText);
            toast.show();
        }
    });
});
