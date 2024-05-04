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
function getWeather(city) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    fetch(queryURL)
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