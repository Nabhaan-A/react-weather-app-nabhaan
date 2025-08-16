const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');
const weatherInfo = document.querySelector(".weatherInfo");
const apikey = "f7169425bece2f08e2c9098544f97936";

weatherForm.addEventListener("submit", async event => {

    event.preventDefault();
    const city = cityInput.value.trim();

    if(city) {
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherinfo(weatherData);
        }
        catch (error) {
            console.error(error);
            displayError(error);
        }
    }
    else{
        card.classList.remove('card--expanded2');
        displayError("Please enter a city name");

    }

});

async function getWeatherData(city) {
    const urlLink = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const response = await fetch(urlLink);
    
    if(!response.ok){
        card.classList.remove('card--expanded2');
        throw new Error(`no results for ${city}`);
    }
    return await response.json();
}

function displayWeatherinfo(data){
    weatherInfo.innerHTML = "";
    

    const {name: city, main: {temp,humidity}, weather: [{description,id}]} = data;

    card.style.display = "flex";

    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const humidityDisplay = document.createElement('p');
    const emojiDisplay = document.createElement('p');
    const descDisplay = document.createElement('p');

    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    emojiDisplay.classList.add("emojiDisplay");

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    emojiDisplay.textContent = getWeatherEmoji(id);

    weatherInfo.appendChild(cityDisplay);
    weatherInfo.appendChild(tempDisplay);
    weatherInfo.appendChild(humidityDisplay);
    weatherInfo.appendChild(descDisplay);
    weatherInfo.appendChild(emojiDisplay);

    card.classList.add('card--expanded2');
}

function getWeatherEmoji(id) {
    let emoji = "❓";
    let imageUrl = "";

    switch (true) {
        case (id >= 200 && id < 300): // Thunderstorm
            emoji = "⛈️";
            imageUrl = "url('thunderstorm.jpg')";
            break;

        case (id >= 300 && id < 500): // Drizzle
            emoji = "🌦️";
            imageUrl = "url('drizzle.jpg')";
            break;

        case (id >= 500 && id < 600): // Rain
            emoji = "🌧️";
            imageUrl = "url('rain.jpg')";
            break;

        case (id >= 600 && id < 700): // Snow
            emoji = "❄️";
            imageUrl = "url('snow.png')";
            break;

        case (id >= 700 && id < 800): // Fog / Mist
            emoji = "🌫️";
            imageUrl = "url('mist.jpg')";
            break;

        case (id === 800): // Clear
            emoji = "☀️";
            imageUrl = "url('clearsky.jpg')";
            break;

        case (id > 800): // Clouds
            emoji = "☁️";
            imageUrl = "url('clouds.jpg')";
            break;
    }

    // set background
    document.body.style.backgroundImage = imageUrl;

    return emoji;
}


function displayError(message) {
    weatherInfo.innerHTML = "";
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.classList.add('errorDisplay');
    card.classList.add('card--expanded');
    weatherInfo.appendChild(errorDisplay);
    setTimeout(() => {
        errorDisplay.remove();
        card.classList.remove('card--expanded');
    }, 3000);

}

