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

$("#confirmationModal")?.on("show.bs.modal", (event) => {
  // Button that triggered the modal
  const button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  const reservaId = button.getAttribute("data-bs-reservaid");

  // Update the modal's content.
  $("#cancelReservaId").attr("value", reservaId);
});

$("#imageUpload").on("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  let fileType = file.type;
  
  if (fileType.startsWith("image/")) {
    const formData = new FormData();
    formData.append("avatar", file);

    $.ajax({
      method: "POST",
      url: "/api/user/upload-picture",
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

// $("#imageUpload").on("change", e => {
//   console.log("change detected");

//   const reader = new FileReader();
//   reader.onload = e => {
//       // get loaded data and render thumbnail.
//       document.getElementById("img-profile").src = e.target.result;
//       document.getElementById("nav-profile").src = e.target.result;
//   };
//   // read the image file as a data URL.
//   reader.readAsDataURL(this.files[0]);
// });

const confirmationModal =
  bootstrap.Modal.getOrCreateInstance("#confirmationModal");
$("#confirmationModal")?.on("submit", (e) => {
  e.preventDefault();
  const reservaId = $("#cancelReservaId").val();
  $.ajax({
    method: "POST",
    url: "/api/cancelar",
    data: { reservaId },
    success: function (data) {
      $("#toastMsg").html(data);
      toast.show();
      confirmationModal?.hide();
      $(`#reserva${reservaId}`).remove();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
});

const commentModal = bootstrap.Modal.getOrCreateInstance("#reseniaModal");
$("#commentForm")?.on("submit", (e) => {
  e.preventDefault();

  const reservaId = $("#reservaId").val();
  const rating = $("#rating").val();
  const comment = $("#comment").val();

  $.ajax({
    method: "POST",
    url: "/api/review",
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
    url: "/api/updateUser",
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