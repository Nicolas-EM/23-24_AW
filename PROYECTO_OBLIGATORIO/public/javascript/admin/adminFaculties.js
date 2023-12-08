"use strict"

// Load installations to manage
function getFaculties() {
    // Make an AJAX request to the server
    $.ajax({
        method: "GET",
        url: "/faculties/",
        success: function (data) {
            console.log(data);
            let faculties = "";
            for (let x in data) {
                const faculty = data[x];
                faculties += createFacultyRow(faculty);
            }

            $("#facultiesTableRow").html(faculties);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#toastMsg").html(jqXHR.responseText);
            toast.show();
        }
    });
}

function createFacultyRow(faculty) {
    return `<tr>
                <td scope="row">${faculty.id}</td>
                <td>${faculty.name}</td>
            </tr>`
}