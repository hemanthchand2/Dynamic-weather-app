const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/",
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

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
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

  setBackground(weather.weather[0].main); // Call the setBackground function
}

function setBackground(weatherCondition) {
  let body = document.body;

  if (weatherCondition === "Sunny") {
    body.style.backgroundImage = "url('images/sunny.jpg')";
  } else if (weatherCondition === "Clouds") {
    body.style.backgroundImage = "url('images/cloudy.jpg')";
  } else if (weatherCondition === "Haze"||"Smoke") {
    body.style.backgroundImage = "url('images/haze.jpg')";
  }else if (weatherCondition === "Rain") {
    body.style.backgroundImage = "url('images/rainy.jpg')";
  }else if (weatherCondition === "Clear") {
    body.style.backgroundImage = "url('images/clear.jpg')";
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

// Fetch weather for current location when the page loads
getCurrentLocation();
