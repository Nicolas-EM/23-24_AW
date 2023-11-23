$(document).ready(function () {
    getDestinos();
});

function getDestinos(){
    // Make an AJAX request to the server
    $.ajax({
        method: "GET",
        url: "/api/destinations",
        success: function (data) {
            $("#destRow").append(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
}

// Function to perform search
function performSearch() {
    // Get the value from the search input
    const query = $("#query").val();
    const maxPrice = $("#maxPrice").val();
    console.log("Making query to server with query: " + query);

    // Make an AJAX request to the server
    $.ajax({
        method: "POST",
        url: "/api/search",
        data: { query, maxPrice },
        success: function (data) {
            // Call renderDestinations with the received data
            $("#destRow").html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
}

// Call performSearch when the search button is clicked
$("#searchForm").on("submit", e => {
    e.preventDefault();
    performSearch();
});



window.onscroll = function(ev) {
    if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        // load more destinations
        getDestinos();
    }
};
