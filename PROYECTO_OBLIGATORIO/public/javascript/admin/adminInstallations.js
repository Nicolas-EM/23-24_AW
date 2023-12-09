"use strict"

// Load installations to manage
function getInstallations() {
    // Make an AJAX request to the server
    $.ajax({
        method: "GET",
        url: "/installations/",
        success: function (data) {
            let installations = "";
            for (let x in data) {
                const inst = data[x];
                installations += createInstallationRow(inst);
            }

            $("#installationTableRow").html(installations);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
}

function createInstallationRow(installation) {
    return `<tr>
                <td scope="row">${installation.name}</td>
                <td>${installation.facultyId}</td>
                <td>${installation.capacity}</td>
                <td>${installation.type}</td>
            </tr>`;
}

function choosePicture() {
    $("#installationImageInput").change(function() {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            $("#insImage").attr("src", e.target.result);
        };
        reader.readAsDataURL(file);
    });
    $("#installationImageInput").click();
}

$("#insImage").on("click", function() {
    choosePicture();
});

function createInstallation() {
    let formData = new FormData();

    formData.append("image", $("#installationImageInput")[0].files[0]);
    formData.append("name", $("#installationName").val());
    formData.append("faculty", $("#installationFaculty").val());
    formData.append("capacity",  $("#installationCapacity").val());
    formData.append("type", $("#installationType").val());

    $.ajax({
        type: "POST",
        url: "/installations/create",
        data: formData,
        headers: {
            "X-CSRF-TOKEN": $("#csrfToken").val()
        },
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response);
        },
        error: function (jqXHR) {
         $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
}

$("#newInstallationForm").on("submit", function(e) {
    e.preventDefault();
    createInstallation();
});
