"use strict";

$(document).ready(function () {
    getInstallations();
});


function getInstallations() {
    // Make an AJAX request to the server
    $.ajax({
        method: "GET",
        url: "/installations/",
        success: function (data) {
            for (let x in data) {
                const inst = data[x];
                $("#installations").append(createInstallationCard(inst));
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
}

function createInstallationCard(inst) {
    return `<div class="col">
                <div class="card h-100 w-100">
                    <!-- Img row -->
                    <a href="#">
                        <div class="rounded">
                            <!-- hace falta guardar el formato tambien!-->
                            <img src="installations/image/${inst.id}" class="rounded d-block w-100 zoom-on-hover" alt="Installation Image">
                        </div>
                    </a>
                    <!-- Card Body -->
                    <div class="card-body align-items-center p-1 pt-2 text-center"> <!-- Added text-center class -->
                        <h5 class="card-title">
                            ${inst.name}
                        </h5>
                        <p class="card-text just">
                            tipo de instalación: ${inst.type}
                            <br>
                            Capacidad: ${inst.capacity}
                        </p>
                    </div>
                    <!-- Card Footer -->
                    <div class="card-footer">
                        <div class="row justify-content-center">
                            ${getButtonFromAvailability(inst.availabity)}
                        </div>
                    </div>
                </div>
            </div>`
}

function getButtonFromAvailability(availability) {
    if (availability === "Available")
        return '<button class="btn btn-primary pill-rounded">Book now!</button>'
    else
        return '<button class="btn btn-secondary pill-rounded disabled">Unavailable</button>'
}
function performSearch() {
    scroll = false;

    // Get the value from the search input
    const query = $("#query").val();
    //const minPrice = $("#minPrice").val();
   //const maxPrice = $("#maxPrice").val();

    // Get the CSRF token value
    const csrfToken = $("input[name='_csrf']").val();
    console.log("query: ", query);
    // Make an AJAX request to the server
    $.ajax({
        method: "POST",
        url: "/installations/search",
        data: {query},
        headers: {
            "X-CSRF-Token": csrfToken // Include the CSRF token in the request headers
        },
        success: function (data) {
            $("#installations").empty();
            for (let x in data) {
                const inst = data[x];
                $("#installations").append(createInstallationCard(inst));
            }
        },
        error: function (jqXHR) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
}


$("#searchForm").on("submit", function (event) {
    event.preventDefault();
    performSearch();
});
