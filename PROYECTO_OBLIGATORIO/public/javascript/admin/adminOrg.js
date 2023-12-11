$("#updateOrgForm").on("submit", e => {
    e.preventDefault();


    const _csrf = $("#csrfToken").val();

    $.ajax({
        url: "/org/update",
        method: "POST",
        data: {
            facultyName,
            _csrf,
        },
        success: (response) => {
            $("#toastMsg").html("Success: Organization details updated");
            toast.show();
        },
        error: function (xhr, status, error) {
            $("#toastMsg").html(xhr.responseText);
            toast.show();
        },
    });
});

$("#orgImgUpload").on("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    let fileType = file.type;
    
    console.log($("#csrfToken").val());

    if (fileType.startsWith("image/")) {
        const formData = new FormData();
        formData.append("_csrf", $("#csrfToken").val());
        formData.append("avatar", file);

        $.ajax({
            method: "POST",
            url: "/org/picture",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                "X-CSRF-TOKEN": $("#csrfToken").val(),
            },
            success: function () {
                $("#toastMsg").html("Sucess: Organization logo updated");
                toast.show();

                // Actualizar imagen perfil
                const reader = new FileReader();
                reader.onload = function (e) {
                    // get loaded data and render thumbnail.
                    $("#orgImg").attr("src", e.target.result);
                };
                // read the image file as a data URL.
                reader.readAsDataURL(file);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#toastMsg").html(jqXHR.responseText);
                toast.show();
            },
        });
    }
});