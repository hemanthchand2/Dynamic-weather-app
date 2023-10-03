const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/",
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

const tempToggle = document.getElementById('cb');
tempToggle.addEventListener('change', toggleTemperature);

let isCelsius = true;

// Get user's current location based on IP address
function getCurrentLocation() {
  fetch('https://ipapi.co/json')
    .then(response => response.json())
    .then(data => {
      const { latitude, longitude } = data;
      getResultsByCoordinates(latitude, longitude);
    })
    .catch(error => {
      console.log('Error fetching location:', error);
    });
}

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResultsByCoordinates(lat, lon) {
  fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`)
    .then(weather => {
      return weather.json();
    })
    .then(displayResults);
}

function getResults(query) {
  tempToggle.checked = false
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
      console.log((weather.json.stringify));
      return weather.json();
    })
    .then(displayResults);
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.location .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_max)}°c / ${Math.round(weather.main.temp_min)}°c`;

  setBackground(weather.weather[0].main); // Call the setBackground function
}

function preloadImage(url, callback) {
  const img = new Image();
  img.onload = callback;
  img.src = url;
}

function setBackground(weatherCondition) {
  let body = document.body;

  if (weatherCondition === "Sunny") {
    preloadImage("images/rainy.jpg", () => {
      body.style.backgroundImage = "url('./images/sunny.jpg')";
    });
  } else if (weatherCondition === "Clouds") {
    preloadImage("images/rainy.jpg", () => {
      body.style.backgroundImage = "url('./images/cloudy.jpg')";
    });
  } else if (weatherCondition === "Haze"|| weatherCondition === "Smoke") {
    preloadImage("images/rainy.jpg", () => {
      body.style.backgroundImage = "url('./images/haze.jpg')";
    });
  }else if (weatherCondition === "Rain"|| weatherCondition === "Drizzle") {
    preloadImage("images/rainy.jpg", () => {
      body.style.backgroundImage = "url('./images/rainy.jpg')";
    });
  }else if (weatherCondition === "Clear") {
    preloadImage("images/rainy.jpg", () => {
      body.style.backgroundImage = "url('./images/clear.jpg')";     
    });
  }else {
    console.log("error");
  }
}

function dateBuilder(d) {
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
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}
function toggleTemperature() {
  const tempValue = document.querySelector('.current .temp');
  const hilowValue = document.querySelector('.hi-low');
  const txt = document.querySelector('.btx .stx');

  const currentTemp = parseFloat(tempValue.textContent);
  let convertedTemp;
  let convertedTempMin;
  let convertedTempMax;

  if (isCelsius) {
    // Convert Celsius to Fahrenheit
    convertedTemp = (currentTemp * 9) / 5 + 32;
    tempValue.innerHTML = `${Math.round(convertedTemp)}<span>°F</span>`;
    txt.innerHTML = `<span><h7>in °F</h7></span>`;

    // Convert high and low temperatures
    const [tempMin, tempMax] = hilowValue.innerText.split(' / ');
    convertedTempMin = (parseFloat(tempMin) * 9) / 5 + 32;
    convertedTempMax = (parseFloat(tempMax) * 9) / 5 + 32;
    hilowValue.innerText = `${Math.round(convertedTempMin)}°F / ${Math.round(convertedTempMax)}°F`;
  } else {
    // Convert Fahrenheit to Celsius
    convertedTemp = ((currentTemp - 32) * 5) / 9;
    tempValue.innerHTML = `${Math.round(convertedTemp)}<span>°C</span>`;
    txt.innerHTML = `<span><h7>in °C</h7></span>`;

    // Convert high and low temperatures back to Celsius
    const [tempMin, tempMax] = hilowValue.innerText.split(' / ');
    convertedTempMin = ((parseFloat(tempMin) - 32) * 5) / 9;
    convertedTempMax = ((parseFloat(tempMax) - 32) * 5) / 9;
    hilowValue.innerText = `${Math.round(convertedTempMin)}°C / ${Math.round(convertedTempMax)}°C`;
  }
  isCelsius = !isCelsius; // Toggle temperature unit
}
// Fetch weather for current location when the page loads
getCurrentLocation();
