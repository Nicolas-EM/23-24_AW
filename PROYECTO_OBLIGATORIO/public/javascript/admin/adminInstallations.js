"use strict"

// Load installations to manage
function getInstallations() {
    // Make an AJAX request to the server
    $.ajax({
        method: "GET",
        url: "/installations/",
        success: function (data) {
            console.log(data);
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
            </tr>`
}