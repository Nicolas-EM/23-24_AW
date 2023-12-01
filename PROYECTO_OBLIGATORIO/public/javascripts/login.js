
$("#registerBtn").on("click", () => {
    $("#regDiv").removeClass("d-none");
    $("#logDiv").addClass("d-none");
});

$("#loginBtn").on("click", () => {
    $("#logDiv").removeClass("d-none");
    $("#regDiv").addClass("d-none");
});
//ambos passwordfields se ponen en texto plano o se quitan el texto plano
$("#showPassword, #showPassword2").on("click", () => {
    let passwordInput = $("#passwordInput, #passwordInput2");
    if (passwordInput.attr("type") === "password") {
        passwordInput.attr("type", "text");
    } else {
        passwordInput.attr("type", "password");
    }
});

$("#loginForm").on("submit", (e) => {
    e.preventDefault();

    let email = $("#emailInput").val();
    let password = $("#passwordInput").val();

    $.ajax({
        url: "/login",
        method: "POST",
        data: {
            email,
            password,
        },
        success: (response) => {
            if (response.success) {
                window.location.href = "/home";
            } else {
                $("#loginError").removeClass("d-none");
            }
        },
        error: () => {
            console.log(err);
        },
    });
});
// Validacion contraseñas
const passwordInput = document.getElementById("passwordInput");
const passwordInput2 = document.getElementById("passwordInput2");
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