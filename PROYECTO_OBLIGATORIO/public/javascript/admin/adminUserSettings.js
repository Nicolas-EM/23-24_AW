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

function createFacultyFilters() {
    $.ajax({
        method: "GET",
        url: "/faculties/",
        success: function (data) {
            for (let x in data) {
                const faculty = data[x];
                $("#facultyFilter").append(`<option value="${faculty.id}">
                                                ${faculty.name}
                                            </option>`);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
}

function getFacultyNameFromId(id) {
    return $(`#facultyFilter`).find(`[value='${id}']`).text().trim();
}

function createUserRow(user) {
    return `<tr>
                <td class="align-middle">${user.name}</td>
                <td class="align-middle">${user.surname}</td>
                <td class="align-middle">${user.email}</td>
                <td class="align-middle">${getFacultyNameFromId(user.facultyId)}</td>
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

// User search
$("#userSearchForm").on("submit", e => {
    e.preventDefault();

    // Get the value from the search input
    const query = $("#userSearchQuery").val();
    const isAdmin = $("#roleFilter").val();
    const isValidated = $("#validatedFilter").val();
    const facultyId = $("#facultyFilter").val();

    // Get the CSRF token value
    const _csrf = $("input[name='_csrf']").val();
    // Make an AJAX request to the server
    $.ajax({
        method: "POST",
        url: "/users/search",
        data: {
            query,
            isAdmin,
            isValidated,
            facultyId,
            _csrf
        },
        success: function (data) {
            $("#userList").empty();

            let users = "";
            for (let x in data) {
                const user = data[x];
                users += createUserRow(user);
            }
            $("#userList").html(users);

            if (data.length === 0) {
                $("#toastMsg").html("No users found. Try clearing filters?");
                toast.show();
            }
        },
        error: function (jqXHR) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
})

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
            $("#userId").attr("value", user.id);

            if (user.isValidated === 0) {
                $("#validation").removeClass("d-none");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
});

// Shared modal on open
$("#userHistoryModal").on("show.bs.modal", e => {
    const button = e.relatedTarget
    // Extract info from data-bs-* attributes
    const userId = button.getAttribute('data-bs-userid');

    $.ajax({
        method: "GET",
        url: `/reservations/byUser/${userId}`,
        success: function (data) {
            let reservations = "";
            for (let x in data) {
                const reservation = data[x];
                reservations += createHistoryRow(reservation);
            }
            $("#uHistoryTableRows").html(reservations);

            if (data.length === 0) {
                $("#uHistoryTable").addClass("d-none");
                $("#uHistoryNoResults").removeClass("d-none");
            } else {
                $("#uHistoryTable").removeClass("d-none");
                $("#uHistoryNoResults").addClass("d-none");
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
                <td>${reservation.instid}</td>
                <td>${new Date(reservation.dateini).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td>${new Date(reservation.dateend).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td>${new Date(reservation.datecreation).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
            </tr>`
}

// Validate user
$("#validateUserBtn").on("click", e => {
    $.ajax({
        method: "POST",
        url: `/users/validate`,
        data: {
            _csrf: $("#csrfToken").val(),
            userId: $("#userId").val()
        },
        success: function (data) {
            $("#validation").addClass("d-none");
            $("#toastMsg").html("User successfully validated");
            toast.show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
});

// Update user
$("#updateUser").on("submit", e => {
    e.preventDefault();
    $.ajax({
        method: "POST",
        url: `/users/update`,
        data: {
            _csrf: $("#csrfToken").val(),
            userId: $("#userId").val(),
            role: $("#role").val(),
        },
        success: function (data) {
            $("#validation").addClass("d-none");
            $("#toastMsg").html("User role successfully updated");
            toast.show();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
})