// Rotate arrow on collapse show
$(".collapse").on('show.bs.collapse', e => {
    // Find the closest element with class 'dropdown-arrow' and remove the 'rotated' class
    $(e.target)
        .closest('.nav-item')
        .find('.dropdown-arrow')
        .removeClass('rotated');
});

// Rotate arrow on collapse hide
$(".collapse").on('hide.bs.collapse', e => {
    // Find the closest element with class 'dropdown-arrow' and remove the 'rotated' class
    $(e.target)
        .closest('.nav-item')
        .find('.dropdown-arrow')
        .addClass('rotated');
});

$('button[data-bs-toggle="pill"]').on('shown.bs.tab', event => {
    //   event.target // newly activated tab
    //   event.relatedTarget // previous active tab

    console.log(event.target.id);

    if (event.target.id === "pills-installationsManage-tab") {
        getInstallations();
    } else if (event.target.id === "pills-stats-tab") {
        getStatsByFaculty();
        getStatsByUser();
    } else {
        console.error("Not implemented");
    }
})


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


// Load stats
function getStatsByUser() {
    $.ajax({
        method: "GET",
        url: "/reservations/byUser",
        success: function (data) {
            let reservations = "";
            for (let x in data) {
                const user = data[x];
                reservations += createStatRow(user);
            }
            $("#statsByUser").html(reservations);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
}

function getStatsByFaculty() {
    $.ajax({
        method: "GET",
        url: "/reservations/byFaculty",
        success: function (data) {
            let reservations = "";
            for (let x in data) {
                const faculty = data[x];
                reservations += createStatRow(faculty);
            }
            $("#statsByFaculty").html(reservations);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
}

function createStatRow(obj){
    return `<tr>
                <td>${obj.name}</td>
                <td>${obj.ReservationCount}</td>
                <td>${new Date(obj.EarliestReservation).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td>${new Date(obj.LatestReservation).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
            </tr>`
}