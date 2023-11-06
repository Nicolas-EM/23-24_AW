"use strict"

const loginModal = document.getElementById("loginModal");
if (loginModal) {
    loginModal.addEventListener("show.bs.modal", e => {
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    });
}

const signupModal = document.getElementById("signupModal");
if (signupModal) {
    signupModal.addEventListener("show.bs.modal", e => {
        document.getElementById("displayName").value = "";
        document.getElementById("signupEmail").value = "";
        document.getElementById("signupPwdInput").value = "";
        document.getElementById("signupPwdConfirm").value = "";
        passwordInput.style.backgroundColor = 'inherit';
        passwordConfirmInput.style.backgroundColor = 'inherit';
    });
}

const nombreInput = document.getElementById("displayName");
const passwordInput = document.getElementById("signupPwdInput");
const passwordConfirmInput = document.getElementById("signupPwdConfirm");

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,50}$/;

    if(!passwordIsValid(password)){
        passwordInput.style.backgroundColor = '#f08080';
        passwordInput.setCustomValidity('Tu contraseña debe tener al menos 7 caracteres, una letra y un número');
    } else {
        passwordInput.setCustomValidity("");
        passwordInput.style.backgroundColor = 'inherit';
    }
});


function passwordIsValid(password){
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,50}$/;
    return passwordRegex.test(password);
}

passwordConfirmInput.addEventListener('input', () => {
    if(!passwordsMatch()){
        passwordConfirmInput.style.backgroundColor = '#f08080';
        passwordConfirmInput.setCustomValidity('Tus contraseñas no coinciden');
    } else {
        passwordConfirmInput.setCustomValidity("");
        passwordConfirmInput.style.backgroundColor = 'inherit';
    }
});

function passwordsMatch(){
    return passwordInput.value === passwordConfirmInput.value;
}