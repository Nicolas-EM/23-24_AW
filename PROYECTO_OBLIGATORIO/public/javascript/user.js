"use strict";

// LLamada AJAX para actualizar imagen perfil
$("#imageUpload").on("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  let fileType = file.type;

  if (fileType.startsWith("image/")) {
    const formData = new FormData();
    formData.append("_csrf", $("#csrfToken").val());
    formData.append("avatar", file);

    $.ajax({
      method: "POST",
      url: "/users/image",
      data: formData,
      processData: false,
      contentType: false,
      headers: {
        "X-CSRF-TOKEN": $("#csrfToken").val(),
      },
      success: function () {
        $("#toastMsg").html("Exito: Foto de perfil actualizada");
        toast.show();

        // Actualizar imagen perfil
        const reader = new FileReader();
        reader.onload = function (e) {
          // get loaded data and render thumbnail.
          $("#userImg").attr("src", e.target.result);
        };
        // read the image file as a data URL.
        reader.readAsDataURL(file);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#toastMsg").html(jqXHR.responseText);
        toast.show();
      },
    });
  }
});

// Llamada AJAX para actualizar datos usuario
$("#updateUserForm").on("submit", (e) => {
  e.preventDefault();

  const nombre = $("#nombreInput").val();
  const correo = $("#emailInput").val();
  const currentPassword = $("#currentPasswordInput").val();
  const newPassword = $("#newPassword").val();
  const newPasswordConfirm = $("#newPasswordConfirm").val();
  const userId = $("#userId").val();
  
  $.ajax({
    method: "POST",
    url: "/users/update",
    data: {
      _csrf: $("#csrfToken").val(),
      nombre,
      correo,
      currentPassword,
      newPassword,
      newPasswordConfirm,
      userId
    },
    success: function (data) {
      $("#toastMsg").html("Exito: Usuario actualizado");
        toast.show();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
});

$("#cancelModal").on("show.bs.modal", e => {

  const button = e.relatedTarget

  // Extract info from data-bs-* attributes
  const reservaId = button.getAttribute('data-bs-reservaid');

  $("#cancelReservaId").attr("value", reservaId);
});

$("#cancelReservaForm").on("submit", e => {
  e.preventDefault();

  const reservaid= $("#cancelReservaId").val();

  $.ajax({
    method: "POST",
    url: "/reservations/delete",
    data: {
      _csrf: $("#_csrf").val(),
      reservaid: reservaid
    },
    success: function (data) {
      $("#toastMsg").html(data);
      toast.show();
      // Close the modal
      $('#cancelModal').modal('hide');
      // Remove the reservation from the DOM

      $(`#${reservaid}`).remove();
    },
    error: function (jqXHR) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
})