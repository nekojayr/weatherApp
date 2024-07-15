document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "TMAJNAOGa8qO4zAEF7mgmGhirhSz4j4F"; 
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        fetchDailyForecast(locationKey);
        fetchHourlyForecast(locationKey);
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        let dayIcon = "";
        switch(weather){
            case "Cloudy":
                dayIcon = "images/cloudy.png"
                break;
            case "Rain":
                dayIcon = "images/rain.png"
                break;
            case "Thunderstorms":
                dayIcon = "images/thunderstorm.png"
                break;
            default:
                dayIcon = "images/cloudy.png"
                                  
        }
        const weatherContent = `
            <h2 style='text-align: center;'>Weather</h2>
            <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 10px;">
                <img src="${dayIcon}" />
            </div>
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <p>Temp: <span style="font-weight: bold;"> ${temperature}°C</span></p>
                <p>Weather: <span style="font-weight: bold;">${weather}</span></p>
            </div>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function fetchDailyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const dailyForecastDiv = document.getElementById("dailyForecast");
                dailyForecastDiv.innerHTML = '<h2 style="text-align: center; margin-bottom: 10px;">Daily Forecast</h2>';

                data.DailyForecasts.forEach(forecast => {
                    const date = new Date(forecast.Date);
                    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
                    const maxTemp = forecast.Temperature.Maximum.Value;
                    const minTemp = forecast.Temperature.Minimum.Value;
                    const dayWeather = forecast.Day.IconPhrase;
                    const nightWeather = forecast.Night.IconPhrase;
                    let dayIcon = "";
                    // Create outer card container
                    const outerCard = document.createElement('div');
                    outerCard.classList.add('outer-card');

                    switch(dayWeather){
                        case "Rain":
                            dayIcon = "images/rain.png"
                            break;
                        case "Thunderstorms":
                            dayIcon = "images/thunderstorm.png"
                            break;
                        default:
                            dayIcon = "images/cloudy.png"
                                              
                    }
                    // Create inner card for forecast details
                    const innerCard = document.createElement('div');
                    innerCard.classList.add('inner-card');
                    innerCard.innerHTML = `
                        <h3 style='text-align: center;' ><span style="font-weight: bold;">${day}</span></h3>
                        <div style="display:flex; justify-content: center; align-items: center;">
                            <img  src="${dayIcon}" alt="${dayWeather}">
                        </div>
                        <div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 10px;">
                            <p>Max: <span style="font-weight: bold;">${maxTemp}°C</span></p>
                            <p>Min: <span style="font-weight: bold;">${minTemp}°C</span></p>
                        </div>
                        <p style="margin-top: 10px;">Day: <span style="font-weight: bold;">${dayWeather}</span></p>
                        <p style="margin-top: 10px;">Night: <span style="font-weight: bold;">${nightWeather}</span></p>
                    `;

                    outerCard.appendChild(innerCard);
                    dailyForecastDiv.appendChild(outerCard);
                });
            })
            .catch(error => {
                console.error("Error fetching daily forecast:", error);
                const dailyForecastDiv = document.getElementById("dailyForecast");
                dailyForecastDiv.innerHTML = `<p>Error fetching daily forecast.</p>`;
            });
    }


    function fetchHourlyForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const hourlyForecastDiv = document.getElementById("hourlyForecast");
                hourlyForecastDiv.innerHTML = '<h2 style="text-align: center; margin-bottom: 10px;">Hourly Forecast</h2>';

                data.forEach(forecast => {
                    const time = new Date(forecast.DateTime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
                    const temperature = forecast.Temperature.Value;
                    const weather = forecast.IconPhrase;
                    const icon = forecast.WeatherIcon;
                    let dayIcon = "";
                    switch(icon){
                        case "Cloudy":
                            dayIcon = "images/cloudy-small.png"
                            break;
                        case "Rain":
                            dayIcon = "images/rain-small.png"
                            break;
                        case "Thunderstorms":
                            dayIcon = "images/thunderstorm-small.png"
                            break;
                        default:
                            dayIcon = "images/cloudy-small.png"
                                            
                    }
                    const outerCard = document.createElement('div');
                    outerCard.classList.add('outer-card');

                    const innerCard = document.createElement('div');
                    innerCard.classList.add('inner-card');
                    innerCard.innerHTML = `
                        <div class="row"'>
                            <h3 style='text-align: center;'>${time}</h3>
                            <div style="display:flex; justify-content: center; align-items: center;">
                                <img src="${dayIcon}" />
                            </div>
                            <div style="display:flex; flex-direction: column; justify-content: center; align-items: center;">
                                <p>Temp: <span style="font-weight: bold;">${temperature}°C</span></p>
                                <p>Weather: <span style="font-weight: bold;">${weather}</span></p>
                            </div>
                        </div>
                    `;

                    outerCard.appendChild(innerCard);
                    hourlyForecastDiv.appendChild(outerCard);
                });
            })
            .catch(error => {
                console.error("Error fetching hourly forecast:", error);
                const hourlyForecastDiv = document.getElementById("hourlyForecast");
                hourlyForecastDiv.innerHTML = `<p>Error fetching hourly forecast.</p>`;
            });
    }

});
