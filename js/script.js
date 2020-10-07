$(document).ready(function() {
    $("#errorMessage").hide();

    // "Search" button clicked
    $("#btnSearch").click(function () {
        const searchInput = $("#searchInput").val();
        console.log("searchInput", searchInput);

        // Empty previous Search Results
        $("#searchResult").empty();
        $("#searchResult").show();
        $("#errorMessage").hide();

        if (searchInput == "") {
            showError("empty");
            return;
        }

        // Find out which radio button is checked
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

            $.ajax({
                url: URLMovies,
                type: "GET"
            })
            .done(function (data) {
                $.each(data.results, function (index1, movie) {
                    const movieItem = $("<article />", {
                        "class": "movie clearfix",
                        "id": movie.id,
                        "data-toggle": "modal",
                        "data-target": "#modal",
                    });

                    const movieItemImg = $("<div />", {
                        "class": "movie-item-img",
                        "float": "right",
                    });

                    const movieItemDetails = $("<div />", {
                        "class": "movie-item-details",
                    });
                    movieItemImg.appendTo(movieItem);
                    movieItemDetails.appendTo(movieItem);

                    $("<img>", {
                        "src": "https://image.tmdb.org/t/p/w200" + movie.poster_path,
                        "width": "100px",
                        "height": "150px",
                        "onerror": "this.src='img/img_not_found.png'",
                    }).appendTo(movieItemImg);

                    $(movieItemDetails).append(
                        '<p>\
                            <span class="title">Title: </span>\
                            <span class="desc">' + movie.title + '</span>\
                        </p>\
                        <p>\
                            <span class="title">Release Year: </span>\
                            <span class="desc">' + movie.release_date.substring(0,4) + '</span>\
                        </p>\
                        <p>\
                            <span class="title">Language: </span>\
                            <span class="desc">' + movie.original_language + '</span>\
                        </p>'
                    );

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

        // Option 2: Search for Movie Title and Year
        function getMoviesByNameAndYear() {
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
                $.each(data.results, function (index1, movie) {
                    if (movieYear == movie.release_date.substring(0,4)) { //check if the Searched Movie has the same Year with the release date
                        movieFound = true;
                        const movieItem = $("<article />", {
                            "class": "movie clearfix",
                            "id": movie.id,
                            "data-toggle": "modal",
                            "data-target": "#modal"
                        });

                        const movieItemImg = $("<div />", {
                            "class": "movie-item-img",
                            "float": "right",
                        });
                        const movieItemDetails = $("<div />", {
                            "class": "movie-item-details",
                        });
                        movieItemImg.appendTo(movieItem);
                        movieItemDetails.appendTo(movieItem);

                        $("<img>", {
                            "src": "https://image.tmdb.org/t/p/w200" + movie.poster_path,
                            "width": "100px",
                            "height": "150px",
                            "onerror": "this.src='img/img_not_found.png'",
                        }).appendTo(movieItemImg);

                        $(movieItemDetails).append(
                            '<p>\
                                <span class="title">Title: </span>\
                                <span class="desc">' + movie.title + '</span>\
                            </p>\
                            <p>\
                                <span class="title">Release Year: </span>\
                                <span class="desc">' + movie.release_date.substring(0,4) + '</span>\
                            </p>\
                            <p>\
                                <span class="title">Language: </span>\
                                <span class="desc">' + movie.original_language + '</span>\
                            </p>'
                        );

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
            const personName = searchInput;
            console.log("personName", personName);

            const URLPerson = 'https://api.themoviedb.org/3/search/person?api_key=' + tmdbAPIKey +
                '&language=en-US&query=' + personName + '&page=1&include_adult=false';
            $.ajax({
                url: URLPerson,
                type: "GET"
            })
            .done(function (data) {
                // TODO: add error for no matches
                $.each(data.results, function (index1, person) {
                    const personItem = $("<article />", {
                        "class": "movie clearfix",
                        "id": person.id,
                        "data-toggle": "modal",
                        "data-target": "#modal"
                    });

                    const personItemImg = $("<div />", {
                        "class": "movie-item-img",
                        "float": "right",
                    });
                    const personItemDetails = $("<div />", {
                        "class": "movie-item-details",
                    });
                    personItemImg.appendTo(personItem);
                    personItemDetails.appendTo(personItem);

                    $("<img>", {
                        "src": "https://image.tmdb.org/t/p/w200" + person.profile_path,
                        "width": "100px",
                        "height": "150px",
                        "onerror": "this.src='img/img_not_found.png'",
                    }).appendTo(personItemImg);

                    $(personItemDetails).append(
                        '<p>\
                            <span class="title">Name: </span>\
                            <span class="desc">' + person.name + '</span>\
                        </p>\
                        <p>\
                            <span class="title">Main Activity: </span>\
                            <span class="desc">' + person.known_for_department + '</span>\
                        </p>'
                    );

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

    // Movie Information - Modal
    function showMovieInfo(id) {
        console.log("showMovieInfo");
        console.log("id", id);

        // Empty the previous Results
        $("#modalInfoContent1").empty();
        $("#modalInfoContent2").empty();
        $("#modalTitle").html("Movie Information");

        const movieId = id;
        const URLMovieInfo = 'https://api.themoviedb.org/3/movie/' + movieId +
                             '?api_key=' + tmdbAPIKey + '&language=en-US';
        $.ajax({
            url: URLMovieInfo,
            type: "GET"
        })
        .done(function (movie) {
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
                    <span class="tag">Link: </span>\
                    <span class="body">\
                        <a href="' + movie.homepage + '" target="_blank">' + movie.homepage + '</a>\
                    </span>\
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

            movieInfo.appendTo($("#modalInfoContent1")); // Add to the DOM element
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
            const movieInfo2 = $("<article />", {
                "class": "movieInfo",
            });

            $(movieInfo2).append(
                '<section>\
                    <span class="tag">List of actors: </span>\
                </section>'
            );

            const tableActorList = $("<table>", {
                "class": "table table-hover table-striped table-actor-list",
            });
            tableActorList.appendTo(movieInfo2);

            $(tableActorList).append(
                    '<thead>' +
                        '<tr>' +
                            '<th>Profile</th>' +
                            '<th>Actor Name</th>' +
                            '<th>Character</th>' +
                        '</tr>' +
                    '<thead>'
            );

            $.each(movieCredits.cast, function (index1, cast) {
                $(tableActorList).append(
                    '<tr>\
                        <td>\
                            <img src="https://image.tmdb.org/t/p/w200' + cast.profile_path + '"\
                                onerror="this.src=\'img/img_not_found.png\'"\
                                class="img-actor-small"/>\
                        </td>\
                        <td>' + cast.name + '</td>\
                        <td>' + cast.character + '</td>\
                    </tr>'
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
                    '<span class="body">' + crew.name + ', ' + '</span>'
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
                        '<span class="body">' + crew.name + ', ' + '</span>'
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
                        '<span class="body">' + crew.name + ', ' + '</span>'
                    );
            });

            $(movieInfo2).append(
                '<section>\
                    <span class="tag">List of Producers: </span>\
                </section>'
            );

            $.each(movieCredits.crew, function (index1, crew) {
                if (crew.job == 'Producer') {
                    $(movieInfo2).append(
                        '<span class="body">' + crew.name + ', ' + '</span>'
                    );
                }
            });

            $(movieInfo2).append(
                '<section>\
                    <span class="tag">List of Music Composers: </span>\
                </section>'
            );

            $.each(movieCredits.crew, function (index1, crew) {
                if (crew.job == 'Music')
                    $(movieInfo2).append(
                        '<span class="body">' + crew.name + ', ' + '</span>'
                    );
            });

            movieInfo2.appendTo($("#modalInfoContent2")); // Add to the DOM element
        })
        .fail(function (data) {
            showError(data.status.toString());
        });
    }

    // Person Information - Modal
    function showPersonInfo(id) {
        console.log("showPersonInfo");
        console.log("id", id);

        // Empty the previous Results
        $("#modalInfoContent1").empty();
        $("#modalInfoContent2").empty();
        $("#modalTitle").html("Person Information");

        const personId = id;
        const URLPersonInfo = 'https://api.themoviedb.org/3/person/' + personId +
            '?api_key=' + tmdbAPIKey + '&language=en-US';
        $.ajax({
            url: URLPersonInfo,
            type: "GET"
        })
        .done(function (person) {
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
                    <span class="body">\
                        <a href="' + person.homepage + '" target="_blank">' + person.homepage + '</a>\
                    </span>\
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

            personInfo.appendTo($("#modalInfoContent1")); // Add to the DOM element
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
            const personInfo = $("<article />", {
                "class": "personInfo",
                "id": personId
            });

            $(personInfo).append(
                '<section>\
                    <span class="tag">List of movies: </span>\
                </section>'
            );

            // Credits for Cast - Table
            if (credits.cast.length > 0) {
                const tableMoviesList = $("<table>", {
                    "class": "table table-hover table-striped table-actor-list",
                });
                tableMoviesList.appendTo(personInfo);

                $(tableMoviesList).append(
                    '<thead>' +
                    '<tr>' +
                    '<th>Poster</th>' +
                    '<th>Movie Title</th>' +
                    '<th>Release Year</th>' +
                    '<th>Role</th>' +
                    '</tr>' +
                    '<thead>'
                );

                $.each(credits.cast, function (index1, cast) {
                    let release_year;
                    if(cast.release_date !== undefined) {
                        release_year = cast.release_date.substring(0,4)
                    } else {
                        release_year = 'unknown'
                    }

                    $(tableMoviesList).append(
                        '<tr>\
                            <td>\
                                <img src="https://image.tmdb.org/t/p/w200' + cast.poster_path + '"\
                                onerror="this.src=\'img/img_not_found.png\'"\
                                class="img-actor-small"/>\
                        </td>\
                        <td>' + cast.title + '</td>\
                        <td>' + release_year + '</td>\
                        <td>' + 'Actor' + '</td>\
                    </tr>'
                    );
                });
            }

            // Credits for Crew - Table
            if (credits.crew.length > 0) {
                const tableMoviesList2 = $("<table>", {
                    "class": "table table-hover table-striped table-actor-list",
                });
                tableMoviesList2.appendTo(personInfo);

                $(tableMoviesList2).append(
                    '<thead>' +
                    '<tr>' +
                    '<th>Poster</th>' +
                    '<th>Movie Title</th>' +
                    '<th>Release Year</th>' +
                    '<th>Role</th>' +
                    '</tr>' +
                    '<thead>'
                );

                $.each(credits.crew, function (index1, crew) {
                    let release_year;
                    if(crew.release_date !== undefined) {
                        release_year = crew.release_date.substring(0,4)
                    } else {
                        release_year = 'unknown'
                    }

                    $(tableMoviesList2).append(
                        '<tr>\
                            <td>\
                                <img src="https://image.tmdb.org/t/p/w200' + crew.poster_path + '"\
                                onerror="this.src=\'img/img_not_found.png\'"\
                                class="img-actor-small"/>\
                        </td>\
                        <td>' + crew.original_title + '</td>\
                        <td>' + release_year + '</td>\
                        <td>' + crew.job + '</td>\
                    </tr>'
                    );
                });
            }

            personInfo.appendTo($("#modalInfoContent2")); // Add to the DOM element
        })
        .fail(function (data) {
            showError(data.status.toString());
        });
    }
});
