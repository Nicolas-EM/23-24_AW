$("#loginForm").on("submit", e => {
    e.preventDefault();

    console.log("submitted");

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