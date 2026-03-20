const apiKey = "b95089b84e32447a991185020251304";

// Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const suggestions = document.getElementById("suggestions");

const weatherDiv = document.getElementById("weather");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");

const cityName = document.getElementById("city");
const temp = document.getElementById("temp");
const condition = document.getElementById("condition");
const icon = document.getElementById("icon");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const dateTime = document.getElementById("dateTime");
const toggleBtn = document.getElementById("toggleTemp");

let isCelsius = true;
let currentTempC = 0;

// 🔍 AUTOCOMPLETE
cityInput.addEventListener("input", async () => {
    const query = cityInput.value.trim();

    if (query.length < 2) {
        suggestions.innerHTML = "";
        return;
    }

    const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;

    const res = await fetch(url);
    const data = await res.json();

    suggestions.innerHTML = "";

    data.forEach(place => {
        const li = document.createElement("li");
        li.innerText = `${place.name}, ${place.region}, ${place.country}`;

        li.addEventListener("click", () => {
            cityInput.value = place.name;
            suggestions.innerHTML = "";
            getWeather(place.name);
        });

        suggestions.appendChild(li);
    });
});

// 🌐 GET WEATHER
async function getWeather(city) {
    if (!city) {
        showError("Enter city name");
        return;
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;

    try {
        loadingDiv.classList.remove("hidden");
        weatherDiv.classList.add("hidden");
        errorDiv.classList.add("hidden");

        const res = await fetch(url);
        const data = await res.json();

        if (data.error) throw new Error(data.error.message);

        displayWeather(data);

    } catch (err) {
        showError(err.message);
    } finally {
        loadingDiv.classList.add("hidden");
    }
}

// 📊 DISPLAY
function displayWeather(data) {
    weatherDiv.classList.remove("hidden");

    cityName.innerText = `${data.location.name}, ${data.location.country}`;
    currentTempC = data.current.feelslike_c; // more accurate

    temp.innerText = `${currentTempC} °C`;
    condition.innerText = data.current.condition.text;
    icon.src = "https:" + data.current.condition.icon;

    humidity.innerText = data.current.humidity + "%";
    wind.innerText = data.current.wind_kph + " km/h";

    dateTime.innerText = data.current.last_updated;

    changeBackground(data.current.condition.text);
}

// 🎨 BACKGROUND
function changeBackground(cond) {
    cond = cond.toLowerCase();

    if (cond.includes("sunny")) {
        document.body.style.background = "linear-gradient(135deg, #f7971e, #ffd200)";
    } else if (cond.includes("rain")) {
        document.body.style.background = "linear-gradient(135deg, #4b79a1, #283e51)";
    } else if (cond.includes("cloud")) {
        document.body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    } else {
        document.body.style.background = "linear-gradient(135deg, #4facfe, #00f2fe)";
    }
}

// ❌ ERROR
function showError(msg) {
    errorDiv.innerText = msg;
    errorDiv.classList.remove("hidden");
}

// 🌡 TOGGLE
toggleBtn.addEventListener("click", () => {
    if (isCelsius) {
        const f = (currentTempC * 9/5) + 32;
        temp.innerText = `${f.toFixed(1)} °F`;
        toggleBtn.innerText = "Switch to °C";
    } else {
        temp.innerText = `${currentTempC} °C`;
        toggleBtn.innerText = "Switch to °F";
    }
    isCelsius = !isCelsius;
});

// 🔘 BUTTON
searchBtn.addEventListener("click", () => {
    getWeather(cityInput.value.trim());
});

// ⌨ ENTER
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});