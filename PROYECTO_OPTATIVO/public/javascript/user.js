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
if (cancelReservationModal) {
  cancelReservationModal.addEventListener("show.bs.modal", (e) => {
    const btn = e.relatedTarget;
    const reservaId = btn.getAttribute("data-bs-reservaid");

    // Custom code for cancel modal
    const cancelModalReservaId = document.getElementById("reservaId");
    cancelModalReservaId.value = reservaId;
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
  const action = button.getAttribute("data-bs-action");
  const destinationId = button.getAttribute("data-bs-destinationid");

  $.ajax({
    method: "GET",
    url: `/destinations/${destinationId}`,
    data: { reservaId },
    success: function (data) {
      const regex = /data-precio="([^"]*)"/;
      const match = regex.exec(data);
      $("#precioTotal").data("precio", data);
      if (match && match.length > 1) {
        $("#precioTotal").data("precio", match[1]);
      } else {
        console.error('data-precio attribute not found or no value present');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("No se pudo encontrar precio total");
    },
  });

  if(action === "delete"){
    $("#confirmAction").val("delete");
    $("#deleteConfirm").removeClass("d-none");
    $("#modifyConfirm").addClass("d-none");
  } else {
    $("#confirmAction").val("modify");
    $("#modifyConfirm").removeClass("d-none");
    $("#deleteConfirm").addClass("d-none");
  }

  // Update the modal's content.
  $("#confirmReservaId").attr("value", reservaId);
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

const confirmationModal = bootstrap.Modal.getOrCreateInstance("#confirmationModal");
//console.log($("#confirmationModalForm"));
$("#confirmationModalForm")?.on("submit", (e) => {
  e.preventDefault();

  
  const reservaId = $("#confirmReservaId").val();
  const action = $("#confirmAction").val();
  console.log(action);
  $.ajax({
    method: "POST",
    url: `/reservas/${action}`,
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

$("#cancelReservationForm").on("submit", function(e) {

  e.preventDefault();

  const cancelModalReservaId = document.getElementById("reservaId");
  const reservaId = cancelModalReservaId.value;
console.log(reservaId);
  $.ajax({
    method: "POST",
    url: `/reservas/delete`,
    data: { reservaId },
    success: function(data) {
      $("#toastMsg").html(data);
      toast.show();
      confirmationModal?.hide();
      $(`#reserva${reservaId}`).remove();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    }
  });
});

$("#modifyReserveForm").on("submit", (e) => {
  e.preventDefault();
  console.log("aqui");
  const numberInput = $("#numberInput").val();
  const startDate = $("#startDate").val();
  const endDate = $("#endDate").val();
  const id = $("#id").val();
  console.log(numberInput, startDate, endDate, id);
  $.ajax({
    method: "POST",
    url: "/reservas/update",
    data: {
      id,
      numberInput,
      startDate,
      endDate,
    },
    success: function (data) {
      $("#toastMsg").html(data);
      toast.show();
      confirmationModal?.hide();
      // Perform any additional actions after successful update
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#toastMsg").html(jqXHR.responseText);
      toast.show();
    },
  });
});
