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
    const url = "https://api.weather.gov/gridpoints/LWX/37,79/forecast";
    
    try {
        const response = await fetch(url, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });
        if (!response.ok) throw new Error("Weather data not available");

        const data = await response.json();
        const forecast = data.properties.periods[0]; // Get the first forecast period
        
        document.getElementById("weather").innerHTML = `
            <h2>${forecast.name}</h2>
            <p>${forecast.detailedForecast}</p>
            
        `;
    } catch (error) {
        document.getElementById("weather").innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

getWeather();

async function getHourlyWeather() {
    const url = "https://api.weather.gov/gridpoints/LWX/37,79/forecast/hourly";
    
    try {
        const response = await fetch(url, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });
        if (!response.ok) throw new Error("Weather data not available");

        const data = await response.json();
        const periods = data.properties.periods.slice(0, 12); // Get next 12 hours
        
        let output = "<h2>Hourly Forecast</h2>";
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
}

getHourlyWeather();


async function getHumidity() {
    const url = "https://api.weather.gov/gridpoints/LWX/37,79/forecast/hourly";

    try {
        const response = await fetch(url, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });
        if (!response.ok) throw new Error("Weather data not available");

        const data = await response.json();
        const periods = data.properties.periods; // Get forecast periods
        const humidity = periods[0].relativeHumidity.value; // Get current hour's humidity

        document.getElementById("humidity").innerHTML = `
            <h2>Current Humidity</h2>
            <p>${humidity}%</p>
        `;
    } catch (error) {
        document.getElementById("weather").innerHTML = `<p>Error: ${error.message}</p>`;
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


function getLocation(){


    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log("Latitude:", position.coords.latitude);
                console.log("Longitude:", position.coords.longitude);
                x = position.coords.latitude;
                x = ~~x;
                y = position.coords.longitude;
                y = ~~y;
                console.log(x);
                console.log(y);

                //Changing the points to be positive in the case that they are negative
                //need to do this because the API does not accept negative values
                if(y < 0){


                    y = y *-1;

                }
                if(x < 0){

                    x = x * -1;

                }
                console.log(x);
                console.log(y);

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



