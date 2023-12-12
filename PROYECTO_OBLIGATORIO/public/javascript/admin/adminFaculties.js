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
  return `<tr id="fRow-${faculty.id}">
                <td scope="row">${faculty.id}</td>
                <td>${faculty.name}</td>
                <td class="text-center">
                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editFacultyModal" data-bs-facultyid="${faculty.id}" data-bs-facultyname="${faculty.name}">
                      <span class="material-symbols-outlined d-inline-block align-text-top">settings</span>
                  </button>
                </td>
            </tr>`;
}

$("#newFacultyForm").on("submit", (e) => {
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

$("#editFacultyModal").on("show.bs.modal", (e) => {
  const button = e.relatedTarget;
  // Extract info from data-bs-* attributes
  const facultyId = button.getAttribute("data-bs-facultyid");
  const facultyName = button.getAttribute("data-bs-facultyname");

  $("#editFacultyId").attr("value", facultyId);
  $("#editFacultyName").attr("value", facultyName);
});

$("#editFacultyForm").on("submit", e => {
  e.preventDefault();

  const facultyId = $("#editFacultyId").val();
  const facultyName = $("#editFacultyName").val();
  const _csrf = $("#csrfToken").val();
  
  $.ajax({
    url: "/faculties/update",
    method: "POST",
    data: {
      facultyId,
      facultyName,
      _csrf,
    },
    success: (response) => {
      const modal = $("#editFacultyModal"); // Get the modal element
      modal.modal("hide"); // Close the modal
      $("#toastMsg").html("Success: Faculty modified");
      toast.show();
      
      // Actualizar tabla
      $(`#fRow-${facultyId}`).replaceWith(createFacultyRow({id: facultyId, name: facultyName}));
    },
    error: function (xhr, status, error) {
      $("#toastMsg").html(xhr.responseText);
      toast.show();
    },
  });
})