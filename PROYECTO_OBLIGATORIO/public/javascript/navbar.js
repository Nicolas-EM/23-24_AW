const toast = bootstrap.Toast.getOrCreateInstance($("#liveToast")[0]);

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
            $("#recipientsRow").empty();
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
    $("#recipientsRow").prepend(`<div role="presentation" class="border-bottom rounded">
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
        success: (data) => {
            const messages = data.messages;
            
            // Create messages tab
            if ($(`#msgTab-${chat.sender_id}`)) {
                $(`#msgTab-${chat.sender_id}`).remove();
            }

            let messagesCol = '';
            for (let x in messages) {
                const msg = messages[x];
                messagesCol += `<span class="mb-2"><b>${msg.sender_id === data.sessionId ? "You" : msg.sender_name}</b>: ${msg.message}</span><br>`
            }

            $("#chats-tabContent").append(`<div class="tab-pane fade p-2 h-100" id="msgTab-${chat.sender_id}" role="tabpanel" aria-labelledby="sender-${chat.sender_id}" tabindex="0">
                                                <div class="container h-100">
                                                    <div class="row row-cols-1 g-2 h-100">
                                                        <div class="col">
                                                            <div class="row">
                                                                <h4>${chat.sender_name} ${chat.sender_surname}</h4>
                                                            </div>
                                                            <div class="row" id="messagesRow-${chat.sender_id}">
                                                                ${messagesCol}
                                                            </div>
                                                        </div>
                                                        <div class="col align-self-end">
                                                            <form id="sendMsgForm${chat.sender_id}">
                                                                <div class="input-group justify-content-center">
                                                                    <input type="number" class="d-none" value="${chat.sender_id}" name="recipientId">
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

$(document).on("submit", "[id^='sendMsgForm']", e => {
    e.preventDefault();

    // get form
    const form = $(`#${e.currentTarget.id}`);

    // get recipientId
    const recipientId = form.find("input[name='recipientId']").val();

    // get message
    const msgInput = form.find("input[name='query']");
    const message = msgInput.val();

    if(message){
        $.ajax({
            url: '/messages/send/user',
            method: "POST",
            data: {
                _csrf: $("#messageCSRF").val(),
                recipientId,
                message
            },
            success: () => {
                msgInput.val("");
                $("#toastMsg").html("Message sent");
                toast.show();

                $(`#messagesRow-${recipientId}`).append(`<span class="mb-2">You: ${message}</span><br>`)
            },
            error: function (xhr, status, error) {
                $("#toastMsg").html(xhr.responseText);
                toast.show();
            }
        });
    }
})

$("#newMessageModal").on("show.bs.modal", e => {
    $("#recipientsDataList").empty();

    const isAdmin = $("#recipientsDataList").attr('data-isadmin') === "true";

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

$("#newMessageModal").on("hide.bs.modal", e => {
    // clear modal
    $("#recipient").val("");
    $("#message").val("");
});

const newMessageModal = bootstrap.Modal.getOrCreateInstance("#newMessageModal");
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
                newMessageModal.hide();

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
                    newMessageModal.hide();
                    
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
});