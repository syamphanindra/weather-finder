$("#search_box").keyup(function() {
    destroyAllElements();
    var current_val = $(this).val();
    current_val = current_val + "";
    if (current_val.length < 3) {
        return;
    }
    parentDiv = document.getElementById("autocomplete-list");

    var displaySuggestions = function(predictions, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
            alert("No Locations found");
            return;
        }
        predictions.forEach(function(prediction) {
            childDiv = document.createElement("DIV");
            childDiv.setAttribute("class", "autocomplete-item");
            childDiv.innerHTML = prediction.description;
            childDiv.addEventListener("click", function(e) {
                destroyAllElements();
                $("#search_box").data('placeid', prediction.place_id);
                $('#search_box').val(prediction.description);
            });
            parentDiv.appendChild(childDiv);
        });
    };
    var service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({
            input: current_val,
            types: ['(cities)']
        },
        displaySuggestions);
});

$('#search_button').click(function() {
    var location = $("#search_box").val();
    loc_arr = location.split(",");
    var apiKey = "apiKey";
    var language = "en";
    var currentConditionsUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + loc_arr[0] + "&APPID=0b342327ef19bec49a60a0d6f7dbf1c7";
    $.get(currentConditionsUrl, function(data, status) {
            console.log(status);
            console.log(data);
            var temp = (data.main.temp - 273.15).toFixed(2) + " Celsius";
            var curr_date = getTimeZoneTime(data.timezone);
            $('#condition').text("Weather: " + data.weather[0].main);
            $('#temp').text("Temparature: " + temp);
            $('#time').text("Time: " + curr_date);
        })
        .fail(function(data, textStatus) {
            $('#condition').text("Weather: " + "");
            $('#temp').text("Temparature: " + "");
            $('#time').text("Time: " + "");
            alert("Following location not supported by weather api");
        });
});

function getTimeZoneTime(offset) {
    var curr_date = new Date();
    var utc = curr_date.getTime() + (curr_date.getTimezoneOffset() * 60000);
    var timezoneTime = new Date(utc + (1000 * offset));
    return timezoneTime;
}

function destroyAllElements() {
    autocomplete_data = document.getElementById("autocomplete-list");
    autocomplete_data.innerHTML = "";
}
