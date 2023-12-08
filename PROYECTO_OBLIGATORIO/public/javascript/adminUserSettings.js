"use strict"

function getUsers() {
    $.ajax({
        method: "GET",
        url: "/users/",
        success: function (data) {
            console.log(data);
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
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.email}</td>
                <td class="text-center">
                    <span class="material-symbols-outlined d-inline-block align-text-top">settings</span>
                </td>
            </tr>`
}