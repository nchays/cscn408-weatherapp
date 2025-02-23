console.log("egwgwegeg");

var x = 0;
var y = 0;

console.log(x);
console.log(y);

async function getWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                let x = position.coords.latitude;
                let y = position.coords.longitude;

                console.log("Latitude:", x);
                console.log("Longitude:", y);

                const url = `https://api.weather.gov/points/${x},${y}`;
                
                try {
                    const response = await fetch(url, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });
                    if (!response.ok) throw new Error("Location data not available");

                    const data = await response.json();
                    console.log("Points Data:", data);
                    const gridX = data.properties.gridX;
                    const gridY = data.properties.gridY;
                    const office = data.properties.gridId;
                    const parts = data.properties.county.split("/");
                    const zoneId = parts[parts.length - 1];
                    console.log(`Zone ID: ${zoneId}`);

                    console.log(`Grid Location: ${office}/${gridX},${gridY}`);

                    const forecastUrl = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`;
                    const forecastResponse = await fetch(forecastUrl, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });

                    if (!forecastResponse.ok) throw new Error("Weather forecast not available");
                    var forecastDaily = ``;
                    var forecastData = await forecastResponse.json();

                    // Check if it is currently night, and if so, subtract 1 from the forecast length
                    var firstPeriod = forecastData.properties.periods[0];
                    var forecastLength = forecastData.properties.periods.length;
                    if (!firstPeriod.isDaytime) {
                        forecastLength -= 1;
                    }

                    for (var i = 0; i < forecastLength; i += 2) {
                        // If not daytime
                        if (!firstPeriod.isDaytime && i == 0) {
                            forecastDaily += 
                            `
                            <div class="forecast-day-card">
                                <div class="forecast-text">
                                    <h2>${firstPeriod.name} - ${firstPeriod.temperature}°</h2>
                                    <p>${firstPeriod.detailedForecast}</p>
                                </div>
                            </div>
                            `;
                            i-=1;
                            continue;
                        }
                        const dayForecast = forecastData.properties.periods[i];
                        console.log(dayForecast);
                        const nightForecast = forecastData.properties.periods[i + 1];
                        console.log(nightForecast);

                        forecastDaily += 
                            `
                            <div class="forecast-day-card">
                                <label class="switch">
                                    <input type="checkbox" class="toggle-forecast" data-index="${i}">
                                    <span class="slider round"></span>
                                </label>
                                <div class="forecast-text">
                                    <h2>${dayForecast.name} - ${dayForecast.temperature}°</h2>
                                    <p>${dayForecast.detailedForecast}</p>
                                </div>
                                <div class="forecast-text-night" style="display: none;">
                                    <h2>${nightForecast.name} - ${nightForecast.temperature}°</h2>
                                    <p>${nightForecast.detailedForecast}</p>
                                </div>
                                
                            </div>
                            `;
                    }
                    
                    document.getElementById("weather").innerHTML = forecastDaily;

                    // Set the bg color of the first card to night if it is night
                    if (!firstPeriod.isDaytime) {
                        document.querySelector('.forecast-day-card').style.backgroundColor = '#865c83';
                    }

                    // Add event listeners to toggle switches
                    document.querySelectorAll('.toggle-forecast').forEach(toggle => {
                        toggle.addEventListener('change', function() {
                            const forecastCard = this.closest('.forecast-day-card');
                            const dayText = forecastCard.querySelector('.forecast-text');
                            const nightText = forecastCard.querySelector('.forecast-text-night');
                            if (this.checked) {
                                dayText.style.display = 'none';
                                nightText.style.display = 'block';
                                forecastCard.style.backgroundColor = '#865c83';
                            } else {
                                dayText.style.display = 'block';
                                nightText.style.display = 'none';
                                forecastCard.style.backgroundColor = '#fffec5';
                            }
                        });
                    });

                    getAlert(zoneId);
                    displayRadar(x, y);

                } catch (error) {
                    document.getElementById("weather").innerHTML = `<p>Error: ${error.message}</p>`;
                }
            },
            function(error) {
                console.error("Error:", error.message);
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

getWeather();

async function getHourlyWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                let x = position.coords.latitude;
                let y = position.coords.longitude;

                console.log("Latitude:", x);
                console.log("Longitude:", y);

                try {
                    // Step 1: Convert lat/lon to NWS grid coordinates
                    const locationUrl = `https://api.weather.gov/points/${x},${y}`;
                    const locationResponse = await fetch(locationUrl, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });
                    if (!locationResponse.ok) throw new Error("Location data not available");

                    const locationData = await locationResponse.json();
                    const gridX = locationData.properties.gridX;
                    const gridY = locationData.properties.gridY;
                    const office = locationData.properties.gridId;

                    console.log(`Grid Location: ${office}/${gridX},${gridY}`);

                    // Step 2: Fetch hourly weather using grid coordinates
                    const forecastUrl = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast/hourly`;
                    const forecastResponse = await fetch(forecastUrl, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });

                    if (!forecastResponse.ok) throw new Error("Hourly weather data not available");

                    const forecastData = await forecastResponse.json();
                    const periods = forecastData.properties.periods.slice(0, 12); // Get next 12 hours

                    let output = "<h1>12 Hour Forecast</h1>";
                    periods.forEach(period => {
                        output += `
                            <p>
                                <strong>${new Date(period.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:</strong> 
                                ${period.temperature}°${period.temperatureUnit}, ${period.shortForecast}
                            </p>
                        `;
                    });

                    document.getElementById("weatherHourly").innerHTML = output;

                } catch (error) {
                    document.getElementById("weatherHourly").innerHTML = `<p>Error: ${error.message}</p>`;
                }
            },
            function (error) {
                console.error("Error:", error.message);
                document.getElementById("weatherHourly").innerHTML = `<p>Error: ${error.message}</p>`;
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        document.getElementById("weatherHourly").innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
    }
}


getHourlyWeather();


async function getCurrentConditions() {
    
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async function (position) {
                let x = position.coords.latitude;
                let y = position.coords.longitude;

                console.log("Latitude:", x);
                console.log("Longitude:", y);

                const currentCity = await coordToCity(x, y);

                try {
                    // Step 1: Convert lat/lon to NWS grid coordinates
                    const locationUrl = `https://api.weather.gov/points/${x},${y}`;
                    const locationResponse = await fetch(locationUrl, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });
                    if (!locationResponse.ok) throw new Error("Location data not available");

                    const locationData = await locationResponse.json();
                    const gridX = locationData.properties.gridX;
                    const gridY = locationData.properties.gridY;
                    const office = locationData.properties.gridId;

                    console.log(`Grid Location: ${office}/${gridX},${gridY}`);

                    // Step 2: Fetch hourly weather data to get humidity
                    const forecastUrl = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast/hourly`;
                    const forecastResponse = await fetch(forecastUrl, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });

                    if (!forecastResponse.ok) throw new Error("Humidity data not available");

                    const forecastData = await forecastResponse.json();
                    const currentConditons = forecastData.properties.periods[0];
                    console.log(currentConditons);
                    const temp = currentConditons.temperature; // Get current hour's temperature
                    const conditions = currentConditons.shortForecast; // Get current hour's conditions
                    const windSpeed = currentConditons.windSpeed; // Get current hour's wind speed
                    const windDirection = currentConditons.windDirection; // Get current hour's wind direction
                    const humidity = currentConditons.relativeHumidity.value; // Get current hour's humidity

                    document.getElementById("current-conditions").innerHTML = `
                        <h1>${currentCity}</h1>
                        <h2>${temp}°</h2>
                        <h3>${conditions}</h3>
                        <div class="extra-weather-info">
                        <p>Wind: ${windSpeed} ${windDirection} | Humidity: ${humidity}%</p>
                    `;

                } catch (error) {
                    document.getElementById("current-conditions").innerHTML = `<p>Error: ${error.message}</p>`;
                }
            },
            function (error) {
                console.error("Error:", error.message);
                document.getElementById("current-conditions").innerHTML = `<p>Error: ${error.message}</p>`;
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        document.getElementById("current-conditions").innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
    }
}


getCurrentConditions();

async function getAlert(zoneId) {

    //url that gets the alerts currently for a state
    const url = `https://api.weather.gov/alerts/active/zone/${zoneId}`

    try {
        const response = await fetch(url, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" }});
        if (!response.ok) throw new Error("Weather data not available");

        const data = await response.json();
        console.log("Alert Data:", data);
        const alert = data.features[0];//stores the data of the alert into alert variable

        if (alert) {

            //printing of the alert to the webpage
            document.getElementById("alert").innerHTML = `
                <h2>${alert.properties.event}</h2>
                <p>${alert.properties.description}</p>
            `;
        }
        else {
            document.getElementById("alert").innerHTML = `<p>No alerts at this time.</p>`;//if there are no alerts, it will print no alerts
        }

    } catch (error) {
        document.getElementById("alert").innerHTML = `<p>Error: ${error.message}</p>`;//error if the API was not successful in grabbing the info
    }




}

function displayRadar(x, y) {

  const radarHtml = `<iframe src="https://www.rainviewer.com/map.html?loc=${x},${y},6.0575509300693895&oCS=1&c=3&o=83&lm=1&layer=radar&sm=1&sn=1" width="100%" frameborder="0" style="border:0;height:50vh;" allowfullscreen></iframe>`
  
  document.getElementById("radar").innerHTML = radarHtml;
}


async function coordToCity(lat, long) {
    const url = `https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;
                
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("Location data not available");

                    const data = await response.json();
                    const city = data.city;

                    console.log(`City: ${city}`);

                    return city;
                } 
                catch (error) {
                    return error.message;
                }
}


