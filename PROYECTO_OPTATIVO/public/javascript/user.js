"use strict";

const reviewModal = document.getElementById("reseniaModal");
const ratingInput = document.getElementById('rating');

if (reviewModal) {
    reviewModal.addEventListener("show.bs.modal", e => {
        const btn = e.relatedTarget;
        const reservaId = btn.dataset.reservaId;
        ratingInput.value = "5";
        paintStars(5);

        $("#reservaId").attr("value", reservaId);
    });
}

const stars = document.querySelectorAll('.star');
let rating = 0;

stars.forEach((star) => {
    star.addEventListener('click', () => {
        rating = parseInt(star.dataset.value);
        ratingInput.value = rating;
        paintStars(rating);
    });

    star.addEventListener('mouseover', () => {
        rating = parseInt(star.dataset.value);
        paintStars(rating);
    });

    star.addEventListener('mouseleave', () => {
        rating = ratingInput.value
        if (rating)
            paintStars(rating);
        else
            paintStars(0);
    });
});

function paintStars(rating) {
    stars.forEach((s) => {
        if (parseInt(s.dataset.value) <= rating) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}

$("#confirmationModal")?.on('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const reservaId = button.getAttribute('data-bs-reservaid')

    // Update the modal's content.
    $('#cancelReservaId').attr('value', reservaId);
});

const confirmationModal = bootstrap.Modal.getOrCreateInstance("#confirmationModal");
$("#confirmationModal")?.on("submit", e => {
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
        }
    });
})

const passwordInput = document.getElementById("newPassword");
const passwordConfirmInput = document.getElementById("newPasswordConfirm");

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;

    if (!passwordIsValid(password)) {
        passwordInput.style.backgroundColor = '#f08080';
        passwordInput.setCustomValidity('Tu contraseña debe tener mínimo 7 y máximo 50 caracteres, una letra y un número');
    } else {
        passwordInput.setCustomValidity("");
        passwordInput.style.backgroundColor = 'inherit';
        checkPasswordsMatch();
    }
});

function passwordIsValid(password) {
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,50}$/;
    return passwordRegex.test(password);
}

passwordConfirmInput.addEventListener('input', () => {
    checkPasswordsMatch();
});

function checkPasswordsMatch() {
    if (passwordInput.value !== passwordConfirmInput.value) {
        passwordConfirmInput.style.backgroundColor = '#f08080';
        passwordConfirmInput.setCustomValidity('Tus contraseñas no coinciden');
    } else {
        passwordConfirmInput.setCustomValidity("");
        passwordConfirmInput.style.backgroundColor = 'inherit';
    }
}