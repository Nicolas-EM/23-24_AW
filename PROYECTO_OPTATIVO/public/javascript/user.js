"use strict";

// LLamada AJAX para actualizar imagen perfil
$("#imageUpload").on("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  let fileType = file.type;

  if (fileType.startsWith("image/")) {
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("_csrf", $("#csrfToken").val());

    $.ajax({
      method: "POST",
      url: "/users/upload-picture",
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        $("#toastMsg").html(data);
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
      if (data.message === 'Exito: Usuario actualizado') {
        $("#toastMsg").html(data.message);
        toast.show();
        // Update user info on the page
        $("#nombreUsuarioField").html(data.newUsername);
        $("#nombreInput").html(data.newUsername);
        $("#emailInput").html(data.newEmail);
      } else {
        $("#toastMsg").html(data.message);
        toast.show();
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
});

// Actualizar datos de modal compartido
const reviewModal = document.getElementById("reseniaModal");
reviewModal?.addEventListener("show.bs.modal", (e) => {
  const btn = e.relatedTarget;
  const reservaId = btn.dataset.reservaId;
  ratingInput.value = "5";
  paintStars(5);

  $("#reservaId").attr("value", reservaId);
});

// Llamada AJAX para crear comentario
const commentModal = bootstrap.Modal.getOrCreateInstance("#reseniaModal");
$("#commentForm")?.on("submit", (e) => {
  e.preventDefault();

  const reservaId = $("#reservaId").val();
  const rating = $("#rating").val();
  const comment = $("#comment").val();

  $.ajax({
    method: "POST",
    url: "/reservas/review",
    data: {
      _csrf: $("#csrfToken").val(),
      reservaId,
      rating,
      comment,
    },
    success: function (data) {
      $("#toastMsg").html(data);
      toast.show();
      commentModal?.hide();
      $(`#addComment${reservaId}`).remove();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
});

// Gestion estrellas
const ratingInput = document.getElementById("rating");
const stars = document.querySelectorAll(".star");
let rating = 0;

// Event listeners de estrellas
stars.forEach((star) => {
  star.addEventListener("click", () => {
    rating = parseInt(star.dataset.value);
    ratingInput.value = rating;
    paintStars(rating);
  });

  star.addEventListener("mouseover", () => {
    rating = parseInt(star.dataset.value);
    paintStars(rating);
  });

  star.addEventListener("mouseleave", () => {
    rating = ratingInput.value;
    if (rating) paintStars(rating);
    else paintStars(0);
  });
});

// Pintar estrellas doradas o gris
function paintStars(rating) {
  stars.forEach((s) => {
    if (parseInt(s.dataset.value) <= rating) {
      s.classList.add("active");
    } else {
      s.classList.remove("active");
    }
  });
}


// Actualizar datos de modal compartido
const cancelModal = bootstrap.Modal.getOrCreateInstance("#cancelReservationModal");
$("#cancelReservationModal").on("show.bs.modal", (e) => {
  const btn = e.relatedTarget;
  const reservaId = btn.getAttribute("data-bs-reservaid");

  // Custom code for cancel modal
  $("#cancelReservaId").attr("value", reservaId);
});

// Llamada AJAX para cancelar reserva
$("#cancelReservationForm").on("submit", function (e) {
  e.preventDefault();

  const reservaId = $("#cancelReservaId").attr("value");
  $.ajax({
    method: "POST",
    url: `/reservas/delete`,
    data: { _csrf: $("#csrfToken").val(), reservaId },
    success: function (data) {
      $("#toastMsg").html(data);
      toast.show();
      cancelModal?.hide();
      $(`#reserva${reservaId}`).remove();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    }
  });
});

// Actualizar datos de modal compartido
$("#modifyReservationModal").on("show.bs.modal", (e) => {
  const btn = e.relatedTarget;
  const destinationId = btn.getAttribute("data-bs-destinationid");
  const reservaId = btn.getAttribute("data-bs-reservaid");

  $("#modifyReservaId").attr("value", reservaId);

  $.ajax({
    method: "GET",
    url: `/destinations/${destinationId}`,
    data: { _csrf: $("#csrfToken").val(), destinationId },
    success: function (data) {
      const regex = /data-precio="([^"]*)"/;
      const match = regex.exec(data);
      if (match && match.length > 1) {
        $("#precioTotal").attr("data-precio", match[1]);
      } else {
        console.error('data-precio attribute not found or no value present');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("No se pudo encontrar precio total");
    },
  });
});

// Llamada AJAX para modificar reserva
const modifyModal = bootstrap.Modal.getOrCreateInstance("#modifyReservationModal");
$("#modifyReservationForm").on("submit", (e) => {
  e.preventDefault();

  const numPersonas = $("#numPersonas").val();
  const startDate = $("#startDate").val();
  const endDate = $("#endDate").val();
  const reservaId = $("#modifyReservaId").val();
  
  $.ajax({
    method: "POST",
    url: "/reservas/update",
    data: {
      _csrf: $("#csrfToken").val(),
      reservaId,
      numPersonas,
      startDate,
      endDate,
    },
    success: function (data) {
      $("#toastMsg").html(data);
      toast.show();
      modifyModal?.hide();
      $(`#startDate${reservaId}`).text(new Date(startDate).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit' }));
      $(`#endDate${reservaId}`).text(new Date(endDate).toLocaleDateString('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit' }));
    },
    error: function (jqXHR, textStatus, errorThrown) {
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
