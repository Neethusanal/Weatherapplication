
const apiKey = "d3191b5c4df3607337477078d93a9e70";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";


const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherCard = document.querySelector(".weather");
const errorMsg = document.querySelector(".error p");
const weatherIcon = document.querySelector(".weather-icon");
const tempEl = document.querySelector(".temp");
const cityEl = document.querySelector(".city");
const humidityEl = document.querySelector(".humidity");
const windEl = document.querySelector(".wind");

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
         console.log(data,"data from api")
        updateUI(data);
        getForecast(city); 

        localStorage.setItem("lastCity", city);
    } catch (error) {
        showError(error.message);
        forecastContainer.innerHTML = ""; 
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
    let icon = "clear.png"; 
    if (weather.includes("rain")) icon = "rain.png";
    else if (weather.includes("clear")) icon = "clear.png";
    else if (weather.includes("snow")) icon = "snow.png";
    else if (weather.includes("clouds")) icon = "cloud.png";
    else if (weather.includes("storm")) icon = "storm.png";
    else if (weather.includes("mist")) icon = "mist.png";
    else if (weather.includes("drizzle")) icon = "drizzle.png";

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

const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=";
const forecastContainer = document.querySelector(".forecast-cards");


async function getForecast(city) {
    try {
        const response = await fetch(`${forecastUrl}${city}&units=metric&appid=${apiKey}`);
        if (!response.ok) throw new Error("Forecast not found");

        const data = await response.json();
        updateForecast(data);
    } catch (error) {
        forecastContainer.innerHTML = `<p style="color:red">${error.message}</p>`;
    }
}


function updateForecast(data) {
    forecastContainer.innerHTML = "";

  
    const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        const date = new Date(day.dt_txt);
        const options = { weekday: "short" };
        const dayName = new Intl.DateTimeFormat("en-US", options).format(date);

        const weather = day.weather[0].main.toLowerCase();
        let icon = "cloud.png";
        if (weather.includes("rain")) icon = "rain.png";
        else if (weather.includes("clear")) icon = "clear.png";
        else if (weather.includes("snow")) icon = "snow.png";
        else if (weather.includes("cloud")) icon = "cloud.png";
        else if (weather.includes("storm")) icon = "storm.png";

        const card = document.createElement("div");
        card.classList.add("forecast-card");
        card.innerHTML = `
            <p>${dayName}</p>
            <img src="images/${icon}" alt="${weather}">
            <p>${Math.round(day.main.temp)}°C</p>
        `;
        forecastContainer.appendChild(card);
    });
}
