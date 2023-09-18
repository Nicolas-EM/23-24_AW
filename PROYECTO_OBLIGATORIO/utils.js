// JavaScript to toggle password visibility
document.getElementById('showPassword').addEventListener('click', function () {
    var passwordInput = document.getElementById('typePasswordX');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
});

// JavaScript to validate email and password when submitting the form
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting by default

    // Get the email and password input fields
    var emailInput = document.getElementById('typeEmailX');
    var passwordInput = document.getElementById('typePasswordX');

    // Get the values of the email and password fields
    var emailValue = emailInput.value.trim(); // Trim removes leading/trailing white spaces
    var passwordValue = passwordInput.value.trim();

    // Regular expression to match valid email addresses ending with "@ucm.es"
    var emailRegex = /^[a-zA-Z0-9._-]+@ucm\.es$/;

    // Check if the email is valid and password is at least 8 characters long
    const emailIn =  document.getElementById('typeEmailX');
    if (!emailRegex.test(emailValue)) {
        emailIn.setCustomValidity("Email no válido, debe usar la estructura: usuario@ucm.es");
    } else {
        emailIn.setCustomValidity("");
    }
const pwIn = document.getElementById('typePasswordX');
    if (pwIn.length < 8) {
       pwIn.setCustomValidity("La contraseña debe tener al menos 8 caracteres");
    } else {
        pwIn.setCustomValidity("");
    }
});

