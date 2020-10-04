$(document).ready(function() {
    // $("#movie-search-result").hide();
    // $("#person-search-result").hide();
    // $("#movie-info").hide();
    // $("#movie-info").hide();
    $("#errorMessage").hide();
    console.log("test", 1);

    // "Search" button clicked
    $("#btnSearch").click(function () {
        const searchInput = $("#searchInput").val();
        console.log("searchInput", searchInput);

        // Empty the Search Result
        $("#searchResult").empty();
        $("#searchResult").show();
        $("#errorMessage").hide();

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
                // TODO: add error for no matches
                console.log("data title", data.results[0].title);
                $.each(data.results, function (index1, movie) {
                    const movieItem = $("<article />", {
                        "class": "movie",
                        "id": movie.id,
                        "data-toggle": "modal",
                        "data-target": "#modal"
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

                    movieItem.on("click", function() {
                        showMovieInfo(movie.id);
                    });

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
            let movieFound = false;
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
                // TODO: add error for no matches
                $.each(data.results, function (index1, movie) {
                    console.log(searchInput.substring(-4));
                    if (movieYear == movie.release_date.substring(0,4)) { //check if the Searched Movie has the same Year with the release date
                        movieFound = true;
                        const movieItem = $("<article />", {
                            "class": "movie",
                            "id": movie.id,
                            "data-toggle": "modal",
                            "data-target": "#modal"
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

                        movieItem.on("click", function() {
                            showMovieInfo(movie.id);
                        });

                        movieItem.appendTo($("#searchResult")); // Add to the DOM element
                    }
                });
                if (!movieFound) {
                    showError("movie and year");
                }
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
                    // TODO: add error for no matches
                    $.each(data.results, function (index1, person) {
                        console.log(searchInput);
                        const personItem = $("<article />", {
                            "class": "movie",
                            "id": person.id,
                            "data-toggle": "modal",
                            "data-target": "#modal"
                        });
                        $("<section />", {
                            "text": "Name: " + person.name
                        }).appendTo(personItem);

                        $("<section />", {
                            "text": "Main Activity: " + person.known_for_department
                        }).appendTo(personItem);

                        personItem.on("click", function() {
                            showPersonInfo(person.id);
                        });

                        personItem.appendTo($("#searchResult")); // Add to the DOM element
                    });
                })
                .fail(function (data) {
                    showError(data.status.toString());
                });
        }

    });

    // Show an Error Message based on the received Code Status
    function showError(codeStatus) {
        console.log("codeStatus", codeStatus);
        let msgError;

        switch (codeStatus) {
            case "empty": msgError = "Please enter a Movie Name or Person Name"; break;
            case "movie and year": msgError = "The is not information about this Movie and Year"; break;
            case "404": msgError = "The is not information about this Movie/Person"; break;
            default: msgError = "There was an error while processing your request..."; break;
        }
        $("#errorMessage").html(msgError);
        $("#searchResult").hide();
        $("#errorMessage").show();

    }

    function showMovieInfo(id) {
        console.log("showMovieInfo");
        console.log("id", id);

        // Empty the previous Results
        $("#modalInfoContent").empty();
        $("#modalTitle").html("Movie Information");
        // $("#searchResult").show();
        // $("#errorMessage").hide();

        const movieId = id;
        const URLMovieInfo = 'https://api.themoviedb.org/3/movie/' + movieId +
                             '?api_key=' + tmdbAPIKey + '&language=en-US';
        $.ajax({
            url: URLMovieInfo,
            type: "GET"
        })
        .done(function (movie) {
            console.log("movie", movie);
            // TODO: add error for no matches
            const movieInfo = $("<article />", {
                "class": "movieInfo",
                "id": movie.id
            });

            $(movieInfo).append(
                '<section>\
                    <span class="tag">Title: </span>\
                    <span class="body">' + movie.original_title + '</span>\
                </section>\
                <section>\
                    <span class="tag">Release Date: </span>\
                    <span class="body">' + movie.release_date + '</span>\
                </section>\
                <section>\
                    <span class="tag">Original Language: </span>\
                    <span class="body">' + movie.original_language + '</span>\
                </section>\
                <section>\
                    <span class="tag">Runtime: </span>\
                    <span class="body">' + movie.runtime + '</span>\
                </section>\
                <section>\
                    <span class="tag">Overview: </span>\
                    <span class="body">' + movie.overview + '</span>\
                </section>\
                <section>\
                    <span class="tag">Homepage: </span>\
                    <span class="body">' + movie.homepage + '</span>\
                </section>\
                <section>\
                    <span class="tag">Genres: </span>\
                </section>'
            );

            $.each(movie.genres, function (index1, genre) {
                console.log(genre.name)
                $(movieInfo).append(
                    '<span class="body">' + genre.name + ', ' + '</span>'
                );
            });

            $(movieInfo).append(
                '<section>\
                    <span class="tag">Production Companies: </span>\
                </section>'
            );

            $.each(movie.production_companies, function (index1, production_companies) {
                console.log(production_companies.name)
                $(movieInfo).append(
                    '<span class="body">' + production_companies.name + ', ' + '</span>'
                );
            });


            movieInfo.appendTo($("#modalInfoContent")); // Add to the DOM element
        })
        .fail(function (data) {
            showError(data.status.toString());
        });

        const URLMovieInfo2 = 'https://api.themoviedb.org/3/movie/' + movieId +
            '/credits?api_key=' + tmdbAPIKey;
        $.ajax({
            url: URLMovieInfo2,
            type: "GET"
        })
        .done(function (movieCredits) {
            console.log("movieCredits", movieCredits);
            // TODO: add error for no matches

            const movieInfo2 = $("<article />", {
                "class": "movieInfo",
            });

            $(movieInfo2).append(
                '<section>\
                    <span class="tag">List of actors: </span>\
                </section>'
            );
            $.each(movieCredits.cast, function (index1, cast) {
                $(movieInfo2).append(
                    '<span class="body">' + cast.name + ' as ' + cast.character + '</span>'
                );
            });

            $(movieInfo2).append(
                '<section>\
                    <span class="tag">List of Directors: </span>\
                </section>'
            );

            $.each(movieCredits.crew, function (index1, crew) {
                if (crew.job == 'Director')
                $(movieInfo2).append(
                    '<span class="body">' + crew.name + '</span>'
                );
            });
            $(movieInfo2).append(
                '<section>\
                    <span class="tag">List of Script Writers: </span>\
                </section>'
            );

            $.each(movieCredits.crew, function (index1, crew) {
                if (crew.job == 'Writer')
                    $(movieInfo2).append(
                        '<span class="body">' + crew.name + '</span>'
                    );
            });

            $(movieInfo2).append(
                '<section>\
                    <span class="tag">List of Executive Producers: </span>\
                </section>'
            );

            $.each(movieCredits.crew, function (index1, crew) {
                if (crew.job == 'Executive Producer')
                    $(movieInfo2).append(
                        '<span class="body">' + crew.name + '</span>'
                    );
            });

            $(movieInfo2).append(
                '<section>\
                    <span class="tag">List of Producers: </span>\
                </section>'
            );

            $.each(movieCredits.crew, function (index1, crew) {
                if (crew.job == 'Producer')
                    $(movieInfo2).append(
                        '<span class="body">' + crew.name + '</span>'
                    );
            });

            $(movieInfo2).append(
                '<section>\
                    <span class="tag">List of Music Composers: </span>\
                </section>'
            );

            $.each(movieCredits.crew, function (index1, crew) {
                if (crew.job == 'Music')
                    $(movieInfo2).append(
                        '<span class="body">' + crew.name + '</span>'
                    );
            });

            movieInfo2.appendTo($("#modalInfoContent")); // Add to the DOM element
        })
        .fail(function (data) {
            showError(data.status.toString());
        });
    }

    function showPersonInfo(id) {
        console.log("showPersonInfo");
        console.log("id", id);

        // Empty the previous Results
        $("#modalInfoContent").empty();
        $("#modalTitle").html("Person Information");

        const personId = id;
        const URLPersonInfo = 'https://api.themoviedb.org/3/person/' + personId +
            '?api_key=' + tmdbAPIKey + '&language=en-US';
        $.ajax({
            url: URLPersonInfo,
            type: "GET"
        })
        .done(function (person) {
            console.log("movie", person);
            // TODO: add error for no matches
            const personInfo = $("<article />", {
                "class": "personInfo",
                "id": personId
            });

            $(personInfo).append(
                '<section>\
                    <span class="tag">Name: </span>\
                    <span class="body">' + person.name + '</span>\
                </section>\
                <section>\
                    <span class="tag">Main Activity: </span>\
                    <span class="body">' + person.known_for_department + '</span>\
                </section>\
                <section>\
                    <span class="tag">Birthday: </span>\
                    <span class="body">' + person.birthday + '</span>\
                </section>\
                <section>\
                    <span class="tag">Birthplace: </span>\
                    <span class="body">' + person.place_of_birth + '</span>\
                </section>\
                <section>\
                    <span class="tag">Biography: </span>\
                    <span class="body">' + person.biography + '</span>\
                </section>\
                <section>\
                    <span class="tag">Link to Website: </span>\
                    <span class="body">' + person.homepage + '</span>\
                </section>'
                );

            if (person.deathday !== null) {
                $(personInfo).append(
                    '<section>\
                        <span class="tag">Day of decease: </span>\
                        <span class="body">' + person.deathday + '</span>\
                    </section>'
                );
            }



            personInfo.appendTo($("#modalInfoContent")); // Add to the DOM element
        })
        .fail(function (data) {
            showError(data.status.toString());
        });

        const URLPersonInfo2 = 'https://api.themoviedb.org/3/person/' + personId +
            '/movie_credits?api_key=' + tmdbAPIKey + '&language=en-US';
        $.ajax({
            url: URLPersonInfo2,
            type: "GET"
        })
        .done(function (credits) {
            console.log("movie", credits);
            // TODO: add error for no matches
            const personInfo = $("<article />", {
                "class": "personInfo",
                "id": personId
            });


            $(personInfo).append(
                '<section>\
                    <span class="tag">List of movies: </span>\
                </section>'
            );

            $.each(credits.cast, function (index1, cast) {
                console.log("---- cast.title", cast.title)
                $(personInfo).append(
                    '<section>\
                        <span class="tag">Title: </span>\
                        <span class="body">' + cast.title + '</span>\
                    </section>\
                    <section>\
                        <span class="tag">Release Year: </span>\
                        <span class="body">' + cast.release_date.substring(0,4) + '</span>\
                    </section>'
                );
            });

            $.each(credits.crew, function (index1, crew) {
                console.log("---- crew.title", crew.title)
                if (crew.job) {
                    $(personInfo).append(
                        '<section>\
                            <span class="tag">Title: </span>\
                            <span class="body">' + crew.original_title + '</span>\
                    </section>\
                    <section>\
                        <span class="tag">Release Year: </span>\
                        <span class="body">' + crew.release_date.substring(0,4) + '</span>\
                    </section>\
                    <section>\
                        <span class="tag">Role: </span>\
                        <span class="body">' + crew.job + '</span>\
                    </section>'
                    );
                }
            });
            personInfo.appendTo($("#modalInfoContent")); // Add to the DOM element

        })
        .fail(function (data) {
            showError(data.status.toString());
        });
    }

});
