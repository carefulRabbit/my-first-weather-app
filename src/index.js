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

let now = new Date();
//function to display current day and time
function dayTime() {
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayDate = now.getDay();
  if (dayDate < 10) {
    dayDate = `0${dayDate}`;
  }
  let monthDate = now.getMonth();
  if (monthDate < 10) {
    monthDate = `0${monthDate}`;
  }
  let year = now.getFullYear();

  let currentTime = document.querySelector("#current-time");
  let currentDate = document.querySelector("#current-date");
  let currentDay = document.querySelector("#current-day");

  currentDay.innerHTML = `${day}`;
  currentTime.innerHTML = `${hours}:${minutes}  /`;
  currentDate.innerHTML = `${dayDate}-${monthDate}-${year}`;
}
dayTime();

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  return days[day];
}

//function to update city value based on searchbar input
//function to display current temp based on searchbar input
function getKey(city) {
  let apiKey = "a52091a58e6937902960aa5c31a3295d";
  let units = "imperial";
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(currentTemp);
}

function searchValue(event) {
  event.preventDefault();
  let city = document.querySelector("#city-name");
  let searchInput = document.querySelector("#search-input");
  let searchCity = searchInput.value;
  getKey(searchCity);
  city.innerHTML = searchCity;
}

function currentTemp(response) {
  baseTemperature = response.data.main.temp;
  let temp = Math.round(baseTemperature);
  let tempElement = document.querySelector(".current-degrees");
  tempElement.innerHTML = `${temp}`;

  let weatherStatus = response.data.weather[0].main;
  let statusElement = document.querySelector(".weather-status-name");
  statusElement.innerHTML = `${weatherStatus}`.toUpperCase();

  let precipitationElement = document.querySelector("#precipitation");
  let precipValue = response.data.precipitation;
  if (precipValue === undefined || precipValue === null) {
    precipValue = "0";
  }
  precipitationElement.innerHTML = `${precipValue} %`;

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

  getForecast(response.data.coord);
}

function celciusConvert(event) {
  event.preventDefault();
  let celciusTemperature = (baseTemperature - 32) / 1.8;
  let tempElement = document.querySelector(".current-degrees");
  tempElement.innerHTML = Math.round(celciusTemperature);
  farenheit.classList.remove("active");
  celcius.classList.add("active");
}

function farenheitRevert(event) {
  event.preventDefault();
  let tempElement = document.querySelector(".current-degrees");
  tempElement.innerHTML = Math.round(baseTemperature);
  farenheit.classList.add("active");
  celcius.classList.remove("active");
}

function getForecast(coordinates) {
  let apiKey = "a52091a58e6937902960aa5c31a3295d";
  let units = "imperial";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayForecast);
}

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
              <span>${formatDay(forecastDay.dt)}</span>
              <div>
                ${Math.round(forecastDay.temp.max)}°F / ${Math.round(
          forecastDay.temp.min
        )}°F
                <div>
                  <img
                    src="http://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png"
                    alt="weather"
                    style="width: 30px"
                  />
                </div>
              </div>
              
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
