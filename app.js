const cityInput = document.querySelector(".container .search-box input");
let weatherLocation = document.querySelector(".container .weather-location");
let weather_img = document.querySelector(".container .weather-img img");
let temp = document.querySelector(".container .temp");
let weatherMain = document.querySelector(".container .weather_main_1");
let otherDetails = document.querySelector(".container .other-details");
let forecastBox = document.querySelector(".container .forecast-box");

let apiKey = "e2d781e14d3b28734ce69f62750bb257";

const getWeatherDetails = (city) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url).then((res) => res.json())
        .then((data) => {
            weather_img.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
            weatherMain.innerHTML = data.weather[0].main;
            weatherLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.name}`;
            temp.innerHTML = `${data.main.temp.toFixed(1)}&#176;`;

otherDetails.innerHTML = `
    <div>
        <i class="fa-solid fa-temperature-half fa-lg"></i>
        <span>Feels like</span>
        <p>${data.main.feels_like}&#176;</p>
    </div>
    <div>
        <i class="fa-solid fa-temperature-low fa-lg"></i>
        <span>Min Temp</span>
        <p>${data.main.temp_min}&#176;</p>
    </div>
    <div>
        <i class="fa-solid fa-droplet fa-lg"></i>
        <span>Humidity</span>
        <p>${data.main.humidity}%</p>
    </div>
    <div>
        <i class="fa-solid fa-wind fa-lg"></i>
        <span>Wind Speed</span>
        <p>${data.wind.speed}Km/h</p>
    </div>
    <div>
        <i class="fa-solid fa-temperature-high fa-lg"></i>
        <span>Max Temp</span>
        <p>${data.main.temp_max}&#176;</p>
    </div>
    <div>
        <i class="fa-solid fa-gauge fa-lg"></i>
        <span>Pressure</span>
        <p>${data.main.pressure}mbar</p>
    </div>
`;
        }).catch(() => {
            alert("Error occurred, city name not found!");
        });
};

cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value !== "") {
        getWeatherDetails(cityInput.value);
        getWeatherForcast(cityInput.value);
    }
});

const getWeatherForcast = (city) => {
    const forecast_url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(forecast_url).then((res) => res.json())
        .then((data) => {
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            forecastBox.innerHTML = "";
            fiveDaysForecast.forEach((weatherItem, index) => {
                forecastBox.insertAdjacentHTML("beforeend", createForecastCard(weatherItem, index));
            });
        }).catch(() => {
            alert("Error occurred, city name not found!");
        });
};

const createForecastCard = (item, index) => {
    if (index === 0) {
        return ``;
    } else {
        let forecastImage = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
        let forecastD = new Date(item.dt_txt);
        let forecastYear = forecastD.getFullYear();
        let forecastMonth = forecastD.getMonth() + 1;
        let forecastDate = forecastD.getDate();

        forecastMonth = forecastMonth < 10 ? "0" + forecastMonth : forecastMonth;
        forecastDate = forecastDate < 10 ? "0" + forecastDate : forecastDate;

        return `
        <div class="card">
            <p class="forecast-date">${forecastYear}-${forecastMonth}-${forecastDate}</p>
            <div class="forecast-img">
                <img src="${forecastImage}">
            </div>
            <h5 class="forecast-temp">${item.main.temp}&#176;</h5>
        </div>`;
    }
};

// Load London weather by default
getWeatherForcast(cityInput.value);
getWeatherDetails(cityInput.value);
