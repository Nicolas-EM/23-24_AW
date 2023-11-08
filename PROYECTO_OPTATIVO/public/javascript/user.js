"use strict";

const sharedModal = document.getElementById("reseniaModal");
console.log(`Sharedmodal: ${sharedModal}`);
if (sharedModal) {
    sharedModal.addEventListener("show.bs.modal", e => {
        const btn = e.relatedTarget;
        const reservaId = btn.dataset.reservaId;
        paintStars(0);

        $("#reservaId").attr("value", reservaId);
    });
}


const stars = document.querySelectorAll('.star');
let rating = 0;

stars.forEach((star) => {
    star.addEventListener('click', () => {
        rating = parseInt(star.dataset.value);
        document.getElementById('rating').value = rating;
        paintStars(rating);
    });
});

stars.forEach((star) => {
    star.addEventListener('mouseover', () => {
        rating = parseInt(star.dataset.value);
        paintStars(rating);
    });
});

stars.forEach((star) => {
    star.addEventListener('mouseleave', () => {
        rating = document.getElementById('rating').value
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
