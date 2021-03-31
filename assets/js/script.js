const forecastLength = 5;
var searchHistory = JSON.parse(localStorage.getItem('weatherHistory'))||[]; // will load search history if any, otherwise empty array
const apiKey = '03980b537ca60f266b837f5334942ed2';

var userInput = $('#cityInput');
var cityName;

var weatherHeading;
var temperature;
var humidity;
var wind;

$('#refresh-btn').on('click', function() {
    localStorage.removeItem('weatherHistory');
    location.reload();
});

$('#submit-btn').on('click', function() {
    if (userInput.val() === null) {
        return;
    } else {
        cityName = userInput.val();
        createHistoryItem(cityName);
        displayWeather(cityName);
    } 
});

displayHistory();

function displayWeather(cityName) {

    var forecastApi = 
    'https://api.openweathermap.org/data/2.5/forecast?q=' +
    cityName +
    "&units=imperial&appid=" + 
    apiKey;

    var weatherApi = 
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    cityName +
    '&units=imperial&appid=' + 
    apiKey;

    $.ajax({
        url: weatherApi,
        method: 'GET'
    }).then(function(response) {        
        console.log(response);
        getUVIndex(response.coord.lat, response.coord.lon);
        
        // show name of city
        weatherHeading = $('<h4>').text(cityName);
        var myCityTitle = $('#cityTitle');
        myCityTitle.append(weatherHeading);

        // Temperature of 'city'
        temperature = $('<p>').text(
            'Temperature: ' + Math.round(response.main.temp) + '°F'
        );
        // Humidity
        humidity = $('<p>').text(
            'Humidity: ' + response.main.humidity + '%'
        );
        // Wind
        wind = $('<p>').text(
            'Wind Speed: ' + Math.round(response.wind.speed) + 'mph'
        )
        
        //Append to html
        $('#weatherForCity').append(temperature, humidity, wind);


        
    });

    $.ajax({
        url: forecastApi,
        method: 'GET'
    }).then(function(response) {
        $('#forecastName').text('5 Day Forecast');
        for(var i = 1; i < forecastLength; i++) {
            var card = $("<div class='forecastCard'>");
            
            // unix timestamp 
            var sec = response.daily[i];
            var mS = sec * 1000;
            var date = new Date(mS);
            var dayOfWeek = date.toLocaleString('en-US', { weekday: 'long'});

            var fCardHeader = $('h4');
            fCardHeader.text(dayOfWeek);
            
            // Getting icon and appending
            var icon = $('<img>');
            icon.attr(
                'src', "http://openweathermap.org/img/wn/" +
                response.daily[i].weather[0].icon +
                ".png"
            );
            var iconCase = ('<p>').text='please show up';
            
            iconCase.append(icon);

            var cardTemp = $('<p>').text(
                'Temp:' + Math.round(response.daily[i].temp.day)
            );
            
            
            
            forecastCard.append (
                fCardHeader, iconCase, cardTemp
            );
        
            $('#forecast').append(card);
        }

    });

    // Append City Name to HTML



    
}

function createHistoryItem (cityName) {
    if(searchHistory.indexOf(cityName) === -1) {
        searchHistory.push(cityName);

        localStorage.setItem('weatherHistory', JSON.stringify(searchHistory));
        displayHistory();
    }
}

function displayHistory() {
       var listEl = $('#search-history');
    listEl.html('');
    for(var i = 0; i < searchHistory.length; i++) {
        var li = $('<li>');

        li.text(searchHistory[i]);
        li.on('click', function(event){
            var city = event.target.innerText;
            displayWeather(city);
        })
        listEl.append(li);
    }
}

function getUVIndex (lat, long) {
    console.log(lat, long);

}