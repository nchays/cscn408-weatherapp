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
                    const gridX = data.properties.gridX;
                    const gridY = data.properties.gridY;
                    const office = data.properties.gridId;

                    console.log(`Grid Location: ${office}/${gridX},${gridY}`);

                    const forecastUrl = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`;
                    const forecastResponse = await fetch(forecastUrl, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });

                    if (!forecastResponse.ok) throw new Error("Weather forecast not available");
                    var forecastDaily = ``;
                    var forecastData = await forecastResponse.json();
                    var forecast;

                    for (var i = 0; i < forecastData.properties.periods.length; i += 2) {
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

                    let output = "<h2>Hourly Forecast Today</h2>";
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
                    const humidity = currentConditons.relativeHumidity.value; // Get current hour's humidity

                    document.getElementById("current-conditions").innerHTML = `
                        <p>${temp}</p>
                        <p>${humidity}%</p>
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

async function getAlert() {

    //url that gets the alerts currently for a state
    const url = "https://api.weather.gov/alerts/active?area=VA"

    try {
        const response = await fetch(url, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" }});
        if (!response.ok) throw new Error("Weather data not available");

        const data = await response.json();
        const alert = data.features[0];//stores the data of the alert into alert variable

        //printing of the alert to the webpage
        document.getElementById("alert").innerHTML = `
            <h2>${alert.properties.event}</h2>
            <p>${alert.properties.description}</p>
        `;

    } catch (error) {
        document.getElementById("alert").innerHTML = `<p>Error: ${error.message}</p>`;//error if the API was not successful in grabbing the info
    }




}

function displayRadar(x, y) {

  const radarHtml = `<iframe src="https://www.rainviewer.com/map.html?loc=${x},${y},6.0575509300693895&oCS=1&c=3&o=83&lm=1&layer=radar&sm=1&sn=1" width="100%" frameborder="0" style="border:0;height:50vh;" allowfullscreen></iframe>`
  
  document.getElementById("radar").innerHTML = radarHtml;
}


getAlert();





