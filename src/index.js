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
  let temp = Math.round(response.data.main.temp);
  let currentDegrees = document.querySelector(".current-degrees");
  currentDegrees.innerHTML = `${temp} °F`;

  let weatherStatus = response.data.weather[0].main;
  let status = document.querySelector(".weather-status");
  status.innerHTML = `${weatherStatus}`.toUpperCase();

  let precipitation = document.querySelector("#precipitation");
  let precipValue = response.data.precipitation;
  if (precipValue === undefined || precipValue === null) {
    precipValue = "0";
  }
  precipitation.innerHTML = `${precipValue} %`;

  let humidity = document.querySelector("#humidity");
  let humidValue = response.data.main.humidity;
  humidity.innerHTML = `${humidValue} %`;

  let wind = document.querySelector("#wind-speed");
  let windSpeed = Math.round(response.data.wind.speed);
  wind.innerHTML = `${windSpeed} MPH`;
}

getKey("New York City");

let search = document.querySelector("#search-bar");
search.addEventListener("submit", searchValue);
