
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusMessage = document.getElementById("status");

let rainfallChartInstance = null;

// Weather descriptions
function getWeatherInfo(code) {
    if (code === 0) return { icon: "☀️", text: "Clear sky" };
    if ([1, 2].includes(code)) return { icon: "🌤️", text: "Partly cloudy" };
    if (code === 3) return { icon: "☁️", text: "Overcast" };
    if ([45, 48].includes(code)) return { icon: "🌫️", text: "Fog" };
    if ([51, 53, 55, 56, 57].includes(code)) return { icon: "🌦️", text: "Drizzle" };
    if ([61, 63, 65, 66, 67].includes(code)) return { icon: "🌧️", text: "Rain" };
    if ([71, 73, 75, 77].includes(code)) return { icon: "❄️", text: "Snow" };
    if ([80, 81, 82].includes(code)) return { icon: "🌧️", text: "Rain showers" };
    if ([85, 86].includes(code)) return { icon: "🌨️", text: "Snow showers" };
    if ([95, 96, 99].includes(code)) return { icon: "⛈️", text: "Thunderstorm" };
    return { icon: "🌤️", text: "Weather" };
}

function showStatus(message, isError = false) {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "#ff7777" : "";
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function formatDay(dateString) {
    return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-US", {
        weekday: "short"
    });
}

function formatFullDay(dateString) {
    return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "short"
    });
}

// Find city coordinates
async function getCityCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to search for this location.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found. Please enter another city.");
    }

    return data.results[0];
}

// Fetch weather information
async function getWeather() {
    const city = cityInput?.value.trim();

    if (!city) {
        showStatus("Please enter a city name.", true);
        return;
    }

    try {
        showStatus("Fetching live weather and forecast data...");

        if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.textContent = "Loading...";
        }

        const location = await getCityCoordinates(city);

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}` +
            `&longitude=${location.longitude}` +
            `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max` +
            `&timezone=auto&forecast_days=7`;

        const response = await fetch(weatherURL);

        if (!response.ok) {
            throw new Error("Weather service is currently unavailable.");
        }

        const data = await response.json();

        if (!data.current || !data.daily) {
            throw new Error("Weather data is incomplete.");
        }

        updateCurrentWeather(location, data);
        updateForecast(data.daily);
        updateRainfallAnalysis(data.daily);
        updateDailyRainfallPrediction(data.daily);
        updateIrrigationAdvisor(data);
        updateTransportAdvisor(data);
        updateRainfallChart(data.daily);

        showStatus("Weather and all predictions updated successfully!");

    } catch (error) {
        console.error("Weather dashboard error:", error);
        showStatus(error.message || "Something went wrong. Please try again.", true);
    } finally {
        if (searchBtn) {
            searchBtn.disabled = false;
            searchBtn.textContent = "Search Weather ↗";
        }
    }
}

// Current weather
function updateCurrentWeather(location, data) {
    const current = data.current;
    const daily = data.daily;

    setText("cityName", `${location.name || "Selected Location"}, ${location.country || ""}`);
    setText("temperature", `${Number(current.temperature_2m).toFixed(1)} °C`);
    setText("humidity", `Humidity: ${current.relative_humidity_2m}%`);
    setText("rainfall", `Current precipitation: ${current.precipitation} mm`);
    setText("rainChance", `Today's rain probability: ${daily.precipitation_probability_max[0] ?? 0}%`);
    setText("wind", `Wind speed: ${current.wind_speed_10m} km/h`);
}

