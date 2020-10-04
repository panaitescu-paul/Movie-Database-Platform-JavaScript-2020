$(document).ready(function() {
    // $("#movie-search-result").hide();
    // $("#person-search-result").hide();
    // $("#movie-info").hide();
    // $("#movie-info").hide();
    console.log("test", 1);

    // "Search" button clicked
    $("#btnSearch").click(function () {
        console.log("#searchInput", $("#searchInput").val());

        if ($("#searchInput").val().trim() == "") {
            showError("empty");
            return;
        }

        const URL = 'https://api.themoviedb.org/3/search/movie?api_key=' +
            tmdbAPIKey +
            '&language=en-US&query=' +
            $("#searchInput").val() +
            '&page=1&include_adult=false';

        // $("$errorMessage").hide();

        $.ajax({
            url: URL,
            type: "GET"
        })
        .done(function (data) {
            console.log("data", data);

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
