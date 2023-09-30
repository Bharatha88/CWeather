 const cityInput = document.querySelector(".city-input");
 const searchButton  = document.querySelector(".search-btn");
 const locationButton  = document.querySelector(".location-btn");
 const currentWeatherDiv = document.querySelector(".current-weather");
 const weatherCardDiv = document.querySelector(".weather-cards");

 //API key for the main weather card
 const API_key ="d38eefc85e5548c8f30b6a6593d6b059";
//HTML for the main weather card
 const createWeatherCard = (cityName,weatherItem,index) => {
    if(index === 0){
        return`<div class="details">
                    <h2>${cityName}(${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    }else{
        return  `<li class="card">
                 <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>   
                 <img src="http://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">  
                 <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                 <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                 <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                 </li> `;

    }
    
 }

 const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        
               
        //Filter the forecast to get only one forecat per day
        const uniqueForecastDays = [];
        const threeDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);

            }
        });

        //Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardDiv.innerHTML = "";

        //Creating weather card and adding DOM model
         
        threeDaysForecast.forEach((weatherItem, index ) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
            } else{
                weatherCardDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem, index));
            }
           
        });

    }).catch(() => {
        alert("An error occured while fetching the weather forecast!");
    }); 
}

 const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCORDING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;

    // get entered city coordinate(latitute,longtude and name) from the API response
    fetch(GEOCORDING_API_URL).then(res => res.json()).then(data => {
        if(!data.length)return alert(`no cordinates found for ${cityName}`)
        const{ name, lat, lon }= data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the cordinates!");
    });
 }

 const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitute } = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            //Get city name from reverse geocording API
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const{ name }= data[0];
                getWeatherDetails(name, latitude, longitute);
            }).catch(() => {
                alert("An error occurred while fetching the city!");
            });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED)
                alert("Geolocation request denied.please reset location permission to grant access again")
        }
    );
 }

 locationButton.addEventListener("click",getUserCoordinates);
 searchButton.addEventListener("click",getCityCoordinates);
 cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
