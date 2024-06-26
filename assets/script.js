// API KEY: for weather access:
const APIKey = "78506e3c00a53204a2691e069931f836";

//Define variables for use in functions.
const userCity = document.querySelector("#searchCity");
const searchButton = document.querySelector(".searchButton");
const weatherForecast = document.querySelector(".forecastToday");
const cityHistory = document.querySelector(".searchHistory");
const renderCards = document.querySelector(".renderCards");

// call to retrieve local storage and render cards
renderCityHistory();

// Fetch request to OpenWeather API
function getCity(city) {
    const weatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    // added to for debug purposes
    console.log('City:', city)
    console.log('API:', APIKey)
    console.log('Api URL:', weatherQueryURL)

    
    fetch(weatherQueryURL)
        .then((response) => response.json())
        .then((data) => {
            // functions to render current weather
            renderWeather(data);
            saveLocal(city);
            retrieveForecast(city);
        })
        .catch((error) => {
            console.log("Error In API call:", error);
            alert("City not found. Please try again." + city);
        });
}

// Retrieve five day forecast
const retrieveForecast = (city) => {
    const forecastQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;

    fetch(forecastQueryUrl)
        .then((response) => response.json())
        .then((data) => {
            renderForecast(data);
        })
        .catch((error) => {
            console.error("Error in fetching forecast:", error);
            alert("Please try again Data Not Found For." + city);
        });
};

const renderWeather = (data) => {
    // added to for debug purposes
    if( !data.main || !data.weather || !data.weather[0]) {
        console.error("Error in fetching data:", data);
        return;
    }

    let liveDate = new Date().toLocaleDateString();
    const tempF = (data.main.temp - 273.15) * 1.8 + 32;
    const weatherIcon = data.weather[0].icon;
    const iconURL = `http://openweathermap.org/img/w/${weatherIcon}.png`;

    const createIcon = document.createElement("img");
    createIcon.src = iconURL;
    createIcon.alt = "Weather Icon for Today";

    weatherForecast.innerHTML = `
        <h1 class="fw-bold m-2">${data.name} (${liveDate})</h1>
        <div>${createIcon.outerHTML}</div>
        <p class="m-2">Temperature: ${tempF.toFixed(2)} °F
        </br>Wind Speed: ${data.wind.speed} MPH 
        </br>Humidity: ${data.main.humidity}%</p>`;
};

// Render five day forecast
const renderForecast = function (data) {
    renderCards.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const forecast = data.list[i * 8];
        const date = new Date();
        date.setDate(date.getDate() + (i + 1));
        const tempF = (forecast.main.temp - 273.15) * 1.8 + 32;
        const weatherIcon = forecast.weather[0].icon;
        const iconURL = `http://openweathermap.org/img/w/${weatherIcon}.png`;

        const createIcon = document.createElement("img");
        createIcon.src = iconURL;
        createIcon.alt = "Weather icon";

        const card = document.createElement("div");
        card.classList.add("card", "m-3");
        card.innerHTML = `
        <h4>${date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
        })}</h4> 
            <div>${createIcon.outerHTML}</div>
            <p>Temp: </br>${tempF.toFixed(2)}°F</p>
            <p>Wind: </br>${forecast.wind.speed} MPH</p>
            <p>Humidity: </br>${forecast.main.humidity}%`;

        renderCards.appendChild(card);
    }
};

// Save search history to local storage
function saveLocal(city) {
    const cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
    if (!cityHistory.includes(city)) {
        cityHistory.unshift(city);
        localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
        renderCityButton(city);
    }
}


// Render search history
function renderCityButton(city) {
    const currentButton = Array.from(
        cityHistory.querySelectorAll("button")).find((btn) => btn.textContent === city);

    if (!currentButton) {
        const button = document.createElement("button");
        button.textContent = city;
        button.className = "btn m-2 btn-primary cityButton";
        button.setAttribute("data-city", city);
        button.addEventListener("click", () => {
            getCity(city);
            retrieveForecast(city);
        });
        cityHistory.prepend(button);
    }
}

// Event listener for search button
searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    const city = userCity.value.trim();
    if (city) {
        renderCityButton(city);
        getCity(city);
        retrieveForecast(city);
        userCity.value = "";
    } else {
        alert("Please enter a city to search.");
    }
});

// Load search history from local storage , create buttons for each city
function renderCityHistory() {
    const cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
    cityHistory.forEach((city) => {
        renderCityButton(city);
    });
}
