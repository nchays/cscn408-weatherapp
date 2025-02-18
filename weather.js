async function getWeather() {

    const { latitude, longitude } = await getUserLocation();
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    const url = `https://api.weather.gov/points/${latitude},${longitude}`;
    
    try {
        const response = await fetch(url, { headers: { "User-Agent": "MyWeatherApp/1.0 (myemail@example.com)" } });
        if (!response.ok) throw new Error("Weather data not available");

        const data = await response.json();
        console.log(data);

        const radarHtml = `<iframe src="https://www.rainviewer.com/map.html?loc=${latitude},${longitude},6.0575509300693895&oCS=1&c=3&o=83&lm=1&layer=radar&sm=1&sn=1" width="100%" frameborder="0" style="border:0;height:50vh;" allowfullscreen></iframe>`;

        document.getElementById("weather").innerHTML = radarHtml;
    } catch (error) {
        document.getElementById("weather").innerHTML = `<p>Error: ${error.message}</p>`;
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