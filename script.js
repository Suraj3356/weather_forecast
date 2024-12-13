const cityInput = document.querySelector(".city-input")
const searchButton = document.querySelector(".search-btn")
const locationButton = document.querySelector(".Location-btn")
const weatherCardDiv = document.querySelector(".weather-cards")
const currentWeatherDiv = document.querySelector(".current-weather")


const API_KEY = "3406bed25d0417b2e84a88ab57478de0";

const createweatherCard = (cityName, weatherItem , index) =>{
    if(index === 0){  // HTML for the main weather card
        return ` <div class="details">
                    <h2>${cityName}(${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind:${(weatherItem.wind.speed)}M/S</h4>
                    <h4>Humidity:${(weatherItem.main.humidity)}%</h4>
                </div>
                <div class="icon">
                 <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather-Icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;

    } 
    
    
    else { 
        return `<li class="card">

        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather-Icon">
        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind:${(weatherItem.wind.speed)}M/S</h4>
        <h4>Humidity:${(weatherItem.main.humidity)}%</h4>
        </li>`;
      }

    }
   

const getWeatherDetails = (cityName,lat,lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data =>{
        //Filter the forecast to gt only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast =>{
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });

        //clreaing previous data
        cityInput.value = "";
        weatherCardDiv.innerHTML = "";
        currentWeatherDiv.innerHTML ="";

        // creating weather card and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem,index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createweatherCard(cityName ,weatherItem, index) );
            }
             else {
                     weatherCardDiv.insertAdjacentHTML("beforeend", createweatherCard(cityName, weatherItem ,index) );
            }
        });
           
    }).catch(() =>{

        alert("An occurred while fetching the weather forecast!");
    })

}

const getCityCoordinates = () =>{
    const cityName = cityInput.value.trim(); // get user enternd city name and remove extra space

    if(!cityName) return;  // return city name is empty
    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
  

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
        if(!data.length)return  alert(`No coordinates found for ${cityName}`);
        const { name,lat,lon} = data[0];
        getWeatherDetails(name,lat,lon);
        
    }).catch(() =>{

        alert("An occurred while fetching the coordinates!");
    });

}

    const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition (
        position => {
            const { latitude, longitude,} = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            // get city name from coordinates using revers geocoding api

            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
                const { name } = data[0];
                getWeatherDetails(name,latitude,longitude);
                   
            }).catch(() => {
                alert("An occurred while fetching the city!");
            });
        },
        error => { // show alert if user denied the location permission
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access")
            }
        }
    );
}



locationButton.addEventListener("click",getUserCoordinates);
searchButton.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());