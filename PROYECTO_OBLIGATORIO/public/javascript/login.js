const passwordInput = document.getElementById("registrationPassword");
const passwordInput2 = document.getElementById("registrationPasswordConfirm");

// START: Swap behaviour controlls

$("#registerBtn").on("click", () => {
    clearSignIn();
    $('#accountImg').attr('src', "/images/person-circle.svg");
    $("#regDiv").removeClass("d-none");
    $("#logDiv").addClass("d-none");
});

$("#loginBtn").on("click", () => {
    clearRegistration();
    $("#logDiv").removeClass("d-none");
    $("#regDiv").addClass("d-none");
});

function clearRegistration() {
    // Clear registration form inputs
    $("#nameInput").val("");
    $("#surnameInput").val("");
    $("#facultyInput").val("");
    $("#gradeInput").val("");
    $("#groupInput").val("");
    $("#emailInput2").val("");
    $("#pictureInput").val("");
    $("#registrationPassword").val("");
    $("#registrationPasswordConfirm").val("");

    passwordInput2.style.backgroundColor = '#fff';
    passwordInput.style.backgroundColor = '#fff';
}

function clearSignIn() {
    // Clear login form inputs
    $("#emailInput").val("");
    $("#passwordInput").val("");
}
// END: Swap behaviour controlls

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
            window.location.href = "/";
        },
        error: function (xhr, status, error) {
            $("#toastMsg").html(xhr.responseText);
            toast.show();
        }
    });
});

$("#registerForm").on("submit", (e) => {
    e.preventDefault();
    const name = $("#nameInput").val();
    const surname = $("#surnameInput").val();
    const faculty = $("#facultyInput").val();
    const grade = $("#gradeInput").val();
    const group = $("#groupInput").val();
    const email = $("#emailInput2").val();

    if(!email.endsWith('@ucm.es')){
        $("#emailInput2")[0].setCustomValidity("Only @ucm.es allowed");
        $("#registerForm")[0].reportValidity();
        $("#emailInput2")[0].setCustomValidity("");
        return;
    }

    const password = $("#registrationPassword").val();
    const passwordConfirm = $("#registrationPasswordConfirm").val();
    const _csrf = $("#_csrf").val();

    // Get the uploaded file
    const file = $("#pictureInput")[0].files[0];

    // Create a new FormData object
    const formData = new FormData();

    // Append the form data
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("faculty", faculty);
    formData.append("grade", grade);
    formData.append("group", group);
    formData.append("email", email);

    formData.append("password", password);
    formData.append("passwordConfirm", passwordConfirm);

    if (file) {
        formData.append("picture", file);
    }

    $.ajax({
        url: "/users/create",
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            "X-CSRF-Token": _csrf // Include the CSRF token in the request headers
        },
        success: (response) => {
            window.location.href = "/";
        },
        error: function (xhr, status, error) {
            $("#toastMsg").html(xhr.responseText);
            toast.show();
        }
    });
});

// Validacion contraseñas
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;

    if (!passwordIsValid(password)) {
        passwordInput.style.backgroundColor = '#f08080';
        passwordInput.setCustomValidity('Tu contraseña debe tener mínimo 7 y máximo 50 caracteres, una letra y un número');
    } else {
        passwordInput.setCustomValidity("");
        passwordInput.style.backgroundColor = '#fff';
    }
});
passwordInput2.addEventListener('input', () => {
    const password = passwordInput2.value;

    if (!passwordIsValid(password) || (passwordInput.value != "" && passwordInput.value !== password)) {
        passwordInput2.style.backgroundColor = '#f08080';
        passwordInput2.setCustomValidity('Tu contraseña debe tener mínimo 7 y máximo 50 caracteres, una letra y un número');
    } else {
        passwordInput2.setCustomValidity("");
        passwordInput2.style.backgroundColor = '#fff';
    }
});
function passwordIsValid(password) {
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,50}$/;
    return passwordRegex.test(password);
}

// Picture input control
$("#pictureInput").on("change", function () {
    if (this.files && this.files[0]) {
        const file = this.files[0];
        const fileType = file.type;

        if (fileType.startsWith("image/")) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#accountImg').attr('src', e.target.result);
            }

            reader.readAsDataURL(file); // convert to base64 string
        }
    }
});