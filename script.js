//Endpoint is usually private and can be saved in .env
const ENDPOINT = `https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-
endpoint/forecast?appid=a2ef86c41a&lat=27.987850&lon=86.925026`;

//Template of data that can be processed
const dataToSend = {
  id: localStorage.getItem("radRandom"), //Unsure whether this is a valid userId method
  time: new Date(),
  weatherShown: true,
  weatherFetchFailed: false,
  checkedOpeningTimes: false,
  checkedPrices: false,
  joinButtonClicked: false,
  getDirectionsClicked: false,
};

//When opening time tab is opened set checkOpeningTimes to true
document
  .querySelector(
    "[data-testid='visitor-info-accordion--item-place-opening-times-button']"
  )
  .addEventListener("click", () => {
    dataToSend.checkedOpeningTimes = true;
  });
//When prices tab is opened set checkedPrices to true
document
  .querySelector(
    "[data-testid='visitor-info-accordion--item-place-prices-button']"
  )
  .addEventListener("click", () => {
    dataToSend.checkedPrices = true;
  });
//When Google maps is clicked set getDirections to true and shows data that would be sent before redirect
document
  .querySelector("[data-testid='getting-there-map-description']")
  .addEventListener("click", () => {
    dataToSend.getDirectionsClicked = true;
    console.log(`DATA TO SEND: ${JSON.stringify(dataToSend, null, 2)}`);
    alert(`DATA TO SEND: ${JSON.stringify(dataToSend, null, 2)}`);
  });
// When join button is clicked sets joinButtonClicked to true
document
  .querySelector("[data-testid='join-link']")
  .addEventListener("click", () => {
    dataToSend.joinButtonClicked = true;
    console.log(`DATA TO SEND: ${JSON.stringify(dataToSend, null, 2)}`);
    alert(`DATA TO SEND: ${JSON.stringify(dataToSend, null, 2)}`);
  });

// Function that can be called to create an element on the page
function createElement(className, tag, innerHTML) {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(...className);
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  return element;
}

// Function called to create and display error if fetch fails
function weatherFetchFail(container) {
  const errorMessage = `
    <p>Error fetching weather data. Please try again later.</p>
  `;
  const errorElement = createElement(["weather"], "div", errorMessage);
  container.appendChld(errorElement);
}

//Function processes weather data, sorts it, creates weather elements and appends it
function processWeatherData(data, container) {
  const weatherContainer = createElement(["weather"], "div");
  const forecastDays = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000); // Convert timestamp to Date object
    const day = date.toLocaleDateString("en-GB", { weekday: "short" }); // Converts to readable date (Mon, Tue..)

    // If this day doesn't exist in forecastDays create it
    if (!forecastDays[day]) {
      forecastDays[day] = {
        temp: [],
        icon: item.weather[0].icon,
        description: item.weather[0].description,
      };
    }
    // Add temperature to the day's array for averaging
    forecastDays[day].temp.push(item.main.temp);
  });

  // Display first 5 days
  Object.entries(forecastDays)
    .slice(0, 5)
    .forEach(([day, { temp, icon, description }]) => {
      // Calculate the average temperature
      const avgTemp = Math.round(temp.reduce((a, b) => a + b) / temp.length);

      //HTML for each day
      const dayHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; margin: 10px;">
      <h4>${day}</h4>
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
      <p style="margin: 5px 0; font-size: 1rem;>${avgTemp}°C</p>
      <p style="margin: 0; font-size: 0.8rem; text-align: center; color: #555;>${description}</p>
      </div>`;

      const dayElement = createElement(["forecastItem"], "div", dayHTML);
      weatherContainer.appendChild(dayElement);
    });
  //Style weather div
  weatherContainer.style.display = "flex";
  weatherContainer.style.flexWrap = "wrap";
  weatherContainer.style.justifyContent = "space-between";
  weatherContainer.style.alignItems = "flex-start";
  container.appendChild(weatherContainer);
}

//Function fetches weather 50% of time from endpoint for A/B testing
async function showWeather(URL, targetContainer) {
  if (Math.random() > 0.5) {
    console.log("NO WEATHER FETCH - A/B Testing");
    dataToSend.weatherShown = false;
    return;
  }
  const container = document.querySelector(targetContainer);
  try {
    const response = await fetch(URL);
    const data = await response.json();
    processWeatherData(data, container);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    dataToSend.weatherFetchFailed = true;
    weatherFetchFail(container);
  }
}

showWeather(
  ENDPOINT,
  "div.Gridstyle__Column-sc-sque-1.kOBmMQ.nt-col.nt-col-m12.nt-col-t6"
);
