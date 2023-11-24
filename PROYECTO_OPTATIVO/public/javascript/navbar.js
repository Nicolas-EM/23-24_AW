const loginModal = bootstrap.Modal.getOrCreateInstance("#loginModal");
const signupModal = bootstrap.Modal.getOrCreateInstance("#signupModal");

$("#logoutBtn")?.on("click", e => {
    $.ajax({
        method: "POST",
        url: "/api/logout",
        success: function (data) {
            $("#toastMsg").html(data);
            toast.show();
            
            // Update navbar
            $("#accountCircleBtn").attr('data-bs-toggle', "modal");
            // Update reservarBtn in /destination if exists
            $("#reservaBtn")?.attr('type', 'button');
            $("#reservaBtn")?.attr('data-bs-toggle', "modal");

            if (window.location.href.includes("/user")) {
                window.location.replace(window.location.hostname);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
});

$("#loginForm")?.on("submit", e => {
    e.preventDefault();

    $.ajax({
        method: "POST",
        url: "/api/login",
        data: {
            email: $("#email").val(),
            password: $("#password").val()
        },
        success: function (data) {
            $("#toastMsg").html(data);
            toast.show();
            loginModal?.hide();

            // Update navbar
            $("#accountCircleBtn").attr('data-bs-toggle', "dropdown");
            // Update reservarBtn in /destination if exists
            $("#reservaBtn")?.attr('type', 'submit');
            $("#reservaBtn")?.attr('data-bs-toggle', "");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
});

$("#signupForm")?.on("submit", e => {
    e.preventDefault();

    $.ajax({
        method: "POST",
        url: "/api/register",
        data: {
            name: $("#displayName").val(),
            email: $("#signupEmail").val(),
            password: $("#signupPwdInput").val()
        },
        success: function (data) {
            $("#toastMsg").html(data);
            toast.show();
            signupModal?.hide();

            // Update navbar
            $("#accountCircleBtn").attr('data-bs-toggle', "dropdown");
            // Update reservarBtn in /destination if exists
            $("#reservaBtn")?.attr('data-bs-toggle', "");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
});
