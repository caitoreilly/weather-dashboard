var city = "";
var savedCities = [];
var fetchButton = document.getElementById("fetch-button");
var currentDateElement = document.getElementById("current-date");
var searchListElement = document.getElementById("search-list");

// current day displayed in current search results box
var rightNow = moment().format("MMMM Do, YYYY");

currentDateElement.textContent = rightNow;

// type city and click search button --> get current conditions for city from weather API
function getCurrent(city) {
  var requestUrlCurrent =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial" +
    "&appid=4cba12a73385abcc9d4e2c74697fadfa";

  fetch(requestUrlCurrent)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      var lon = data.coord.lon;
      var lat = data.coord.lat;

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
  icon.innerHTML = "";
  var iconImg = document.createElement("img");
  iconImg.setAttribute(
    "src",
    "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
  );
  icon.append(iconImg);
  // code to create and display current weather info
  var weatherContainer = document.querySelector(".city-info");
  weatherContainer.innerHTML = "";
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
  temp.textContent = `Temperature: ${data.main.temp} °F`;
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
    "&units=imperial" +
    "&appid=4cba12a73385abcc9d4e2c74697fadfa";

  fetch(requestUrlForecast)
    .then(function (response) {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displayForecast(data);
    });
}
/* function to display forecast info & create cards for 5-day forecast w/ information on each card  
(display date, icon of weather, temp, wind speed, humidity). Then run for loop to display only for next 5 days */
function displayForecast(data) {
  console.log(data);
  // for loop to only call next 5 days (not all 40), starting index at 3rd element and going every 8th one to ensure displaying 5 days
  var forecastContainer = document.querySelector(".forecast-info");
  forecastContainer.innerHTML = "";

  for (let i = 3; i < data.list.length; i += 8) {
    // create 5 cards
    var forecastCard1 = document.createElement("div");
    forecastCard1.setAttribute("class", "forecast-card");
    var forecastCardBody1 = document.createElement("div");
    forecastCardBody1.setAttribute("class", "forecast-body");

    var futureDate = document.createElement("p");
    futureDate.setAttribute("class", "weatherEl");
    var futureDateInfo = `${data.list[i].dt_txt}`;

    var futureIconImg = document.createElement("img");
    futureIconImg.setAttribute(
      "src",
      "https://openweathermap.org/img/w/" +
        data.list[i].weather[0].icon +
        ".png"
    );
    console.log(data.list[i].weather[0].icon);

    var futureTemp = document.createElement("p");
    futureTemp.setAttribute("class", "weatherEl");
    var futureHumidity = document.createElement("p");
    futureHumidity.setAttribute("class", "weatherEl");
    var futureWind = document.createElement("p");
    futureWind.setAttribute("class", "weatherEl");

    futureDate.textContent = moment(futureDateInfo).format("MMMM Do, YYYY");
    futureTemp.textContent = `Temperature: ${data.list[i].main.temp} °F`;
    futureHumidity.textContent = `Humidity: ${data.list[i].main.humidity} %`;
    futureWind.textContent = `Wind Speed: ${data.list[i].wind.speed} MPH`;

    // append info to cards
    forecastCardBody1.append(
      futureDate,
      futureIconImg,
      futureTemp,
      futureHumidity,
      futureWind
    );
    forecastCard1.append(forecastCardBody1);
    forecastContainer.append(forecastCard1);
  }
}

/* when fetch button is clicked, save the value of what the user types into the search bar
and run the getCurrent, saveCity, and displayCitySearch functions passing userInput */
fetchButton.addEventListener("click", (event) => {
  event.preventDefault();
  var userInput = document.querySelector(".search-city").value;

  getCurrent(userInput);
  saveCity(userInput);
  displayCitySearch(userInput);
});

/* function that gets the savedCities array from local storage, pushes userInput (city typed and searched) 
into the savedCities array, and then sets the savedCities array to local storage again*/
var saveCity = function (userInput) {
  savedCities = JSON.parse(localStorage.getItem("city")) || [];
  savedCities.push(userInput);
  localStorage.setItem("city", JSON.stringify(savedCities));
};

//function to display the array to the page (append list items to search list element)
var displayCitySearch = function (city) {
  var listItem = document.createElement("li");
  listItem.className = "list-item";
  listItem.textContent = city;
  searchListElement.append(listItem);
};

/* function to display text content of getCurrent function (current weather conditions) 
when saved city is clicked in the list on the left side of the page */
var searchSaveCity = function (e) {
  getCurrent(e.target.textContent);
};

/* function to get the array of city searches submitted by user & run through it via for loop and 
calling displayCitySearch function of that array to display the list of cities onto the page in search history */
var renderPreviousCities = function () {
  var previousCities = JSON.parse(localStorage.getItem("city")) || [];

  for (i = 0; i < previousCities.length; i++) {
    displayCitySearch(previousCities[i]);
  }
};

/* event listener added for when user clicks on saved item on left side of the page, 
it will run the searchSaveCity function to display text content of getCurrent function 
(current weather conditions) */
document
  .querySelector("#search-list")
  .addEventListener("click", searchSaveCity);

// run renderPreviousCities function
renderPreviousCities();
