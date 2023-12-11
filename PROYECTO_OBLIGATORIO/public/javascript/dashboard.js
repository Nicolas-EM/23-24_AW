"use strict";

$(document).ready(function () {
  getFaculties();
});

function getInstallations() {
  $("#noResults").addClass("d-none");

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
    },
  });
}

function createInstallationCard(inst) {

  return `<div class="col">
                <div class="card h-100 w-100">
                    <!-- Img row -->
                    <a href="#">
                        <div class="rounded">
                            <!-- hace falta guardar el formato tambien!-->
                            <img src="installations/image/${inst.id
    }" class="rounded d-block w-100 zoom-on-hover" alt="Installation Image">
                        </div>
                    </a>
                    <!-- Card Body -->
                    <div class="card-body align-items-center p-1 pt-2">
                        <h5 class="card-title">
                            ${inst.name}
                        </h5>
                        <h6 class="card-subtitle mb-2">
                            ${getFacultyNameFromId(inst.facultyId)}
                        </h6>
                        <p class="card-text just">
                            Type: ${inst.type === 0 ? "Collective" : "Individual"}
                            <br>
                            Capacity: ${inst.capacity}
                        </p>
                    </div>
                    <!-- Card Footer -->
                    <div class="card-footer">
                        <div class="row justify-content-center">
                        ${getButtonFromAvailability(inst.availabity, inst.id)}
                        </div>
                    </div>
                </div>
            </div>`;
}

function getFacultyNameFromId(id) {
  return $(`#facultyFilter`).find(`[value='${id}']`).text().trim();
}

function getButtonFromAvailability(availability, id) {
  if (availability === "available")
    return `<button id="${id}" class="btn btn-primary pill-rounded" data-bs-toggle="modal" data-bs-target="#reservationModal">Book now!</button>`;
  else
    return '<button class="btn btn-secondary pill-rounded disabled">Unavailable</button>';
}

function getFaculties() {
  $.ajax({
    method: "GET",
    url: "/faculties/",
    success: function (data) {
      for (let x in data) {
        const faculty = data[x];
        $("#facultyFilter").append(`<option value="${faculty.id}">
                                                ${faculty.name}
                                            </option>`);
      }

      getInstallations();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();

      getInstallations();
    },
  });
}

function performSearch() {
  scroll = false;

  // Get the value from the search input
  const query = $("#query").val();
  const faculty = $("#facultyFilter").val();

  if (query === "" && faculty === "") {
    $("#installations").empty();
    getInstallations();
  } else {
    // Get the CSRF token value
    const _csrf = $("input[name='_csrf']").val();
    // Make an AJAX request to the server
    $.ajax({
      method: "POST",
      url: "/installations/search",
      data: {
        query,
        faculty,
        _csrf,
      },
      success: function (data) {
        $("#installations").empty();
        for (let x in data) {
          const inst = data[x];
          $("#installations").append(createInstallationCard(inst));
        }

        if (data.length === 0) {
          $("#noResults").removeClass("d-none");
        }
      },
      error: function (jqXHR) {
        $("#toastMsg").html(jqXHR.responseText);
        toast.show();
      },
    });
  }
}

$("#searchForm").on("submit", (event) => {
  event.preventDefault();
  performSearch();
});

$('#calendar').daterangepicker({
  singleDatePicker: true,
  autoUpdateInput: false,
  isInvalidDate: function(date){
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    if(date < today || date > maxDate)
      return true;
    else {
      return false;
    }
  },
  "minDate": new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000),
}, function (start) {
  const startDate = start.format('YYYY-MM-DD');

  $('#calendar').attr("placeholder", start.format('DD-MM-YYYY'));
  $('#calendar').attr("value", start.format('DD-MM-YYYY'));
  $('#startDate').attr("value", startDate);
  // $('#endDate').attr("value", endDate);
});




$("#calendar").on('apply.daterangepicker', function (e, picker) {
  //get day of picker
  let checkDate = picker.getDate.format('YYYY-MM-DD');
  //ajax call to check available hours:
  $.ajax({
    method: "GET",
    url: `/reservations/check/${$('#installationId').val()}/${checkDate}`,
    async: false,
    success: function (data) {
      //data.foreach
      $('#reservationModal').append();
    },
    error: function (jqXHR) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
});


function newReservation() {
  const _csrf = $("#_csrf").val();
  const installationId = $('#installationId').val();
  const startDate = $('#startDate').val();
  const endDate = $('#endDate').val();
  $.ajax({
    method: "POST",
    url: "/reservations/create",
    data: {
      installationId,
      startDate,
      endDate,
      _csrf,
    },
   // cache: false, // Disable cache PARA QUE ME FUNCIONE LA PETICION DE LAS NARICES
    success: function (data) {
      $("#toastMsg").html(data);
      toast.show();
      $('#reservationModal').modal('hide');
      // $('#reservationForm').trigger("reset");
    },
    error: function (jqXHR) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
}

$('#reservationModal').on('show.bs.modal', event => {
  $('#calendar').attr("value", "");

  const buttonId = event.relatedTarget.id;
  $('#installationId').attr("value", buttonId);
});

$('#reservationForm').on('submit', e => {
  e.preventDefault();
  newReservation();
});
