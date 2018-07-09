$(document).ready(function () {
    // Basic URL with application-key for search 
    var URL = "http://api.eventful.com/json/events/search?app_key=5gPscV7SZB2jTK6n"
    var URL2 = "http://api.musixmatch.com/ws/1.1/track.search?apikey=502a6b05dfefae386639fa1c47212aa3"
    var URL3 = "http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=502a6b05dfefae386639fa1c47212aa3"

    // List of some global variables!!

    var queryURL = ""; // place holder for Actual Query


    var artist = ""; // place holder for artist name
    var location = ""; // place holder for event locaton
    var date = ""; // place holder for date


    // When user enters the information and clicks the button 
    $("#picture").empty();
    $("#submit").on("click", function () {
        event.preventDefault(); // prevent the default action

        // a fucntion which will detect which information has been entered ,
        // which will be used to build the URL
        var parameter = getParameter();

        //once we have parameter, we can create Query URL 
        // Page sze is to limit only one event at a time
        queryURL = URL + parameter + "&page_size=10";
        queryURL2 = URL2 + "&q_track=" + $("#lyric").val() + "&q_artist=" + artist;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: 'GET',
            crossDomain: true,
            dataType: 'jsonp',
        }).then(function (response) {
            $("#picture").empty();

            for (var i = 0; i < response.events.event.length; i++) {

                var information = $("<div>");
                information.addClass("text-center");
                var result = response.events.event[i];
                if (result.image != null) {
                    var imgResponse = result.image.medium.url;
                    console.log(imgResponse);
                    var image = $("<img>");
                    image.attr("src", imgResponse);
                    image.addClass("icon");
                    information.append(image);
                }
                //   $("#picture").append(image);}
                //   $("#picture").append("Venue :" + result.venue_name);
                information.append("<br>");
                information.append("Title : <strong>" + result.title + "</strong><br>");
                information.append("venue : <strong>" + result.venue_name + "</strong><br>");
                information.append("Address : " + result.venue_address + "<br>");
                information.append("City  : <strong>" + result.city_name + "</strong><br>");
                information.append("Country : <strong>" + result.country_name + "</strong><br>");
                information.append("Date & Time : " + result.start_time + "<br>");
                information.append("<hr class=\"bg-warning\">");
                $("#picture").prepend(information);
            }
        });
        console.log('second api call');
        $.ajax({
            url: 'https://cors-anywhere.herokuapp.com/' + queryURL2,
            method: 'GET',

        }).then(function (result) {
            console.log('query2 result', JSON.parse(result));
            // var information = $("<div>");
            // information.addClass("text-center");
            // var trackresult = result.track.track_name;
            var possibleTracks = JSON.parse(result).message.body.track_list;
            console.log('possibleTracks', possibleTracks);
            var firstPossible = possibleTracks.find(function (track) {
                console.log('track.track.has_lyrics', track.track.has_lyrics);
                if (track.track.has_lyrics !== 0) {
                    return true;
                }
                return false;
            })

            console.log('firstPossible', firstPossible);
            console.log('calling...', 'https://cors-anywhere.herokuapp.com/' + URL3 + "&track_id=" + firstPossible.track.track_id);
            $.ajax({
                url: 'https://cors-anywhere.herokuapp.com/' + URL3 + "&track_id=" + firstPossible.track.track_id,
                method: 'GET'
            }).then(function (result) {
                //console.log('result from lyrics search', result);
                var resultToDisplay = JSON.parse(result);
                console.log('resultToDisplay', resultToDisplay);
                console.log('lyrics', resultToDisplay.message.body.lyrics.lyrics_body);
                lyricResponse = resultToDisplay.message.body.lyrics.lyrics_body.toString();
                //lyricDisplay = $("<strong></strong>").html(lyricResponse);
                information.append(lyricResponse);

            })

            // track.track_name
        });
    });

    function getParameter() {
        //reading value from the form
        // these variables are already decalred on top *** GLOBAL Variable****
        artist = $("#artist-name").val().trim();
        location = $("#location").val().trim();
        date = $("#date").val();

        // a local variable Parameter
        var parameter = "";

        //clearing all three fields
        $("#artist-name").val("");
        $("#location").val("");
        $("#date").val("");
        // lets detect which information has been entered
        // and return the search parameter
        if (artist != "") {
            // artist value is not null , user entered the artist name
            // search should be by artist
            parameter = "&keywords=" + artist;
        } else if (location != "") {
            // if artist value is null and location value is not null 
            parameter = "&keywords=" + location;

        } else if (date != "") {
            parameter = "&keywords=" + date;
        } else {
            //ignore
        }
        return parameter;
    }
});