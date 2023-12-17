// AJAX - Image upload
$("#orgImgUpload").on("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    let fileType = file.type;

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
                $("#toastMsg").html("Success: Organization logo updated");
                toast.show();

                // Actualizar imagen perfil
                const reader = new FileReader();
                reader.onload = function (e) {
                    // get loaded data and render thumbnail.
                    $("#orgImg").attr("src", e.target.result);
                    $("#navbarLogo").attr("src", e.target.result);
                    const link = document.querySelector("link[rel~='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.head.appendChild(link);
                    }
                    link.href = e.target.result;
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

// AJAX - update org details
$("#updateOrgForm").on("submit", e => {
    e.preventDefault();

    const orgName = $("#orgName").val();
    const orgDir = $("#orgAddress").val();
    const _csrf = $("#csrfToken").val();
    
    $.ajax({
        method: "POST",
        url: "/org/update",
        data: {
            name: orgName,
            dir: orgDir,
            _csrf
        },
        success: function () {
            $("#toastMsg").html("Success: Organization details updated");
            toast.show();

            // Actualizar navbar
            $("#orgNameNavbar").html(orgName);

            // Actualizar footer
            $("#orgNameFooter").html(orgName);
            $("#orgDirFooter").html(orgDir);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        },
    });
})