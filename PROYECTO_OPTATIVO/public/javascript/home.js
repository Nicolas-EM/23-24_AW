let scroll = true;

$(document).ready(function () {
    getDestinos();
});

// Cargar destinos dinámicamente
function getDestinos(){
    // Make an AJAX request to the server
    $.ajax({
        method: "GET",
        url: "/destinations/",
        success: function (data) {
            $("#destRow").append(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
}

// Llamada AJAX para busqueda
function performSearch() {
    scroll = false;
    
    // Get the value from the search input
    const query = $("#query").val();
    const minPrice = $("#minPrice").val();
    const maxPrice = $("#maxPrice").val();

    // Make an AJAX request to the server
    $.ajax({
        method: "POST",
        url: "/destinations/search",
        data: { _csrf: $("#csrfToken").val(), query, minPrice, maxPrice },
        success: function (data) {
            // Call renderDestinations with the received data
            $("#destRow").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
}

// Call performSearch when the search button is clicked
$("#searchForm").on("submit", e => {
    e.preventDefault();
    performSearch();
});

// Comprobacion minPrice en cliente
$("#minPrice").on("change", e => {
    if($("#minPrice").val() > $("#maxPrice").val()){
        $("#minPrice").val($("#maxPrice").val());
    }
});

// Comprobacion maxPrice en cliente
$("#maxPrice").on("change", e => {
    if($("#minPrice").val() > $("#maxPrice").val()){
        $("#maxPrice").val($("#minPrice").val());
    }

    if($("#maxPrice").val() == 0){
        $("#maxPrice").val(5000);
    }
});

// Carga dinámica al hacer scroll
window.onscroll = function(ev) {
    if (scroll && (window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        // load more destinations
        getDestinos();
    }
};
