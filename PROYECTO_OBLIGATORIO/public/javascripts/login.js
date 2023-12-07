
$("#registerBtn").on("click", () => {
    $("#regDiv").removeClass("d-none");
    $("#logDiv").addClass("d-none");
});

$("#loginBtn").on("click", () => {
    $("#logDiv").removeClass("d-none");
    $("#regDiv").addClass("d-none");
});

//ambos passwordfields se ponen en texto plano o se quitan el texto plano
$(".show-password-btn").on("click", e => {
    const passwordInput = $(e.target).closest('.input-group').find('.password-input');

    if (passwordInput.attr("type") === "password") {
        passwordInput.attr("type", "text");
    } else {
        passwordInput.attr("type", "password");
    }
});

$("#loginForm").on("submit", (e) => {
    e.preventDefault();

    const email = $("#emailInput").val();
    const password = $("#passwordInput").val();
    const _csrf = $("#loginCSRF").val();

    $.ajax({
        url: "/users/login",
        method: "POST",
        data: {
            email,
            password,
            _csrf
        },
        success: (response) => {
            console.log(response);
            window.location.href = "/";
        },
        error: function(xhr, status, error) {
            // TODO: show proper error message
            // $("#toastMsg").html(xhr.responseText);
            // toast.show();
            console.error(xhr.responseText);
        }
    });
});

// Validacion contraseñas
const passwordInput = document.getElementById("registrationPassword");
const passwordInput2 = document.getElementById("registrationPasswordConfirm");
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;

    if(!passwordIsValid(password)){
        passwordInput.style.backgroundColor = '#f08080';
        passwordInput.setCustomValidity('Tu contraseña debe tener mínimo 7 y máximo 50 caracteres, una letra y un número');
    } else {
        passwordInput.setCustomValidity("");
        passwordInput.style.backgroundColor = '#fff';
    }
});
passwordInput2.addEventListener('input', () => {
    const password = passwordInput2.value;

    if(!passwordIsValid(password)){
        passwordInput2.style.backgroundColor = '#f08080';
        passwordInput2.setCustomValidity('Tu contraseña debe tener mínimo 7 y máximo 50 caracteres, una letra y un número');
    } else {
        passwordInput2.setCustomValidity("");
        passwordInput2.style.backgroundColor = '#fff';
    }
});
function passwordIsValid(password){
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,50}$/;
    return passwordRegex.test(password);
}

$("#pictureInput").on("change", function() {
    if (this.files && this.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
            $('#accountImg').attr('src', e.target.result);
            $('#accountImg').css({
                'filter': 'none', // Remove the filter
                'width': 'auto', // Set width to auto
                'max-height': '230px' // Set max-height to 230px
            });
        }
        
        reader.readAsDataURL(this.files[0]); // convert to base64 string
    }
});