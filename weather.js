console.log("egwgwegeg");

var x = 0;
var y = 0;

console.log(x);
console.log(y);

/*
function getLocation() {
    return new Promise(function (resolve, reject) {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    console.log("Latitude:", latitude);
                    console.log("Longitude:", longitude);
                    resolve({ latitude: latitude, longitude: longitude });
                },
                function (error) {
                    console.error("Geolocation Error:", error.message);
                    reject(error);
                },
                { enableHighAccuracy: true, maximumAge: 0 }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            reject(new Error("Geolocation not supported"));
        }
    });
}
    */

async function getWeather() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                let x = position.coords.latitude;
                let y = position.coords.longitude;

                console.log("Latitude:", x);
                console.log("Longitude:", y);

                // Ensure we use correct coordinates (do NOT convert to positive)
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
                   
                    for(var i = 0; i < 14; i++){

                        
                        forecast = forecastData.properties.periods[i];
                        
                        forecastDaily += `
                            <h2>${forecast.name}</h2>
                            <p>${forecast.detailedForecast}</p>`;

                        console.log(forecast);
                    }
                    
                    document.getElementById("weather").innerHTML = forecastDaily;

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


async function getHumidity() {
    
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
                    const periods = forecastData.properties.periods;
                    const humidity = periods[0].relativeHumidity.value; // Get current hour's humidity

                    document.getElementById("humidity").innerHTML = `
                        <h2>Current Humidity</h2>
                        <p>${humidity}%</p>
                    `;

                } catch (error) {
                    document.getElementById("humidity").innerHTML = `<p>Error: ${error.message}</p>`;
                }
            },
            function (error) {
                console.error("Error:", error.message);
                document.getElementById("humidity").innerHTML = `<p>Error: ${error.message}</p>`;
            },
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        document.getElementById("humidity").innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
    }
}


getHumidity();

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


getAlert();





