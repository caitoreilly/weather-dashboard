var city = "";
var savedCities = [];
var fetchButton = document.getElementById("fetch-button");
var currentDateElement = document.getElementById("current-date");
var searchListElement = document.getElementById("search-list");

// current day displayed in current search results box
var rightNow = moment().format("MMMM Do, YYYY");
console.log(rightNow);
currentDateElement.textContent = rightNow;

// type city and click search button --> get current conditions for city from weather API
function getCurrent(city) {
  var requestUrlCurrent =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=4cba12a73385abcc9d4e2c74697fadfa";
  console.log(requestUrlCurrent);
  fetch(requestUrlCurrent)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      var lon = data.coord.lon;
      var lat = data.coord.lat;
      console.log(lon, lat);
      displayCurrent(data);
      getForecast(lon, lat);
    });
}

// display current conditions for city
function displayCurrent(data) {
  // code to display city name
  var currentCityEl = document.querySelector("#current-city");
  currentCityEl.textContent = data.name;
  // code to display weather icon
  var icon = document.querySelector("#weather-icon");
  var iconImg = document.createElement("img");
  iconImg.setAttribute(
    "src",
    "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
  );
  icon.append(iconImg);
  // code to create and display current weather info
  var weatherContainer = document.querySelector(".city-info");
  var card = document.createElement("div");
  card.setAttribute("class", "card");
  var cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");
  var temp = document.createElement("p");
  temp.setAttribute("class", "weatherEl");
  var humidity = document.createElement("p");
  humidity.setAttribute("class", "weatherEl");
  var wind = document.createElement("p");
  wind.setAttribute("class", "weatherEl");
  // var UV = document.createElement("p").setAttribute("class", "weatherEl");
  temp.textContent = `Temperature: ${data.main.temp}`;
  humidity.textContent = `Humidity: ${data.main.humidity} %`;
  wind.textContent = `Wind Speed: ${data.wind.speed} MPH`;
  cardBody.append(temp, humidity, wind);
  card.append(cardBody);
  weatherContainer.append(card);
}

// display future conditions for city in 5-day forecast (make 5 cards, one for each day)
function getForecast(lon, lat) {
  var requestUrlForecast =
    "https://api.openweathermap.org/data/2.5/forecast?" +
    "lon=" +
    lon +
    "&lat=" +
    lat +
    "&appid=4cba12a73385abcc9d4e2c74697fadfa";
  console.log(lon, lat);
  console.log(requestUrlForecast);
  fetch(requestUrlForecast)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displayForecast(data);
    });
}
// function to display forecast info & create cards for 5-day forecast w/ information on each card
// display date, icon of weather, temp, wind speed, humidity
// for loop to display only for next 5 days
function displayForecast(data) {
  // for loop to only call next 5 days (not all 40)
  var forecastContainer = document.querySelector(".forecast-info");

  for (let i = 0; i < 5; i++) {
    // create 5 cards
    var forecastCard1 = document.createElement("div");
    forecastCard1.setAttribute("class", "forecast-card");
    var forecastCardBody1 = document.createElement("div");
    forecastCardBody1.setAttribute("class", "forecast-body");

    var futureTemp = document.createElement("p");
    futureTemp.setAttribute("class", "weatherEl");
    var futureHumidity = document.createElement("p");
    futureHumidity.setAttribute("class", "weatherEl");
    var futureWind = document.createElement("p");
    futureWind.setAttribute("class", "weatherEl");
    futureTemp.textContent = `Temperature: ${data.list[i].main.temp}`;
    console.log(futureTemp);
    futureHumidity.textContent = `Humidity: ${data.list[i].main.humidity} %`;
    futureWind.textContent = `Wind Speed: ${data.list[i].wind.speed} MPH`;

    // append info to cards
    forecastCardBody1.append(futureTemp, futureHumidity, futureWind);
    forecastCard1.append(forecastCardBody1);
    forecastContainer.append(forecastCard1);

    console.log(data.list[i]);
  }
}

// city added to search history (list)
// click on city in search history --> current & future conditions added to page again
// UV index --> color indicates if conditions are favorable, moderate, or severe

fetchButton.addEventListener("click", (event) => {
  event.preventDefault();
  var userInput = document.querySelector(".search-city").value;
  console.log(userInput);
  getCurrent(userInput);
  savedCities.push(userInput);
  saveCity();
});
/*push the city into the array
    display the city list
    run the save city function*/

/* save city function that uses saved city list array as parameter and 
set the array to local storage */

var saveCity = function () {
  localStorage.setItem("city", JSON.stringify(savedCities));

  savedCities = JSON.parse(localStorage.getItem("city")) || [];

  for (var i = 0; i < savedCities.length; i++) {
    displayCitySearch(savedCities[i]);
  }

  displayCitySearch();
};

//function to display the array to the page (append)

var displayCitySearch = function () {
  var listItem = document.createElement("li");
  listItem.className = "list-item";
  listItem.textContent = document.querySelector(".search-city").value;
  searchListElement.append(listItem);
  console.log(listItem);
};
