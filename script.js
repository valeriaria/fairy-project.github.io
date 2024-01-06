// Функція що відслідковує натискання клавіші Enter у полі вводу міста
function handleEnter(event) {
    if (event.key === "Enter") {
        const cityInput = document.getElementById('city');
        const cityName = cityInput.value.trim();

        if (cityName !== "") {
            getWeather();
        } else {
            showError("Будь ласка, введіть місто");
        }
    }
}

// Функція що отримує погодні дані та погодинний прогноз за введеним містом
function getWeather() {
    const apiKey = '97beddad8024c6d910feb7e1c73242ce';
    const city = document.getElementById('city').value;

    if (!city) {
        showError('Будь ласка, введіть місто');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ua`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=ua`;

    // Отримання поточних даних про погоду
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Помилка отримання поточних даних про погоду:', error);
            showError('Помилка отрімання поточних даних про погоду. Будь ласка, спробуйте ще раз');
        });

    // Отримання погодинного прогнозу
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Помилка отримання даних погодинного прогнозу:', error);
            showError('Помилка отримання даних погодинного прогнозу. Будь ласка, спробуйте ще раз');
        });
}

// Функція що виводить повідомлення про помилку
function showError(message) {
    alert(message);
}

// Функція що виводить поточну погоду та візуально її відображає
function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Очищення попередніх виведених даних
    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        // Виведення повідомлення про помилку
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        // Отримання та виведення поточних даних про погоду
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

// Функція що виводить погодинний прогноз за наступні 24 години
function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    // Відображення даних для наступних 8 годин
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

// Функція що відображує іконку погоди
function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}
