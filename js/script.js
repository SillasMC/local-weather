$(document).ready(function() {
    updateWeather();
    var myFunc = setInterval(updateWeather, 300000);

    function updateWeather () {
		var pathName	= "weather-data";

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var url = "https://fcc-weather-api.glitch.me/api/current?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude;

				// Show old cache data, then get new data
				if ('caches' in window) {
					caches.match(pathName).then(function(response) {
						if (response) {
							response.json().then(function updateFromCache(json) {
								updateWeatherView(json);
							});
						}
					});
				}

                $.getJSON(url, function(json_ini) {
					updateWeatherView(json_ini);
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

	function updateWeatherView (json_ini) {
		$("#location-user").html(json_ini.name + ", " + json_ini.sys.country);
		$("#temperature-value-user").html(json_ini.main.temp);
		$("#temperature-unit-change-user").html("C");
		$("#weather-user").html(json_ini.weather[0].main);
		$("#weather-img").attr("src", json_ini.weather[0].icon);
	}

});
