$("#logout").on("click", e => {
    $("#logoutForm").trigger( "submit" );
})

$("#mailModal").on("show.bs.modal", e => {
    $("#noMessages").removeClass("d-none");
    $("#selectChat").addClass("d-none");

    // get messages
    $.ajax({
        url: "/messages/",
        method: "GET",
        success: (messages) => {
            if(messages.length !== 0) {
                $("#noMessages").addClass("d-none");
                $("#selectChat").removeClass("d-none");
            }

            for(let x in messages){
                const msg = messages[x];
                createMessage(msg);
            }

            createTabsEventListener();
        },
        error: function (xhr, status, error) {
            $("#toastMsg").html(xhr.responseText);
            toast.show();
        }
    });
});


function createTabsEventListener(){
    $('button[data-bs-toggle="pill"]').on('shown.bs.tab', event => {    
        if(event.target.id.includes("sender-")){
            $("#selectChat").addClass("d-none");
        }
    });
}

function createMessage(msg) {
    console.log(msg);

    if(!$(`#msgTab-${msg.sender_id}`).length){
        console.log(true);
        // Create recipient
        $("#recipientsCol").prepend(`<div role="presentation" class="border border-start-0">
                                        <button class="nav-link w-100 p-2" id="sender-${msg.sender_id}" data-bs-toggle="pill" data-bs-target="#msgTab-${msg.sender_id}" type="button" role="tab" aria-controls="msgTab-${msg.sender_id}" aria-selected="false" tabindex="-1">
                                            <div class="row">
                                                <h4>${msg.sender_name} ${msg.sender_surname}</h4>
                                            </div>
                                            <div class="row">
                                                <h5>${msg.sender_email}</h5>
                                            </div>
                                        </button>
                                    </div>`);

        // Create messages tab
        $("#chats-tabContent").append(`<div class="tab-pane fade" id="msgTab-${msg.sender_id}" role="tabpanel" aria-labelledby="sender-${msg.sender_id}" tabindex="0">
                                            <div class="row ps-2 mt-2">
                                                ${msg.sender_name}: ${msg.message}
                                            </div>
                                        </div>`);
    } else {
        console.log("false");
        // Append to message tab
        $(`#msgTab-${msg.sender_id}`).append(`<div class="row ps-2">
                                                ${msg.sender_name}: ${msg.message}
                                            </div>`);
    }
}

$("#newMessageModal").on("show.bs.modal", e => {
    $("#recipientsDataList").empty();

    const isAdmin = $("#recipientsDataList").attr('data-isadmin') === "true";
    console.log(isAdmin === "false");
    
    // TODO: this should not be constant
    const facultyId = 1;

    if(isAdmin){
        // Add everyone option
        $("#recipientsDataList").append(`<option value="Everyone">`);

        // Add all faculties
        $.ajax({
            url: "/faculties/",
            method: "GET",
            success: (faculties) => {
                for(let x in faculties){
                    const faculty = faculties[x];
                    $("#recipientsDataList").append(`<option data-bs-type="faculty" data-bs-id="${faculty.id}" value="${faculty.name}">`);
                }
            },
            error: function (xhr, status, error) {
                $("#toastMsg").html(xhr.responseText);
                toast.show();
            }
        });

        // Add all users
        $.ajax({
            url: "/users/",
            method: "GET",
            success: (users) => {
                for(let x in users){
                    const user = users[x];
                    $("#recipientsDataList").append(`<option data-bs-type="user" data-bs-id="${user.id}" value="${user.email}">`);
                }
            },
            error: function (xhr, status, error) {
                $("#toastMsg").html(xhr.responseText);
                toast.show();
            }
        });
    } else {
        // TODO: add user from SAME faculty
        $.ajax({
            url: `/users/byFaculty/${facultyId}`,
            method: "GET",
            success: (users) => {
                for(let x in users){
                    const user = users[x];
                    $("#recipientsDataList").append(`<option data-bs-type="user" data-bs-id="${user.id}" value="${user.email}">`);
                }
            },
            error: function (xhr, status, error) {
                $("#toastMsg").html(xhr.responseText);
                toast.show();
            }
        });
    }
});