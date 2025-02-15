async function getWeather() {

    const { latitude, longitude } = await getUserLocation();
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    const url = `https://api.weather.gov/points/${latitude},${longitude}`;
    
    try {
        const response = await fetch(url, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });
        if (!response.ok) throw new Error("Weather data not available");

        const data = await response.json();
        console.log(data);
        // const periods = data.properties.periods.slice(0, 12); // Get next 5 hours
        
        // let output = "<h2>Hourly Forecast</h2>";
        // periods.forEach(period => {
        //     output += `
        //         <p>
        //             <strong>${new Date(period.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}:</strong> 
        //             ${period.temperature}Â°${period.temperatureUnit}, ${period.shortForecast}
        //         </p>
        //     `;
        // });

        

       

        document.getElementById("weatherHourly").innerHTML = output;
    } catch (error) {
        document.getElementById("weatherHourly").innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

async function getUserLocation() {
    let location = { latitude: null, longitude: null };
    try {
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error(`Error getting location: ${error.message}`);
    }
    return location;
  }
  
  
  
  

getWeather();