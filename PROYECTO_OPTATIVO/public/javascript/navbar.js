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
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
});