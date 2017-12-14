$(document).ready(function() {

	const TIME_INTERVAL = 300000;
    updateWeather();
	var myFunc = setInterval(updateWeather, TIME_INTERVAL);

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

					var options = {
						body:		'Temperature in ' + json_ini.name + ' is ' + json_ini.main.temp + '!',
						icon:		json_ini.weather[0].icon,
						vibrate:	[100, 50, 100],
						data:		{
							dateOfArrival:	Date.now(),
							primaryKey:		1
						}
					};
					displayNotification('Local Weather App', options);
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
			$("#temperature-value-user").html(round(far));
            $("#temperature-unit-change-user").html("F");
        }
        else {
            var cel = ($("#temperature-value-user").text() - 32) * 5/9;
			$("#temperature-value-user").html(round(cel));
            $("#temperature-unit-change-user").html("C");
        }
    });

	function updateWeatherView (json_ini) {
		$("#location-user").html(json_ini.name + ", " + json_ini.sys.country);
		$("#temperature-value-user").html(round(json_ini.main.temp));
		$("#temperature-unit-change-user").html("C");
		$("#weather-user").html(json_ini.weather[0].main);
		$("#weather-img").attr("src", json_ini.weather[0].icon);
	}

	function displayNotification (title, options) {
		if (Notification.permission == 'granted') {
			navigator.serviceWorker.getRegistration().then(function(reg) {
				reg.showNotification(title, options);
			});
		}
	}

	function round(value) {
		return Number(Math.round(value+'e1')+'e-1');
	}
});
