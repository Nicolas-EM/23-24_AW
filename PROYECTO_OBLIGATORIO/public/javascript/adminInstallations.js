"use strict"

// Load installations to manage
function getInstallations() {
    // Make an AJAX request to the server
    $.ajax({
        method: "GET",
        url: "/installations/",
        success: function (data) {
            let installations = "";
            for (let x in data) {
                const inst = data[x];
                installations += createInstallationCard(inst);
            }

            $("#installations").html(installations);
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
                    <div class="rounded">
                        <!-- hace falta guardar el formato tambien!-->
                        <img src="installations/image/${inst.id}" class="rounded d-block w-100 zoom-on-hover" alt="Installation Image">
                    </div>
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
                        <div class="row row-cols-1 row-cols-md-2 g-2 justify-content-center">
                            <div class="col">
                                <button class="btn btn-primary pill-rounded w-100">Modify</button>
                            </div>
                            <div class="col">
                                <button class="btn btn-primary pill-rounded w-100">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
}