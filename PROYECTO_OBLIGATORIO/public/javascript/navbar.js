$("#logout").on("click", e => {
    $("#logoutForm").trigger("submit");
})

$("#mailModal").on("show.bs.modal", e => {
    $("#noMessages").removeClass("d-none");
    $("#selectChat").addClass("d-none");

    // get messages
    $.ajax({
        url: "/messages/chats",
        method: "GET",
        success: (chats) => {
            console.log(chats);

            $("#recipientsCol").empty();
            if (chats.length !== 0) {
                $("#noMessages").addClass("d-none");
                $("#selectChat").removeClass("d-none");
            }

            for (let x in chats) {
                const chat = chats[x];
                createChat(chat);
                getChatMessages(chat);
            }

            createTabsEventListener();
        },
        error: function (xhr, status, error) {
            $("#toastMsg").html(xhr.responseText);
            toast.show();
        }
    });
});


function createTabsEventListener() {
    $('button[data-bs-toggle="pill"]').on('shown.bs.tab', event => {
        if (event.target.id.includes("sender-")) {
            $("#selectChat").addClass("d-none");
        }
    });
}

function createChat(chat) {
    // Create recipient
    $("#recipientsCol").prepend(`<div role="presentation" class="border border-start-0">
                                    <button class="nav-link w-100 p-2" id="sender-${chat.sender_id}" data-bs-toggle="pill" data-bs-target="#msgTab-${chat.sender_id}" type="button" role="tab" aria-controls="msgTab-${chat.sender_id}" aria-selected="false" tabindex="-1">
                                        <div class="row">
                                            <h4>${chat.sender_name} ${chat.sender_surname}</h4>
                                        </div>
                                        <div class="row">
                                            <h5>${chat.sender_email}</h5>
                                        </div>
                                    </button>
                                </div>`);
}

function getChatMessages(chat) {
    $.ajax({
        url: `/messages/chats/${chat.sender_id}`,
        method: "GET",
        success: (messages) => {
            console.log(messages);
            // Create messages tab
            if ($(`#msgTab-${chat.sender_id}`)) {
                $(`#msgTab-${chat.sender_id}`).remove();
            }

            let messageCols = '';
            for (let x in messages) {
                const msg = messages[x];
                messageCols += `<div class="col">${msg.sender_name}: ${msg.message}</div>`
            }

            $("#chats-tabContent").append(`<div class="tab-pane fade p-2" id="msgTab-${chat.sender_id}" role="tabpanel" aria-labelledby="sender-${chat.sender_id}" tabindex="0">
                                                <div class="container">
                                                    <div class="row row-cols-1 g-2">
                                                        ${messageCols}
                                                        <div class="col align-self-end">
                                                            <form>
                                                                <div class="input-group justify-content-center">
                                                                    <input type="text" class="form-control" id="query" name="query" placeholder="Message">
                                                                    
                                                                    <!-- Send Btn -->
                                                                    <button class="btn btn-primary ml-2" type="submit">
                                                                        <span class="material-symbols-outlined">send</span>
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`);
        },
        error: function (xhr, status, error) {
            $("#toastMsg").html(xhr.responseText);
            toast.show();
        }
    });
}

$("#newMessageModal").on("show.bs.modal", e => {
    $("#recipientsDataList").empty();

    const isAdmin = $("#recipientsDataList").attr('data-isadmin') === "true";
    console.log(isAdmin === "false");

    // TODO: this should not be constant
    const facultyId = 1;

    if (isAdmin) {
        // Add everyone option
        $("#recipientsDataList").append(`<option value="Everyone">`);

        // Add all faculties
        $.ajax({
            url: "/faculties/",
            method: "GET",
            success: (faculties) => {
                for (let x in faculties) {
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
                for (let x in users) {
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
        $.ajax({
            url: `/users/byFaculty/${facultyId}`,
            method: "GET",
            success: (users) => {
                for (let x in users) {
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

$("#newMessageForm").on("submit", e => {
    e.preventDefault();

    const recipient = $("#recipient").val()
    const message = $("#message").val();

    if (recipient === "Everyone") {
        $.ajax({
            url: "/messages/send/",
            method: "POST",
            data: {
                _csrf: $("#messageCSRF").val(),
                message
            },
            success: () => {
                $("#toastMsg").html("Message sent");
                toast.show();
            },
            error: function (xhr, status, error) {
                $("#toastMsg").html(xhr.responseText);
                toast.show();
            }
        });
    } else {
        const selectedOption = $("#recipientsDataList option[value='" + recipient + "']");

        if (selectedOption.length > 0) {
            const messageType = selectedOption.data("bs-type");
            const recipientId = selectedOption.data("bs-id");

            const endpoint = `/messages/send/${messageType}`;

            $.ajax({
                url: endpoint,
                method: "POST",
                data: {
                    _csrf: $("#messageCSRF").val(),
                    recipientId,
                    message
                },
                success: () => {
                    $("#toastMsg").html("Message sent");
                    toast.show();
                },
                error: function (xhr, status, error) {
                    $("#toastMsg").html(xhr.responseText);
                    toast.show();
                }
            });
        } else {
            $('#recipient')[0].setCustomValidity('Invalid recipient');
            $('#newMessageForm')[0].reportValidity();
            $('#recipient')[0].setCustomValidity('');
        }
    }
})