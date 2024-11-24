const WeatherApp = class {
    constructor(apiKey, weatherContainerSelector) {
        this.apiKey = apiKey;
        this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid={apiKey}&units=metric&lang=pl";
        this.iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";

        this.currentWeatherLink = this.currentWeatherLink.replace("{apiKey}", this.apiKey);
        this.forecastLink = this.forecastLink.replace("{apiKey}", this.apiKey);

        this.currentWeather = undefined;
        this.forecast = undefined;

        this.weatherContainer = document.querySelector(weatherContainerSelector); 
    }

    getCurrentWeather(city) {
        let link = this.currentWeatherLink.replace("{query}", city);
        let xmlreq = new XMLHttpRequest();
        xmlreq.open("GET", link, true);
        xmlreq.addEventListener("load", () => {
            this.currentWeather = JSON.parse(xmlreq.responseText);
            console.log(this.currentWeather);
            this.addWeather();
        });
        xmlreq.send();
    }

    getForecast(city) {
        const link = this.forecastLink.replace("{query}", city); 
        fetch(link)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.forecast = data.list;
                this.addWeather();
            })
            .catch(error => {
                console.error("Błąd podczas pobierania pogody: ", error);
            });
    }

    getWeather(city) {
        this.getCurrentWeather(city);
        this.getForecast(city);
    }

    addWeather() {
        this.weatherContainer.innerHTML = ''; 

        if (this.currentWeather) {
            const date = new Date(this.currentWeather.dt * 1000);
            const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

            const temperature = this.currentWeather.main.temp;
            const feelsLikeTemperature = this.currentWeather.main.feels_like;
            const iconName = this.currentWeather.weather[0].icon;
            const description = this.currentWeather.weather[0].description;

            const weatherCard = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
            this.weatherContainer.appendChild(weatherCard); 
        }

        if (this.forecast && this.forecast.length > 0) {
            for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i];
                const date = new Date(weather.dt * 1000);
                const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;

                const temperature = weather.main.temp;
                const feelsLikeTemperature = weather.main.feels_like;
                const iconName = weather.weather[0].icon;
                const description = weather.weather[0].description;

                const weatherCard = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
                this.weatherContainer.appendChild(weatherCard); 
            }
        }
    }

    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
        let weatherCard = document.createElement("div");
        weatherCard.className = "weatherCard";

        let dateContainer = document.createElement("div");
        dateContainer.className = "weatherDate";
        dateContainer.innerText = dateString;
        weatherCard.appendChild(dateContainer);

        let tempContainer = document.createElement("div");
        tempContainer.className = "weatherTemp";
        tempContainer.innerHTML = `${temperature} &deg;C`;
        weatherCard.appendChild(tempContainer);

        let feelsLikeContainer = document.createElement("div");
        feelsLikeContainer.className = "weatherTemp_Feels";
        feelsLikeContainer.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
        weatherCard.appendChild(feelsLikeContainer);

        let weatherIcon = document.createElement("img");
        weatherIcon.className = "weatherIcon";
        weatherIcon.src = this.iconLink.replace("{iconName}", iconName);
        weatherCard.appendChild(weatherIcon);

        let weatherDescription = document.createElement("div");
        weatherDescription.className = "weatherDescription";
        weatherDescription.innerText = description;
        weatherCard.appendChild(weatherDescription);

        return weatherCard;
    }
}

document.weatherApp = new WeatherApp("5dee28b0e3121c2993d9bce98b23ea96", "#weather");

document.querySelector("#button").addEventListener("click", function() {
    const city = document.querySelector("#city").value;
    document.weatherApp.getWeather(city); 
});
