let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//function to convert day/time codes into readable values for forecast
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  return days[day];
}

//function to display current day and time + attempt at nightmode
function formatTime(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = days[date.getDay()];
  let hours = date.getHours();
  if (hours < 24 && hours > 18) {
    let style = document.createElement(`style`);
    style.innerHTML = `:root { 
  --clr-light-100: #22313fce ;
  --clr-med-light-300: #34495e ;
  --clr-med-dark-500: #8dc6ff8e;
  --clr-dark-700: #fbfcfd;
    }`;
    let ref = document.querySelector(`script`);
    ref.parentNode.insertBefore(style, ref);
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayDate = date.getDay();
  if (dayDate < 10) {
    dayDate = `0${dayDate}`;
  }
  let monthDate = date.getMonth();
  if (monthDate < 10) {
    monthDate = `0${monthDate}`;
  }
  let year = date.getFullYear();
  let currentTime = document.querySelector("#current-time");
  let currentDate = document.querySelector("#current-date");
  let currentDay = document.querySelector("#current-day");

  currentDay.innerHTML = `${day}`;
  currentTime.innerHTML = `${hours}:${minutes}  /`;
  currentDate.innerHTML = `${dayDate}-${monthDate}-${year}`;
}

//api current weather call
function getKey(city) {
  let apiKey = "a52091a58e6937902960aa5c31a3295d";
  let units = "imperial";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(currentTemp);
}

//function to display search input as value on page
function searchValue(event) {
  event.preventDefault();
  let city = document.querySelector("#city-name");
  let searchInput = document.querySelector("#search-input");
  let searchCity = searchInput.value;
  getKey(searchCity);
  city.innerHTML = searchCity;
}

//function to set all of the current weather data
function currentTemp(response) {
  baseTemperature = response.data.main.temp;
  let temp = Math.round(baseTemperature);
  let tempElement = document.querySelector(".current-degrees");
  tempElement.innerHTML = `${temp}`;

  let weatherStatus = response.data.weather[0].main;
  let statusElement = document.querySelector(".weather-status-name");
  statusElement.innerHTML = `${weatherStatus}`.toUpperCase();

  let feelsLikeElement = document.querySelector("#feels-like");
  let feelValue = Math.round(response.data.main.feels_like);
  console.log(response.data);

  feelsLikeElement.innerHTML = `${feelValue} °F`;

  let humidityElement = document.querySelector("#humidity");
  let humidValue = response.data.main.humidity;
  humidityElement.innerHTML = `${humidValue} %`;

  let windElement = document.querySelector("#wind-speed");
  let windSpeed = Math.round(response.data.wind.speed);
  windElement.innerHTML = `${windSpeed} MPH`;

  let iconElement = document.querySelector("#status-img");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  formatTime(response.data.dt);
  getForecast(response.data.coord);
}

//api forecast call
function getForecast(coordinates) {
  let apiKey = "a52091a58e6937902960aa5c31a3295d";
  let units = "imperial";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayForecast);
}

//function to display forecast data and inject into page
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
            <div class="forecast">
              <span class="light-day">${formatDay(forecastDay.dt)}</span>
              <div>
                ${Math.round(
                  forecastDay.temp.max
                )}°F / <span class="light-temp">${Math.round(
          forecastDay.temp.min
        )}°F</span>
                <div>
                  <img
                    src="http://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png"
                    alt="weather"
                    style="width: 35px"
                  />
                </div>
              </div>
              <div>${forecastDay.weather[0].main.toUpperCase()}</div>
            </div>
          </div>
          `;
    }
  });
  forecastHTML = forecastHTML + "</div>";

  forecastElement.innerHTML = forecastHTML;
}

let baseTemperature = null;

let search = document.querySelector("#search-bar");
search.addEventListener("submit", searchValue);
let searchButton = document.querySelector("#location");
searchButton.addEventListener("click", searchValue);

getKey("New York City");
