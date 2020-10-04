$(document).ready(function() {
    // $("#movie-search-result").hide();
    // $("#person-search-result").hide();
    // $("#movie-info").hide();
    // $("#movie-info").hide();
    console.log("test", 1);

    // "Search" button clicked
    $("#btnSearch").click(function () {
        const searchInput = $("#searchInput").val().trim();
        console.log("#searchInput", searchInput);

        if (searchInput == "") {
            showError("empty");
            return;
        }

        const radioBtns = $("input[name=\"menu\"]");
        let selectedOption;
        for (const radioBtn of radioBtns) {
            if (radioBtn.checked) {
                selectedOption = radioBtn.value;
                break;
            }
        }
        if (selectedOption == "option1") {
            getMoviesByName();
        } else if (selectedOption == "option2") {
            getMoviesByNameAndYear();
        } else if (selectedOption == "option3") {
            getPeopleByName();
        }


        // Option 1: Search for Movie Title
        function getMoviesByName() {
            const URLMovies = 'https://api.themoviedb.org/3/search/movie?api_key=' + tmdbAPIKey +
                '&language=en-US&query=' + searchInput + '&page=1&include_adult=false';
            const URLpeople = 'https://api.themoviedb.org/3/search/movie?api_key=' + tmdbAPIKey +
                '&language=en-US&query=' + searchInput + '&page=1&include_adult=false';

            // $("$errorMessage").hide();

            $.ajax({
                url: URLMovies,
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

                    movieItem.appendTo($("#searchResult")); // Add to the DOM element
                });

            })
            .fail(function (data) {
                showError(data.status.toString());
            });
        }

        function getMoviesByNameAndYear() {
            // Option 2: Search for Movie Title and Year
            let movieName = searchInput.slice(0, -5);
            let movieYear = searchInput.slice(-4);
            console.log("movieName", movieName);
            console.log("searchInput", searchInput);
            console.log("movieYear", movieYear);

            const URLMovies2 = 'https://api.themoviedb.org/3/search/movie?api_key=' + tmdbAPIKey +
                '&language=en-US&query=' + movieName + '&page=1&include_adult=false';
            $.ajax({
                url: URLMovies2,
                type: "GET"
            })
            .done(function (data) {
                console.log("data", data);
                console.log("data title", data.results[0].title);
                $.each(data.results, function (index1, movie) {
                    console.log(searchInput.substring(-4));
                    if (movieYear == movie.release_date.substring(0,4)) { //check if the Searched Movie has the same Year with the release date
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

                        movieItem.appendTo($("#searchResult")); // Add to the DOM element
                    }
                });
            })
            .fail(function (data) {
                showError(data.status.toString());
            });

        }

        // Option 3: Search People Name
        function getPeopleByName() {
            console.log("exampleRadios1 ", $("#exampleRadios1:checked"));
            console.log("exampleRadios2 ", $("#exampleRadios2:checked"));
            console.log("exampleRadios3 ", $("#exampleRadios3:checked"));
            if($("#exampleRadios1").checked) {
                console.log("checked true", $("#exampleRadios1").val());
            }

            const personName = searchInput;
            console.log("personName", personName);

            const URLPerson = 'https://api.themoviedb.org/3/search/person?api_key=' + tmdbAPIKey +
                '&language=en-US&query=' + personName + '&page=1&include_adult=false';
            $.ajax({
                url: URLPerson,
                type: "GET"
            })
                .done(function (data) {
                    console.log("data", data);
                    console.log("data name", data.results[0].name);
                    $.each(data.results, function (index1, person) {
                        console.log(searchInput);
                        const personItem = $("<article />", {
                            "id": person.id
                        });
                        $("<section />", {
                            "text": "Name: " + person.name
                        }).appendTo(personItem);

                        $("<section />", {
                            "text": "Main Activity: " + person.known_for_department
                        }).appendTo(personItem);

                        personItem.appendTo($("#searchResult")); // Add to the DOM element
                    });
                })
                .fail(function (data) {
                    showError(data.status.toString());
                });
        }

    })





    // TODO: implement
    function showError(error) {
        console.log("error", error);
    }
});
