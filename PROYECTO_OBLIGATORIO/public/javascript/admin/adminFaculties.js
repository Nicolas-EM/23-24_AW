"use strict";

// Load installations to manage
function getFaculties() {
  // Make an AJAX request to the server
  $.ajax({
    method: "GET",
    url: "/faculties/",
    success: function (data) {
      let faculties = "";
      for (let x in data) {
        const faculty = data[x];
        faculties += createFacultyRow(faculty);
      }

      $("#facultiesTableRow").html(faculties);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
}

function createFacultyRow(faculty) {
  return `<tr>
                <td scope="row">${faculty.id}</td>
                <td>${faculty.name}</td>
            </tr>`;
}

$("#newFacultyForm").on("submit", e => {
  e.preventDefault();
  newFaculty();
});

function newFaculty() {
    const facultyName = $("#facultyNameInput").val();
    const _csrf = $("#csrfToken").val();
    $.ajax({
        url: "/faculties/create",
        method: "POST",
        data: {
            facultyName,
            _csrf,
        },
        success: (response) => {
            const modal = $("#newFacultyModal"); // Get the modal element
            modal.modal("hide"); // Close the modal
            $("#toastMsg").html("Facultad creada correctamente");
            toast.show();
            $("#facultiesTableRow").empty();
            getFaculties();
        },
        error: function (xhr, status, error) {
            $("#toastMsg").html(xhr.responseText);
            toast.show();
        },
    });
}
