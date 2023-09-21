// JavaScript to toggle password visibility
document.getElementById('showPassword').addEventListener('click', function () {
    var passwordInput = document.getElementById('typePasswordX');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
});
$(document).ready(function() {
    // Prevent form submission
    $('form').on('submit', function(e) {
        var email = $('#typeEmailX').val();
        var password = $('#typePasswordX').val();
        var validEmail = email.includes('@ucm.es');
        var validPassword = password.length === 8;

        if (!validEmail || !validPassword) {
            e.preventDefault();
        }
    });

    $('#typeEmailX, #typePasswordX').on('input', function () {
        // Email validation
        var email = $('#typeEmailX').val();
        var validEmail = email.includes('@ucm.es');

        // Password validation
        var password = $('#typePasswordX').val();
        var validPassword = password.length === 8;

        // Apply styles based on validation result
        $('#typeEmailX').css('background-color', validEmail ? 'lightgreen' : 'lightcoral');
        $('#typePasswordX').css('background-color', validPassword ? 'lightgreen' : 'lightcoral');
    });
});

// // JavaScript to validate email and password when submitting the form
// var emailRegex = /^[a-zA-Z0-9._-]+@ucm\.es$/;

// $('form').on('submit', function (e) {
//     e.preventDefault(); // Prevent the form from submitting by default

//     evaluateEmail();
//     evaluatePassword();
// });

// function evaluateEmail() {
//     var emailInput = $('typeEmailX');
//     var emailValue = emailInput.val().trim();

//     if (!emailRegex.test(emailValue)) {
//         emailInput[0].setCustomValidity("Email no válido, debe usar la estructura: usuario@ucm.es");
//         emailInput.css('backgroundColor', '#f8d7da'); //light red
//     } else {
//         emailInput[0].setCustomValidity("");
//         emailInput.css('backgroundColor', '#d4edda'); //light green
//     }
// };

// function evaluatePassword() {
//     var passwordInput = $('typePasswordX');
//     var passwordValue = passwordInput.val().trim();

//     if (passwordValue.length < 8) {
//         passwordInput[0].setCustomValidity("La contraseña debe tener al menos 8 caracteres");
//         passwordInput.css('backgroundColor', '#f8d7da'); //light red
//     } else {
//         passwordInput[0].setCustomValidity("");
//         passwordInput.css('backgroundColor', '#d4edda'); //light green
//     }
// };