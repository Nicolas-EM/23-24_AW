"use strict";

const sharedModal = document.getElementById("reseniaModal");
const ratingInput = document.getElementById('rating');

console.log(`Sharedmodal: ${sharedModal}`);
if (sharedModal) {
    sharedModal.addEventListener("show.bs.modal", e => {
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
        if(rating)
            paintStars(rating);
        else
            paintStars(0);
    });
});

function paintStars(rating){
    stars.forEach((s) => {
        if (parseInt(s.dataset.value) <= rating) {
            s.classList.add('active');
        } else {
            s.classList.remove('active');
        }
    });
}