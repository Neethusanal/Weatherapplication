// JS/Script.js

// -------------------- API CONFIG --------------------
const apiKey = "d3191b5c4df3607337477078d93a9e70";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

// -------------------- DOM ELEMENTS --------------------
const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherCard = document.querySelector(".weather");
const errorMsg = document.querySelector(".error p");
const weatherIcon = document.querySelector(".weather-icon");
const tempEl = document.querySelector(".temp");
const cityEl = document.querySelector(".city");
const humidityEl = document.querySelector(".humidity");
const windEl = document.querySelector(".wind");

// -------------------- LOADING STATE --------------------
function showLoading() {
    tempEl.textContent = "Loading...";
    weatherIcon.style.display = "none";
    errorMsg.style.display = "none";
    weatherCard.style.display = "block";
}


async function getWeather(city) {
    showLoading();
    try {
        const response = await fetch(`${apiUrl}${city}&units=metric&appid=${apiKey}`);
        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        updateUI(data);

        // Save user preference
        localStorage.setItem("lastCity", city);
    } catch (error) {
        showError(error.message);
    }
}


function updateUI(data) {
    weatherCard.style.display = "block";
    errorMsg.style.display = "none";

    tempEl.textContent = `${Math.round(data.main.temp)}°C`;
    cityEl.textContent = data.name;
    humidityEl.textContent = `${data.main.humidity}%`;
    windEl.textContent = `${Math.round(data.wind.speed)} km/hr`;

    const weather = data.weather[0].main.toLowerCase();
    let icon = "cloud.png"; // default icon
    if (weather.includes("rain")) icon = "rain.png";
    else if (weather.includes("clear")) icon = "clear.png";
    else if (weather.includes("snow")) icon = "snow.png";
    else if (weather.includes("cloud")) icon = "cloud.png";
    else if (weather.includes("storm")) icon = "storm.png";

    weatherIcon.src = `images/${icon}`;
    weatherIcon.style.display = "block";
}


function showError(message) {
    weatherCard.style.display = "none";
    errorMsg.style.display = "block";
    errorMsg.textContent = message;
}


searchBtn.addEventListener("click", () => {
    const city = searchInput.value.trim();
    if (city) getWeather(city);
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = searchInput.value.trim();
        if (city) getWeather(city);
    }
});


window.addEventListener("load", () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        getWeather(lastCity);
        searchInput.value = lastCity;
    }
});
