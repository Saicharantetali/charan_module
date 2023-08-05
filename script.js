const API_KEY = '193d9fff60b039e2a8613a70bfa9643c';
const weatherCardsContainer = document.getElementById('weatherCards');
const cityInput = document.getElementById('cityInput');
const addButton = document.getElementById('addButton');

const cities = [];

// Function to fetch weather data from OpenWeatherMap API
async function getWeatherData(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to create a weather card with provided weather data
function createWeatherCard(weatherData) {
    const weatherCard = document.createElement('div');
    weatherCard.classList.add('weather-card');

    const weatherIcon = document.createElement('img');
    weatherIcon.src = getWeatherIconUrl(weatherData.weather[0].icon);
    weatherIcon.alt = weatherData.weather[0].main;
    weatherCard.appendChild(weatherIcon);

    const weatherCardContent = document.createElement('div');
    weatherCardContent.classList.add('weather-card-content');

    const cityNameElement = document.createElement('div');
    cityNameElement.classList.add('city-name');
    cityNameElement.textContent = weatherData.name;
    weatherCardContent.appendChild(cityNameElement);

    const temperatureElement = document.createElement('div');
    temperatureElement.classList.add('temperature');
    temperatureElement.textContent = `${weatherData.main.temp.toFixed(1)}°C`;
    weatherCardContent.appendChild(temperatureElement);

    const weatherConditionElement = document.createElement('div');
    weatherConditionElement.classList.add('weather-condition');
    weatherConditionElement.textContent = weatherData.weather[0].description;
    weatherCardContent.appendChild(weatherConditionElement);

    const weatherInfoElement = document.createElement('div');
    weatherInfoElement.classList.add('weather-info');
    weatherInfoElement.innerHTML = `
        Humidity: ${weatherData.main.humidity}%<br>
        Pressure: ${weatherData.main.pressure} hPa<br>
        Wind Speed: ${weatherData.wind.speed} m/s<br>
    `;
    weatherCardContent.appendChild(weatherInfoElement);

    weatherCard.appendChild(weatherCardContent);
    return weatherCard;
}

// Function to fetch weather icon URL based on icon code
function getWeatherIconUrl(iconCode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
}

// Function to add a new city to the dashboard
async function addCity() {
    const cityName = cityInput.value.trim();

    if (cityName === '') {
        alert('Please enter a valid city name.');
        return;
    }

    const weatherData = await getWeatherData(cityName);

    if (!weatherData) {
        alert('City not found. Please enter a valid city name.');
        return;
    }

    cities.push({ name: cityName, temp: weatherData.main.temp });
    cities.sort((a, b) => a.temp - b.temp);
    updateWeatherCards();

    cityInput.value = '';
}

// Function to update the weather cards on the dashboard
async function updateWeatherCards() {
    weatherCardsContainer.innerHTML = '';
    for (const cityData of cities) {
        const weatherData = await getWeatherData(cityData.name);
        if (weatherData) {
            const weatherCard = createWeatherCard(weatherData);
            weatherCardsContainer.appendChild(weatherCard);
        }
    }
}

// Event listener for the "Add" button
addButton.addEventListener('click', addCity);

// Event listener for pressing Enter key in the input field
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addCity();
    }
});

// Initial weather cards update
updateWeatherCards();
