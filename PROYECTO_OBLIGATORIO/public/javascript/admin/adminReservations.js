"use strict";

// Load reservations tab
function setReservationsSearch() {
  createReservationFacultyFilters();
  createReservationInstallationFilters();
  getAllReservations();
}

// AJAX - Create faculty search filters
function createReservationFacultyFilters() {
  $.ajax({
    method: "GET",
    url: "/faculties/",
    success: function (data) {
      $("#rFacultyFilter").empty();
      $("#rFacultyFilter").append(`<option value="">Any</option>`);

      for (let x in data) {
        const faculty = data[x];
        $("#rFacultyFilter").append(`<option value="${faculty.id}">
                                                ${faculty.name}
                                            </option>`);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
}

// AJAX - Create installation search filters
function createReservationInstallationFilters() {
  $.ajax({
    method: "GET",
    url: "/installations/",
    success: function (data) {
      $("#rInstallationFilter").empty();
      $("#rInstallationFilter").append(`<option value="">Any</option>`);

      for (let x in data) {
        const installation = data[x];
        $("#rInstallationFilter").append(`<option value="${installation.id}">
                                                ${installation.name}
                                            </option>`);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
}

// AJAX - get reservations
function getAllReservations() {
  $.ajax({
    method: "GET",
    url: "/reservations/",
    success: function (data) {
      let reservations = "";

      for (let x in data) {
        const r = data[x];
        reservations += createReservationRow(r);
      }

      $("#reservationList").html(reservations);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
}

// Create html reservation row
function createReservationRow(reservation) {
  return `<tr class="inst${reservation.installationId} fac${
    reservation.facultyId
  }">
                <td class="align-middle">
                    ${new Date(reservation.datecreation).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                </td>
                <td class="align-middle">${reservation.userName}</td>
                <td class="align-middle">${reservation.userSurname}</td>
                <td class="align-middle">${reservation.userEmail}</td>
                <td class="align-middle">${reservation.installationName}</td>
                <td class="align-middle">${reservation.facultyName}</td>
                <td class="align-middle">
                    ${new Date(reservation.dateini).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                </td>
                <td class="align-middle">
                    ${new Date(reservation.dateend).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                </td>
            </tr>`;
}

function filterInstallation() {
  const installationId = $("#rInstallationFilter").val();

  if (installationId) {
    // Add the 'd-none' class to all rows initially
    $("#reservationList tr").addClass("d-none");

    // Remove the 'd-none' class from rows with the specified installation ID
    $("#reservationList tr.inst" + installationId).removeClass("d-none");
  }
}

function filterFaculty() {
  const facultyId = $("#rFacultyFilter").val();

  if (facultyId) {
    // Add the 'd-none' class to all rows initially
    $("#reservationList tr").addClass("d-none");

    // Remove the 'd-none' class from rows with the specified installation ID
    $("#reservationList tr.fac" + facultyId).removeClass("d-none");
  }
}

// AJAX - Reserva search
$("#reservationsSearchForm").on("submit", (e) => {
  e.preventDefault();

  // Get the value from the search input
  const query = $("#reservaSearchQuery").val();

  let startDate = $("#startDateFilter").val();
  if (!startDate) startDate = new Date(0);
  else {
    startDate = new Date(startDate);
    startDate.setDate(startDate.getDate() + 1);
  }

  let endDate = $("#endDateFilter").val();
  if (!endDate) endDate = new Date(2100, 0, 1);
  else {
    endDate = new Date(endDate);
    endDate.setDate(endDate.getDate() + 1);
  }

  // Get the CSRF token value
  const _csrf = $("#csrfToken").val();
  // Make an AJAX request to the server
  $.ajax({
    method: "POST",
    url: "/reservations/search",
    data: {
      query,
      startDate: startDate.toISOString().slice(0, 19).replace("T", " "),
      endDate: endDate.toISOString().slice(0, 19).replace("T", " "),
      _csrf,
    },
    success: function (data) {
      let reservations = "";

      for (let x in data) {
        const r = data[x];
        reservations += createReservationRow(r);
      }

      $("#reservationList").html(reservations);

      filterInstallation();
      filterFaculty();

      if ($("#reservationList tr:not(.d-none)").length === 0) {
        $("#toastMsg").html("No users found. Try clearing filters?");
        toast.show();
      } else {
        $("#toastMsg").html("Success: Showing reservations");
        toast.show();
      }
    },
    error: function (jqXHR) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
});
