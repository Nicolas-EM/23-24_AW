const loginModal = bootstrap.Modal.getOrCreateInstance($("#loginModal")[0], { backdrop: true });
const signupModal = bootstrap.Modal.getOrCreateInstance($("#signupModal")[0], { backdrop: true });

$("#logoutBtn")?.on("click", e => {
    console.log("clicked");

    $.ajax({
        method: "POST",
        url: "/api/logout",
        success: function (data) {
            $("#toastMsg").html(data);
            toast.show();
            if (window.location.href.includes("/user")) {
                window.location.replace(window.location.hostname);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
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
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if(jqXHR.status === 401){
                $("#toastMsg").html("Credenciales incorrectas.");
                toast.show();
            } else {
                $("#toastMsg").html(textStatus);
                toast.show();
            }
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
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
});
