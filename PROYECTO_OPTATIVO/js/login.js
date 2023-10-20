import { checkUserExists,registerUser } from "../../PROYECTO_OBLIGATORIO/DAOUsers";
const _SIGN_IN = true;

// JavaScript to toggle password visibility
$('#showPassword').on('click', function () {
    console.log("clicked");
    const pwdInput = $('#passwordInput').get(0);
    if (pwdInput.type === 'password') {
        $(this).html("Esconder");
        pwdInput.type = 'text';
    } else {
        $(this).html("Mostrar");
        pwdInput.type = 'password';
    }
});

//switch login/register form page in html
$("a").on("click", function () {
    if(_SIGN_IN){
        $(".signin").addClass("d-none");
        $(".register").removeClass("d-none");
    } else {
        $(".signin").removeClass("d-none");
        $(".register").addClass("d-none");
    }
});

function isEmailValid() {
    const emailRegex = new RegExp('^[\\w-\\.]+@ucm\\.es$')
    const emailInput = $('#emailInput');
    let valid = emailRegex.test(emailInput.val());

    // Apply styles based on validation result
    if (valid) {
        emailInput.css('background-color', 'lightgreen');
        emailInput.get(0).setCustomValidity('');
    } else {
        emailInput.css('background-color', 'lightcoral');
        emailInput.get(0).setCustomValidity("Introduce un correo @ucm.es");
    }

    return valid;
}

//password validator
function isPasswordValid() {
    let pwdInput = $('#passwordInput');
    let isValid = pwdInput.val().length >= 8;
   
    // Apply styles based on validation result
    if (isValid) {
        pwdInput.css('background-color', 'lightgreen');
        pwdInput.get(0).setCustomValidity('');
    } else {
        pwdInput.css('background-color', 'lightcoral');
        pwdInput.get(0).setCustomValidity("La contraseña debe tener al menos 8 caracteres");
    }

    return isValid;
}

function isNameValid(){
    let nameInput = $('#nameInput');
    let isValid = nameInput !== null ? nameInput.val().length > 0 : true;

    // Apply styles based on validation result
    if (isValid) {
        nameInput.css('background-color', 'var(--customWhite)');
        nameInput.get(0).setCustomValidity('');
    } else {
        nameInput.css('background-color', 'lightcoral');
        nameInput.get(0).setCustomValidity("Introduce tu nombre");
    }

    return isValid;
}

// Prevent form submission
$('#registerButton').on('click', function (e) {
    if (!isNameValid() || !isEmailValid() || !isPasswordValid()) {
        e.preventDefault();
    }
    else {
        let emailInput = $('#emailInput').val();
        let pwdInput = $('#passwordInput').val();
        let nameInput = $('#nameInput').val();
        if (checkUserExists(emailInput)) {
            $('#alert').html('El correo ya está registrado').removeClass('d-none');
        } else {
           registerUser(nameInput,emailInput,pwdInput);
           $('#alert').html('Usuario registrado con exito').removeClass('d-none');
        }
    }
});

// Name validation
$('#nameInput').on("input", function () {
    isNameValid();
});

// Email validation
$('#emailInput').on("input", function () {
    isEmailValid();
});

// Password validation
$('#passwordInput').on("input", function () {
    isPasswordValid();
});
