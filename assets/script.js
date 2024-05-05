// API KEY: for weather access:
const APIKey = "78506e3c00a53204a2691e069931f836";

//Define variables for use in functions.
let userCity = document.querySelector("#searchCity");
let searchButton = document.querySelector(".searchButton");
let weatherForecast = document.querySelector(".forecastToday");
let cityHistory = document.querySelector(".searchHistory");
let cardRender = document.querySelector(".renderCards");

// call to retrieve local storage and render cards
renderCityHistory();

// Fetch request to OpenWeather API
    function getCity(city) {
        let weatherQueryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
        fetch(weatherQueryURL)
        .then((response) => response.json())
        .then((data) => {
            // functions to render current weather
            renderWeather(data);
            saveLocal(city);
            retrieveForecast(city);
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("City not found. Please try again." + city);
        });
    }

// Retrieve five day forecast
    let retrieveForecast = (city) => {
        const forecastQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;

        fetch(forecastQueryUrl)
        .then((response) => response.json())
        .then((data) => {
            renderForecast(data);
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Please try again Data Not Found For." + city);
        });
    };

    const renderWeather = (data) => {
        let liveDate = new Date().toLocaleDateString();
        const tempF = (data.main.temp - 273.15) * 1.80 + 32;
        const weatherIcon = data.weather[0].icon;
        const iconURL = `http://openweathermap.org/img/w/${weatherIcon}.png`;

        const createIcon = document.createElement("img");
        createIcon.src = iconURL;
        createIcon.alt = "Weather Icon for Today";

        weatherForecast.innerHTML = `
        <h2 class="fw-bold m-2">${data.name} (${liveDate})</h2>
        <div>${createIcon.outerHTML}</div>
        <p class="m-2">Temperature: ${tempF.toFixed(2)} °F
        </br>Humidity: ${data.main.humidity}%
        </br>Wind Speed: ${data.wind.speed} MPH </p>`;
    };

    // Render five day forecast
    const renderForecast = (data) => {
        cardRender.innerHTML = "";

        for (let i = 0; i < 5; ) {
            let forecast = data.list[i * 8];
            let date = new Date();
            date.setDate(date.getDate() + i + 1);
            const tempF = (forecast.main.temp - 273.15) * 1.80 + 32;
            const weatherIcon = forecast.weather[0].icon;
            const iconURL = `http://openweathermap.org/img/w/${weatherIcon}.png`;

            const createIcon = document.createElement("img");
            createIcon.src = iconURL;
            createIcon.alt = "Weather Icon for Today";

            const card = document.createElement("div");
            card.classList.add("card", "bg-primary", "text-white", "m-2");
            card.innerHTML = `
            <h4>${date.toLocaleDateString("en-us", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
            })}</h4>
            <div>${createIcon.outerHTML}</div>
            <p>Temp: ${tempF.toFixed(2)} °F</p>
            <p>Humidity: ${forecast.main.humidity}%</p>
            <p>Wind: ${forecast.wind.speed} MPH</p>`;

            cardRender.appendChild(card);
        } 
    };

    // Save search history to local storage
   