// Seven-day weather forecast
function updateForecast(daily) {
    const container = document.getElementById("forecastContainer");
    if (!container) return;

    container.innerHTML = "";

    daily.time.forEach((date, index) => {
        const weather = getWeatherInfo(daily.weather_code[index]);
        const probability = daily.precipitation_probability_max[index] ?? 0;
        const rainfall = daily.precipitation_sum[index] ?? 0;

        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <h3>${formatDay(date)}</h3>
            <p>${weather.icon} Rain: ${probability}%</p>
            <p>💧 ${Number(rainfall).toFixed(1)} mm</p>
            <p>🌡️ Max: ${Number(daily.temperature_2m_max[index]).toFixed(1)}°C</p>
            <p>❄️ Min: ${Number(daily.temperature_2m_min[index]).toFixed(1)}°C</p>
        `;

        container.appendChild(card);
    });
}

// Overall rainfall analysis
function updateRainfallAnalysis(daily) {
    const rainfallValues = daily.precipitation_sum.map(value => Number(value) || 0);
    const probabilityValues = daily.precipitation_probability_max.map(value => Number(value) || 0);

    const weeklyRainfall = rainfallValues.reduce((sum, value) => sum + value, 0);
    const rainyDays = rainfallValues.filter(value => value >= 1).length;
    const maxDailyRainfall = Math.max(...rainfallValues);
    const maxProbability = Math.max(...probabilityValues);

    let risk = "LOW";

    if (weeklyRainfall >= 50 || maxDailyRainfall >= 20) {
        risk = "HIGH";
    } else if (weeklyRainfall >= 10 || maxProbability >= 60) {
        risk = "MODERATE";
    }

    setText("weeklyRainfall", `${weeklyRainfall.toFixed(1)} mm`);
    setText("rainyDays", `${rainyDays} / 7`);
    setText("rainfallRisk", risk);

    setText("predictionSummary",
        `Total expected rainfall: ${weeklyRainfall.toFixed(1)} mm\n` +
        `Expected rainy days: ${rainyDays} out of 7 days\n` +
        `Maximum daily rainfall: ${maxDailyRainfall.toFixed(1)} mm\n` +
        `Highest rain probability: ${maxProbability}%\n` +
        `Overall rainfall risk: ${risk}`
    );

    const alertElement = document.getElementById("rainAlert");
    const alertMessage = document.getElementById("rainAlertMessage");

    const nextRainIndex = rainfallValues.findIndex(
        (rain, index) => rain >= 1 || probabilityValues[index] >= 50
    );

    let message = "No significant rainfall is indicated in the seven-day forecast. Continue monitoring weather updates.";

    if (nextRainIndex !== -1) {
        message = `Rain may occur on ${formatDay(daily.time[nextRainIndex])}. ` +
            `Expected rainfall: ${rainfallValues[nextRainIndex].toFixed(1)} mm, ` +
            `with a ${probabilityValues[nextRainIndex]}% probability.`;
    }

    if (alertMessage) alertMessage.textContent = message;

    if (alertElement) {
        alertElement.classList.remove("warning", "danger");

        if (risk === "HIGH") {
            alertElement.classList.add("danger");
        } else if (risk === "MODERATE") {
            alertElement.classList.add("warning");
        }
    }
}

// NEW: Daily rainfall risk prediction
function updateDailyRainfallPrediction(daily) {
    const container = document.getElementById("dailyRainfallPrediction");
    if (!container) return;

    container.innerHTML = "";

    daily.time.forEach((date, index) => {
        const rainfall = Number(daily.precipitation_sum[index]) || 0;
        const probability = Number(daily.precipitation_probability_max[index]) || 0;

        let risk = "LOW";
        let riskClass = "low";
        let advice = "Normal farming activities can continue. Monitor soil moisture.";

        if (rainfall >= 50 || probability >= 90) {
            risk = "VERY HIGH";
            riskClass = "very-high";
            advice = "Heavy rain is possible. Protect crops, avoid waterlogging and postpone field operations if conditions become unsafe.";
        } else if (rainfall >= 20 || probability >= 75) {
            risk = "HIGH";
            riskClass = "high";
            advice = "Prepare drainage channels and protect harvested crops. Avoid unnecessary field movement during heavy rain.";
        } else if (rainfall >= 5 || probability >= 50) {
            risk = "MODERATE";
            riskClass = "moderate";
            advice = "Monitor rainfall updates and soil moisture. Plan irrigation and outdoor activities carefully.";
        }

        const card = document.createElement("div");
        card.className = `daily-rain-card ${riskClass}`;

        card.innerHTML = `
            <div class="daily-rain-top">
                <div>
                    <h3>${formatFullDay(date)}</h3>
                    <p>Day ${index + 1} forecast</p>
                </div>
                <span class="rain-risk-badge ${riskClass}">${risk}</span>
            </div>

            <div class="daily-rain-stats">
                <div>
                    <span>🌧️ Expected Rainfall</span>
                    <strong>${rainfall.toFixed(1)} mm</strong>
                </div>
                <div>
                    <span>☁️ Rain Probability</span>
                    <strong>${probability}%</strong>
                </div>
            </div>

            <p class="daily-rain-advice">💡 ${advice}</p>
        `;

        container.appendChild(card);
    });
}

// Smart irrigation advisor
function updateIrrigationAdvisor(data) {
    const daily = data.daily;
    const current = data.current;

    const rainfall = Number(daily.precipitation_sum[0]) || 0;
    const probability = Number(daily.precipitation_probability_max[0]) || 0;
    const temperature = Number(current.temperature_2m) || 0;

    let title = "🌞 Irrigation May Be Needed";
    let message = "Little rainfall is forecast. Check soil moisture and crop requirements before irrigating.";
    let status = "normal";

    if (rainfall >= 10 || probability >= 70) {
        title = "🌧️ Irrigation Not Recommended";
        message = "Significant rainfall is expected. Consider delaying irrigation and monitor soil moisture.";
        status = "warning";
    } else if (rainfall >= 1 || probability >= 30) {
        title = "🌦️ Monitor Soil Moisture";
        message = "Some rainfall is possible. Check soil moisture before deciding whether irrigation is required.";
        status = "warning";
    }

    if (temperature >= 35) {
        message += " High temperature may increase water requirements.";
    }

    setText("irrigationStatus", title);
    setText("irrigationMessage", message);
    setText("irrigationRain", `Expected Rainfall: ${rainfall.toFixed(1)} mm`);
    setText("irrigationProbability", `Rain Probability: ${probability}%`);
    setText("irrigationTemperature", `Current Temperature: ${temperature.toFixed(1)} °C`);

    const card = document.getElementById("irrigationResult");

    if (card) {
        card.classList.remove("normal", "warning", "danger");
        card.classList.add(status);
    }
}

// Transport weather advisor
function updateTransportAdvisor(data) {
    const daily = data.daily;
    const current = data.current;

    const rainfall = Number(daily.precipitation_sum[0]) || 0;
    const probability = Number(daily.precipitation_probability_max[0]) || 0;
    const currentWind = Number(current.wind_speed_10m) || 0;
    const maximumWind = Math.max(...daily.wind_speed_10m_max.map(value => Number(value) || 0));

    let risk = "low";
    let title = "🟢 Low Transport Weather Risk";
    let message = "Current forecast indicates relatively favorable weather for transportation.";

    if (rainfall >= 20 || maximumWind >= 60) {
        risk = "high";
        title = "🔴 High Transport Weather Risk";
        message = "Heavy rainfall or strong winds may affect transportation. Check official weather alerts and road conditions before travel.";
    } else if (rainfall >= 5 || probability >= 60 || maximumWind >= 40) {
        risk = "moderate";
        title = "🟠 Moderate Transport Weather Risk";
        message = "Weather conditions may affect transportation. Monitor rainfall, wind and local road conditions.";
    }

    setText("transportStatus", title);
    setText("transportMessage", message);
    setText("transportRain", `Expected Rainfall: ${rainfall.toFixed(1)} mm`);
    setText("transportProbability", `Rain Probability: ${probability}%`);
    setText("transportWind",
        `Current Wind Speed: ${currentWind.toFixed(1)} km/h | Forecast Maximum: ${maximumWind.toFixed(1)} km/h`
    );

    setText("transportRecommendation",
        risk === "low"
            ? "Normal transport planning may continue. Keep monitoring weather and road conditions."
            : risk === "moderate"
                ? "Check local road conditions and plan for possible weather delays."
                : "Review official alerts and consider delaying travel on affected routes."
    );

    const card = document.getElementById("transportResult");

    if (card) {
        card.classList.remove("low", "moderate", "high");
        card.classList.add(risk);
    }
}

// Weekly rainfall chart
function updateRainfallChart(daily) {
    const canvas = document.getElementById("rainfallChart");

    if (!canvas || typeof Chart === "undefined") {
        console.error("Chart.js or rainfallChart canvas is missing.");
        return;
    }

    const labels = daily.time.map(date =>
        new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short"
        })
    );

    const rainfall = daily.precipitation_sum.map(value => Number(value) || 0);
    const probability = daily.precipitation_probability_max.map(value => Number(value) || 0);

    if (rainfallChartInstance) {
        rainfallChartInstance.destroy();
    }

    rainfallChartInstance = new Chart(canvas, {
        data: {
            labels,
            datasets: [
                {
                    type: "bar",
                    label: "Expected Rainfall (mm)",
                    data: rainfall,
                    yAxisID: "yRainfall",
                    backgroundColor: "rgba(57, 217, 138, 0.85)",
                    borderColor: "#39d98a",
                    borderWidth: 1,
                    borderRadius: 6,
                    barPercentage: 0.55,
                    order: 2
                },
                {
                    type: "line",
                    label: "Rain Probability (%)",
                    data: probability,
                    yAxisID: "yProbability",
                    borderColor: "#ffca58",
                    backgroundColor: "#ffca58",
                    pointBackgroundColor: "#ffca58",
                    pointRadius: 5,
                    borderWidth: 3,
                    tension: 0.35,
                    fill: false,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false
            },
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        color: "#f1fff7",
                        padding: 18
                    }
                },
                tooltip: {
                    backgroundColor: "#0d2018",
                    titleColor: "#ffffff",
                    bodyColor: "#d9f5e5",
                    borderColor: "rgba(57, 217, 138, 0.35)",
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: { color: "#d9e9df" },
                    grid: { color: "rgba(255,255,255,0.035)" }
                },
                yRainfall: {
                    type: "linear",
                    position: "left",
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Rainfall (mm)",
                        color: "#d9e9df"
                    },
                    ticks: { color: "#d9e9df" }
                },
                yProbability: {
                    type: "linear",
                    position: "right",
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: "Rain Probability (%)",
                        color: "#ffca58"
                    },
                    ticks: {
                        color: "#ffca58",
                        callback(value) {
                            return `${value}%`;
                        }
                    },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// Search button
if (searchBtn) {
    searchBtn.addEventListener("click", getWeather);
}

// Enter key search
if (cityInput) {
    cityInput.addEventListener("keydown", event => {
        if (event.key === "Enter") getWeather();
    });
}

// Load default city
getWeather();
