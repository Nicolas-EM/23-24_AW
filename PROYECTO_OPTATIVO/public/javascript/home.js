console.log("index.js loaded");
    // Function to render destinations
    function renderDestinations(destinations) {
        // Clear existing destinations
        $("#destRow").empty();

        // Loop through each destination
        destinations.forEach(function(destination) {
            // Create destination card
            var card = $("<div>").addClass("col mb-4");
            var cardBody = $("<div>").addClass("card h-100");
            var cardImg = $("<img>").addClass("card-img-top").attr("src", destination.image);
            var cardTitle = $("<h5>").addClass("card-title").text(destination.name);
            var cardText = $("<p>").addClass("card-text").text(destination.description);

            // Append elements to card body
            cardBody.append(cardImg, cardTitle, cardText);
            card.append(cardBody);

            // Append card to destination row
            $("#destRow").append(card);
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
            url: "/search",
            data: { query, maxPrice },
            success: function(data) {
                // Call renderDestinations with the received data
                console.log("me esta llegando esto como respuesta: ", data);
                renderDestinations(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Se ha producido un error: " + errorThrown);
            }
        });
    }

    
    $(document).ready(function() {
        console.log("ready!");
        performSearch();
    });

    // Call performSearch when the search button is clicked
    $("#searchForm").on("submit", e => {
        e.preventDefault();
        performSearch();
    });
