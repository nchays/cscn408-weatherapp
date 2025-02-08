console.log("egwgwegeg");
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
        const periods = data.properties.periods.slice(0, 12); // Get next 5 hours
        
        let output = "<h2>Hourly Forecast</h2>";
        periods.forEach(period => {
            output += `
                <p>
                    <strong>${new Date(period.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:</strong> 
                    ${period.temperature}Â°${period.temperatureUnit}, ${period.shortForecast}
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