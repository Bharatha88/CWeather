 const cityInput = document.querySelector(".city-input");
 const searchButton  = document.querySelector(".search-btn");

 const API_key ="d38eefc85e5548c8f30b6a6593d6b059";

 const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}appid=${API_key}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        console.log(data);
    }).catch(() => {
        alert("An error occured while fetching the weather forecast!");
    }); 
}

 const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCORDING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;

    // get entered city coordinate(latitute,longtude and name) from the API response
    fetch(GEOCORDING_API_URL).then(res=> res.json()).then(data => {
        if(!data.length)return alert(`no cordinates found for ${cityName}`)
        const{ name, lat, lon }= data[0];
    getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the cordinates!");
    });
 }

 searchButton.addEventListener("click",getCityCoordinates);
