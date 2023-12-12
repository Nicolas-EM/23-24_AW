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
                <div class="card h-100 w-100" data-bs-toggle="modal" data-bs-target="#reservationModal">
                    <!-- Img row -->
                    <div class="rounded">
                        <!-- hace falta guardar el formato tambien!-->
                        <img src="installations/image/${
                          inst.id
                        }" class="rounded d-block w-100 zoom-on-hover" alt="Installation Image">
                    </div>
                    <!-- Card Body -->
                    <div class="card-body align-items-center p-1 pt-2">
                        <h5 class="card-title">
                            ${inst.name}
                        </h5>
                        <h6 class="card-subtitle mb-2">
                            ${getFacultyNameFromId(inst.facultyId)}
                        </h6>
                        <p class="card-text just">
                            Type: ${
                              inst.type === 0 ? "Collective" : "Individual"
                            }
                            <br>
                            Capacity: ${inst.capacity}
                        </p>
                    </div>
                    <!-- Card Footer -->
                    <div class="card-footer">
                        <div class="row justify-content-center">
                          <button id="${
                            inst.id
                          }" class="btn btn-primary pill-rounded" data-bs-toggle="modal" data-bs-target="#reservationModal">Book now!</button>
                        </div>
                    </div>
                </div>
            </div>`;
}

function getFacultyNameFromId(id) {
  return $(`#facultyFilter`).find(`[value='${id}']`).text().trim();
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

$("#calendar").daterangepicker(
  {
    singleDatePicker: true,
    autoUpdateInput: false,
    isInvalidDate: function (date) {
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 7);
      if (date < today || date > maxDate) return true;
      else {
        return false;
      }
    },
    minDate: new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000),
  },
  function (start) {
    const startDate = start.format("YYYY-MM-DD");

    $("#calendar").attr("placeholder", start.format("YYYY-MM-DD"));
    $("#calendar").attr("value", start.format("YYYY-MM-DD"));
    $("#startDate").attr("value", startDate);
    // $('#endDate').attr("value", endDate);
  }
);

$("#calendar").on("apply.daterangepicker", function (ev, picker) {
  ev.preventDefault();
  $("#hourBtns").empty();

  //get day of picker
  let checkDate = picker.startDate.format("YYYY-MM-DD");
  
  //ajax call to check available hours:
  $.ajax({
    method: "GET",
    url: `/reservations/check/${$("#installationId").val()}/${checkDate}`,
    async: false,
    success: function (data) {
      if (data) {
        console.log("los datos para el dia: ", checkDate, "son : ", data);
        let hours = [
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
        ];

        for (let i = 0; i < hours.length - 1; i += 4) {
          const row = $(
            '<div class="row justify-content-center g-3 mb-3"></div>'
          );
          for (let j = 0; j < 4; j++) {
            let startHour = hours[i + j];
            let endHour = hours[i + j + 1];
            if (endHour === undefined) {
              endHour = 21;
            }
            const button = $(
              '<button class="btn btn-primary" type="button"></button>'
            ).text(`${startHour.toString().padStart(2, '0')}-${endHour}`);
            if (data[`${startHour}-${endHour}`]) {
              console.log("entre a crear un boton amarillo de warning");
              button.removeClass("btn-primary");
              button.addClass("btn-warning");
            }
            button.attr("value", startHour); // Set the start date as the val attribute
            const col = $('<div class="col text-center"></div>').append(button);
            row.append(col);
          }
          $("#hourBtns").append(row);
        }
      }
    },
    error: function (jqXHR) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
});

$("#hourBtns").on("click", "button", function () {
  const selectedTime = $(this).val();
  const startDate =  $('#startDate').val() + " " + selectedTime.split("-")[0] + ":00";
  const endDate = moment(startDate, "YYYY-MM-DD HH:mm").add(1, "hour").format("YYYY-MM-DD HH:mm");
  console.log("start date: ", startDate, "end date: ", endDate);
  $("#startDate").attr("value", startDate);
  $("#endDate").attr("value", endDate);
  if ($(this).hasClass("btn-secondary")) {
    $.ajax({
      method: "POST",
      url: "/reservations/addToQueue",
      data: {
        installationId: $("#installationId").val(),
        startDate: $("#startDate").val(),
        endDate: $("#endDate").val(),
        _csrf: $("#_csrf").val(),
      },
      success: function (data) {
        $("#toastMsg").html(data);
        toast.show();
        $("#reservationModal").modal("hide");
      },
      error: function (jqXHR) {
        $("#toastMsg").html(jqXHR.responseText);
        toast.show();
      },
    });
  } else {
    $("#calendar").attr("value", startDate + " to " + endDate);
  }
});

function newReservation() {
  const _csrf = $("#_csrf").val();
  const installationId = $("#installationId").val();
  const startDate = $("#startDate").val();
  const endDate = $("#endDate").val();
  console.log(
    "intentando reserva con datos: ",
    installationId,
    startDate,
    endDate,
    _csrf
  );
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
      // Close the modal
      $("#reservationModal").modal("hide");

    },
    error: function (jqXHR) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
}

$("#reservationModal").on("show.bs.modal", (event) => {
  $("#calendar").attr("value", "");
  $("#calendar").attr("placeholder", "Select a date");
  $("#hourBtns").empty();

  const buttonId = event.relatedTarget.id;
  console.log("el id del boton es: ", buttonId);
  $("#installationId").attr("value", buttonId);
});

$("#reservationForm").on("submit", (e) => {
  e.preventDefault();
  newReservation();
});
