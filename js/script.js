$(document).ready(function() {
    updateWeather();
    var myFunc = setInterval(function() { updateWeather(); }, 300000);

    function updateWeather () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log("latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude);
                var url = "https://fcc-weather-api.glitch.me/api/current?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;
                console.log(url);

                $.getJSON(url, function(json_ini) {
                    $("#location-user").html(json_ini.name + ", " + json_ini.sys.country);
                    $("#temperature-value-user").html(json_ini.main.temp);
                    $("#temperature-unit-change-user").html("C");
                    $("#weather-user").html(json_ini.weather[0].main);
                    $("#weather-img").attr("src", json_ini.weather[0].icon);
                });
            });
        }
        else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    $("#temperature-unit-change-user").on("click", function(){
        if ($("#temperature-unit-change-user").text() === "C") {
            var far = ($("#temperature-value-user").text() * 9/5) + 32;
            $("#temperature-value-user").html(far);
            $("#temperature-unit-change-user").html("F");
        }
        else {
            var cel = ($("#temperature-value-user").text() - 32) * 5/9;
            $("#temperature-value-user").html(cel);
            $("#temperature-unit-change-user").html("C");
        }
    });

});
