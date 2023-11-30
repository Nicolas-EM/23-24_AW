
$("#registerBtn").on("click", () => {
    $("#regDiv").removeClass("d-none");
    $("#logDiv").addClass("d-none");
});

$("#loginBtn").on("click", () => {
    $("#logDiv").removeClass("d-none");
    $("#regDiv").addClass("d-none");
});
