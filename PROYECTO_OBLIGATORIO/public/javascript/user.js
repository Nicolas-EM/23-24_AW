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

  const name = $("#nombreInput").val();
  const surname = $("#surnameInput").val();
  const email = $("#emailInput").val();
  const password = $("#newPassword").val();
  
  $.ajax({
    method: "POST",
    url: "/users/update",
    data: {
      _csrf: $("#csrfToken").val(),
      name,
      surname,
      email,
      password
    },
    success: function (data) {
      $("#toastMsg").html("Success: User updated");
      toast.show();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
});

// Update hidden fields on show
$("#cancelModal").on("show.bs.modal", e => {

  const button = e.relatedTarget

  // Extract info from data-bs-* attributes
  const reservaId = button.getAttribute('data-bs-reservaid');
  const type = button.getAttribute('data-bs-reservaid');

  $("#cancelReservaId").attr("value", reservaId);
  $("#cancelReservaType").attr("value", type);
});

// AJAX - cancel reserva
$("#cancelReservaForm").on("submit", e => {
  e.preventDefault();

  const reservaid= $("#cancelReservaId").val();
  const type = $("#cancelReservaType").val();

  $.ajax({
    method: "POST",
    url: "/reservations/delete",
    data: {
      _csrf: $("#_csrf").val(),
      reservaid,
      type
    },
    success: function (data) {
      $("#toastMsg").html(data);
      toast.show();
      // Close the modal
      $('#cancelModal').modal('hide');
      // Remove the reservation from the DOM

      $(`#${reservaid}`).closest('.col').remove();
    },
    error: function (jqXHR) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
});

// Validacion contraseña en modificar usuario
const passwordInput = document.getElementById("newPassword");
const passwordConfirmInput = document.getElementById("newPasswordConfirm");

passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  if (!passwordIsValid(password)) {
    passwordInput.style.backgroundColor = "#f08080";
    passwordInput.setCustomValidity(
      "Tu contraseña debe tener mínimo 7 y máximo 50 caracteres, una letra y un número"
    );
  } else {
    passwordInput.setCustomValidity("");
    passwordInput.style.backgroundColor = "inherit";
    checkPasswordsMatch();
  }
});

function passwordIsValid(password) {
  let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,50}$/;
  return passwordRegex.test(password);
}

passwordConfirmInput.addEventListener("input", () => {
  checkPasswordsMatch();
});

function checkPasswordsMatch() {
  if (passwordInput.value !== passwordConfirmInput.value) {
    passwordConfirmInput.style.backgroundColor = "#f08080";
    passwordConfirmInput.setCustomValidity("Tus contraseñas no coinciden");
  } else {
    passwordConfirmInput.setCustomValidity("");
    passwordConfirmInput.style.backgroundColor = "inherit";
  }
}

// Reservation filters
$("#reservationTypeFilter").on("change", e => {
  const newVal = $("#reservationTypeFilter").val();

  if(newVal){
      // Show new value cols
    $(`#reservationsCards .col.${newVal}`).removeClass("d-none");

    // hide others
    $(`#reservationsCards .col:not(.${newVal})`).addClass("d-none");
  } else {
    $(`#reservationsCards .col`).removeClass("d-none");
  }
});