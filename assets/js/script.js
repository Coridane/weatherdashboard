// Get user's current date for header
var date = new Date().toLocaleDateString();
console.log(date)

var recent = new Array

// Pull value from search field and reset form
function start() {
    var city = document.getElementById("input").value;
    document.getElementById("search").reset();    
     
    // Break it down into array
    var breakdown = city.toLowerCase().split(" ");
    console.log(breakdown)
    // Remove empty spaces (if any)
    var newBreakdown = breakdown.filter(function(el) {
        return el != "";
    })
    console.log(newBreakdown)

    
    // Case the beginning of each array index
    var properCity="";
    for (var i = 0; i < newBreakdown.length; i++) {
        console.log(i)
        newBreakdown[i] = newBreakdown[i][0].toUpperCase() + newBreakdown[i].slice(1);
        console.log(newBreakdown)
        properCity += " " + newBreakdown[i];
        console.log(properCity)
        recent.push(properCity)
        console.log(recent)    
    }  
    
    // Update current weather heading
    $("#targetCity")[0].textContent = properCity + " " + "(" + date + ")";

    // Append to the archive list
    $("#archive").append('<button type="button" class="name")>' + properCity)

    convertCity(city, properCity)

   
// Convert city into latitude and longitude with Geocoding API as required for the 5 day/3 hour API
function convertCity(city, properCity) {    
    var API = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=149861ed5d9f1dae44966127838b3fb0"
    console.log(API)

    fetch(API).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lat = data[0].lat;
                console.log(lat)
                var lon = data[0].lon;
                console.log(lon);

        var latLonPair = lat.toString() + " " + lon.toString();                                        
        console.log(latLonPair)

        localStorage.setItem(properCity, latLonPair)

        var API = "http://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=imperial&appid=149861ed5d9f1dae44966127838b3fb0"
        console.log(API)
        console.log(properCity)

    fetch(API).then(function (newResponse) {
        if (newResponse.ok) {
            newResponse.json().then(function (newData) {               
            currentWeather(newData, properCity);
            })
        }
    })
            })
        } else {
            alert("City cannot be found")
        }
    })
}

function archivedCity(coordinates) {
 
    var API = "http://api.openweathermap.org/data/3.0/onecall?lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&exclude=hourly,minutely&units=imperial&appid=149861ed5d9f1dae44966127838b3fb0"    
    
    fetch(API).then(function (response) {
        if (response.ok) {
        response.json().then(function (data) {
            currentWeather(data);
        })
    }})
}

function currentWeather(data, properCity) {
    // Current weather box    
    $("#icon")[0].src = "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@4x.png"
    $("#temp")[0].textContent = data.current.temp.toFixed(0) + "\u00B0F"
    $("#hum")[0].textContent = data.current.humidity + "%"
    $("#wind")[0].textContent = data.current.wind_speed.toFixed(0) + " mph"

    if (data.current.temp > 70) {
        document.querySelector("#temp").style.color = "red"
    } else { 
        document.querySelector("#temp").style.color = "blue"
    }

    // Forecast weather boxes
    document.getElementById("results").style.display = "block";
    document.getElementById("day1").style.display = "inline-block";
    document.getElementById("day2").style.display = "inline-block";
    document.getElementById("day3").style.display = "inline-block";
    document.getElementById("day4").style.display = "inline-block";
    document.getElementById("day5").style.display = "inline-block";  
    
    forecast()

function forecast() {
    
    for (var i = 0; i < 5; i++) {
        var weatherForecast = {
            date: convertTime(data, i),                
            icon: "https://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + ".png",
            temp: data.daily[i + 1].temp.day.toFixed(0),
            hum: data.daily[i + 1].humidity,
            wind: data.daily[i + 1].wind_speed.toFixed(0)
        }

        console.log(weatherForecast.date)

        var selector = "#d" + i + "-date";
        console.log(selector)
        $(selector)[0].textContent = weatherForecast.date;
        var selector = "#d" + i + "-icon";
        $(selector)[0].src = weatherForecast.icon;
        var selector = "#d" + i + "-temp";
        $(selector)[0].textContent = "Temp: " + weatherForecast.temp + "\u00B0F";
        var selector = "#d" + i + "-hum";
        $(selector)[0].textContent = "Humidity: " + weatherForecast.hum + "%";
        var selector = "#d" + i + "-wind";
        $(selector)[0].textContent = "Wind: " + weatherForecast.wind + " mph";
         
}

function convertTime(data, index) {
    var newDate = new Date(data.daily[index + 1].dt * 1000);
    return (newDate.toLocaleDateString());
}

$("#archive").on("click", ".name", function() {
    
    var coordinates = (localStorage.getItem($(this)[0].textContent)).split(" ");
    coordinates[0] = parseFloat(coordinates[0]);
    coordinates[1] = parseFloat(coordinates[1]);

    $("#targetCity")[0].textContent = $(this)[0].textContent + " " + date;
    
    archivedCity(coordinates)
})
}
}
}