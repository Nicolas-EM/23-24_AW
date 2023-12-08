"use strict"

function getUsers() {
    $.ajax({
        method: "GET",
        url: "/users/",
        success: function (data) {
            let users = "";
            for (let x in data) {
                const user = data[x];
                users += createUserRow(user);
            }

            $("#userList").html(users);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
};

function createUserRow(user) {
    return `<tr>
                <td class="align-middle">${user.name}</td>
                <td class="align-middle">${user.surname}</td>
                <td class="align-middle">${user.email}</td>
                <td class="d-none">${user.isAdmin}</td>
                <td class="d-none">${user.validated}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userSettingsModal" data-bs-userid="${user.id}">
                        <span class="material-symbols-outlined d-inline-block align-text-top">settings</span>
                    </button>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#userHistoryModal" data-bs-userid="${user.id}">
                        <span class="material-symbols-outlined d-inline-block align-text-top">history</span>
                    </button>
                </td>
            </tr>`
}

// Shared modal on open
$("#userSettingsModal").on("show.bs.modal", e => {
    const button = e.relatedTarget
    // Extract info from data-bs-* attributes
    const userId = button.getAttribute('data-bs-userid');

    $.ajax({
        method: "GET",
        url: `/users/${userId}`,
        success: function (user) {
            $("#name").val(user.name);
            $("#surname").val(user.surname);
            $("#email").val(user.email);
            $("#role").val(user.isAdmin);

            if(user.validated === 0){
                $("#validation").removeClass("d-none");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
});