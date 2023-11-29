"use strict";

const reviewModal = document.getElementById("reseniaModal");
const ratingInput = document.getElementById("rating");

if (reviewModal) {
  reviewModal.addEventListener("show.bs.modal", (e) => {
    const btn = e.relatedTarget;
    const reservaId = btn.dataset.reservaId;
    ratingInput.value = "5";
    paintStars(5);

    $("#reservaId").attr("value", reservaId);
  });
}

const stars = document.querySelectorAll(".star");
let rating = 0;

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

function paintStars(rating) {
  stars.forEach((s) => {
    if (parseInt(s.dataset.value) <= rating) {
      s.classList.add("active");
    } else {
      s.classList.remove("active");
    }
  });
}

$("#imageUpload").on("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  let fileType = file.type;

  if (fileType.startsWith("image/")) {
    const formData = new FormData();
    formData.append("avatar", file);

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

$("#updateUserForm").on("submit", (e) => {
  e.preventDefault();

  const nombre = $("#nombreInput").val();
  const correo = $("#emailInput").val();
  const currentPassword = $("#currentPasswordInput").val();
  const newPassword = $("#newPassword").val();
  const newPasswordConfirm = $("#newPasswordConfirm").val();
  const userId = $("#userId").val();
  console.log(nombre, correo, currentPassword, newPassword, newPasswordConfirm, userId);
  $.ajax({
    method: "POST",
    url: "/users/update",
    data: {
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

const cancelModal = bootstrap.Modal.getOrCreateInstance("#cancelReservationModal");
$("#cancelReservationModal").on("show.bs.modal", (e) => {
  const btn = e.relatedTarget;
  const reservaId = btn.getAttribute("data-bs-reservaid");

  // Custom code for cancel modal
  $("#cancelReservaId").attr("value", reservaId);
});

$("#cancelReservationForm").on("submit", function (e) {
  e.preventDefault();

  const reservaId = $("#cancelReservaId").attr("value");
  $.ajax({
    method: "POST",
    url: `/reservas/delete`,
    data: { reservaId },
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

$("#modifyReservationModal").on("show.bs.modal", (e) => {
  const btn = e.relatedTarget;
  const destinationId = btn.getAttribute("data-bs-destinationid");
  const reservaId = btn.getAttribute("data-bs-reservaid");

  $("#modifyReservaId").attr("value", reservaId);

  $.ajax({
    method: "GET",
    url: `/destinations/${destinationId}`,
    data: { destinationId },
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
