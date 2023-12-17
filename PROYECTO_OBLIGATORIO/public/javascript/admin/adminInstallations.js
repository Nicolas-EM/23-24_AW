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
    return `<tr id="instRow-${installation.id}">
                <td>${installation.name}</td>
                <td>${installation.facultyId}</td>
                <td>${installation.capacity}</td>
                <td>${installation.type === 0 ? "Collective" : "Individual"}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#installationSettingsModal" data-bs-installationid="${installation.id}">
                        <span class="material-symbols-outlined d-inline-block align-text-top">settings</span>
                    </button>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#installationHistoryModal" data-bs-installationid="${installation.id}">
                        <span class="material-symbols-outlined d-inline-block align-text-top">history</span>
                    </button>
                </td>
            </tr>`;
}

$("#insImage").on("click", function() {
    $("#installationImageInput").change(function() {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            $("#insImage").attr("src", e.target.result);
        };
        reader.readAsDataURL(file);
    });
    $("#installationImageInput").click();
});

function createInstallation() {
    let formData = new FormData();

    const name = $("#installationName").val();
    const facultyId = $("#installationFaculty").val();
    const capacity = $("#installationCapacity").val();
    const type = $("#installationType").val();

    formData.append("image", $("#installationImageInput")[0].files[0]);
    formData.append("name", name);
    formData.append("faculty", facultyId);
    formData.append("capacity",  capacity);
    formData.append("type", type);

    $.ajax({
        type: "POST",
        url: "/installations/create",
        data: formData,
        headers: {
            "X-CSRF-TOKEN": $("#csrfToken").val()
        },
        processData: false,
        contentType: false,
        success: function (id) {
            $("#toastMsg").html("Success: Installation created.");
            toast.show();

            $("#installationTableRow").append(createInstallationRow({id, name, facultyId, capacity, type}));

            $("#newInstallationModal").modal("hide"); // Close the modal
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

$("#newInstallationModal").on("hide.bs.modal", e => {
    $("#installationName").val("");
    $("#installationFaculty").val(1);
    $("#installationCapacity").val("");
    $("#installationType").val(0);
});

$("#installationSettingsModal").on("show.bs.modal", e => {
    const button = e.relatedTarget
    // Extract info from data-bs-* attributes
    const installationId = button.getAttribute('data-bs-installationid');

    $("#editInstallationId").val(installationId);
    $("#editInstallationImg").attr("src", `/installations/image/${installationId}`);

    $.ajax({
        method: "GET",
        url: `/installations/${installationId}`,
        success: function (data) {
            $("#editIName").val(data.name);
            $("#editIFaculty").val(data.facultyId);
            $("#editICapacity").val(data.capacity);
            $("#editIType").val(data.type);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
});

$("#editInstallationImg").on("click", function() {
    $("#editInstallationImageInput").change(function() {
        const file = this.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            $("#editInstallationImg").attr("src", e.target.result);
        };
        reader.readAsDataURL(file);
    });
    $("#editInstallationImageInput").click();
});

$("#updateInstallationForm").on("submit", function(e) {
    e.preventDefault();
    
    let formData = new FormData();

    const installationId = $("#editInstallationId").val();
    const name = $("#editIName").val();
    const facultyId = $("#editIFaculty").val();
    const capacity = $("#editICapacity").val();
    const type = $("#editIType").val();

    formData.append("installationId", installationId);
    formData.append("image", $("#editInstallationImageInput")[0].files[0]);
    formData.append("name", name);
    formData.append("faculty", facultyId);
    formData.append("capacity",  capacity);
    formData.append("type", type);

    $.ajax({
        type: "POST",
        url: "/installations/update",
        data: formData,
        headers: {
            "X-CSRF-TOKEN": $("#csrfToken").val()
        },
        processData: false,
        contentType: false,
        success: function () {
            $("#toastMsg").html("Success: Installation modified.");
            toast.show();

            $(`#instRow-${installationId}`).replaceWith(createInstallationRow({id: installationId, name, facultyId, capacity, type}));

            $("#installationSettingsModal").modal("hide"); // Close the modal
        },
        error: function (jqXHR) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
});

$("#installationHistoryModal").on("show.bs.modal", e => {
    const button = e.relatedTarget
    // Extract info from data-bs-* attributes
    const installationId = button.getAttribute('data-bs-installationid');

    $.ajax({
        method: "GET",
        url: `/reservations/byInstallation/${installationId}`,
        success: function (data) {
            let reservations = "";
            for (let x in data) {
                const reservation = data[x];
                reservations += createHistoryRow(reservation);
            }
            $("#iHistoryTableRows").html(reservations);

            if (data.length === 0) {
                $("#iHistoryTable").addClass("d-none");
                $("#iHistoryNoResults").removeClass("d-none");
            } else {
                $("#iHistoryTable").removeClass("d-none");
                $("#iHistoryNoResults").addClass("d-none");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
});

function createHistoryRow(reservation) {
    return `<tr>
                <td>${reservation.userName} ${reservation.userSurname}</td>
                <td>${reservation.userEmail}</td>
                <td>${new Date(reservation.dateini).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td>${new Date(reservation.dateend).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td>${new Date(reservation.datecreation).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
            </tr>`
}