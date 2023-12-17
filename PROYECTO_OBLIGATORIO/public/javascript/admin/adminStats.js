"use strict"

// Load stats
function getStatsByUser() {
    $.ajax({
        method: "GET",
        url: "/reservations/userStats",
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

// Load stats
function getStatsByFaculty() {
    $.ajax({
        method: "GET",
        url: "/reservations/facultyStats",
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

// Create html
function createStatRow(obj){
    return `<tr>
                <td>${obj.name}</td>
                <td>${obj.ReservationCount}</td>
                <td>${new Date(obj.EarliestReservation).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td>${new Date(obj.LatestReservation).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
            </tr>`
}