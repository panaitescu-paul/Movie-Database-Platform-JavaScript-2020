$(document).ready(function() {
    // $("#movie-search-result").hide();
    // $("#person-search-result").hide();
    // $("#movie-info").hide();
    // $("#movie-info").hide();
    console.log("test", 1);

    // "Search" button clicked
    $("#btnSearch").click(function () {
        let searchInput = $("#searchInput").val().trim();
        console.log("#searchInput", searchInput);

        if (searchInput == "") {
            showError("empty");
            return;
        }

        const URL = 'https://api.themoviedb.org/3/search/movie?api_key=' +
            tmdbAPIKey +
            '&language=en-US&query=' +
            searchInput +
            '&page=1&include_adult=false';

        // $("$errorMessage").hide();

        $.ajax({
            url: URL,
            type: "GET"
        })
        .done(function (data) {
            console.log("data", data);
            console.log("data title", data.results[0].title);


            $.each(data.results, function (index1, movie) {
                const movieItem = $("<article />", {
                    "id": movie.id
                });
                $("<section />", {
                    "text": "Title: " + movie.title
                }).appendTo(movieItem);

                $("<section />", {
                    "text": "Release Year: " + movie.release_date.substring(0,4)
                }).appendTo(movieItem);

                $("<section />", {
                    "text": "Language: " + movie.original_language
                }).appendTo(movieItem);

                movieItem.appendTo($("#movieSearchResult")); // Add to the DOM element
            });

        })
        .fail(function (data) {
            showError(data.status.toString());
        });

    })

    // TODO: implement
    function showError(error) {
        console.log("error", error);
    }
});
