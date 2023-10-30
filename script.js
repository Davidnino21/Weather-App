const apiKey = '3e46641435106cd551f54efea8fc1b0a';
const geoApi = 'https://api.openweathermap.org/geo/1.0/direct?';
var city = ""

var searchBtn = document.querySelector("#search-btn");
searchBtn.addEventListener('click', function () {
    city = document.querySelector("#city-input").value;
    geoCoordinates()
})

function geoCoordinates() {
    fetch(`${geoApi}q=${city}&appid=${apiKey}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error: ' + response.status);
            }
        })
        .then(data => {
            getForcast(data[0].lat, data[0].lon)
        })
        .catch(error => {
            console.log('Error:', error);
        });
}
function getForcast(lat, lon) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error: ' + response.status);
            }
        })
        .then(data => {
            // console.log(data);
            var currentDate = ""
            const list = []
            data.list.forEach(function (d) {
                var dt = d.dt_txt.split(" ")[0]
                if (currentDate != dt) {
                    currentDate = dt
                    list.push(d)
                }
            });
            console.log(list)
            displayContent(list)


        })
        .catch(error => {
            console.log('Error:', error);
        });

}

function displayContent(list) {
    displayToday(list[0])
    displayFiveDay(list.slice(1))
    saveToLocalStorage(list)
    showHistory()
}

function getIcon(icon) {
    return `https://openweathermap.org/img/w/${icon}.png`
}

function formatDate(dt) {
    let date = new Date(dt)
    return date.toLocaleDateString()
}
function displayToday(data) {
    var html = `
    <h3 class="fw-bold">${city} (${formatDate(data.dt_txt)}) <img src="${getIcon(data.weather[0].icon)}" alt=""></h3>
              <h6 class="my-3 mt-3">Temp: ${data.main.temp}°F</h6>
              <h6 class="my-3">Wind: ${data.wind.speed} MPH</h6>
              <h6 class="my-3">Humidity: ${data.main.humidity}%</h6>`
    document.querySelector("#main-forcast").innerHTML = html;
}

function displayFiveDay(data) {
    var html = ""
    data.forEach(day => {
        html += `
    <div class="col mb-3">
            <div class="card border-0 bg-secondary text-white">
              <div class="card-body p-3 text-white">
                <h5 class="card-title fw-semibold">${formatDate(day.dt_txt)} </h5>
                <img src="${getIcon(day.weather[0].icon)}" alt="">
                <h6 class="card-text my-3 mt-3">Temp:${day.main.temp}°F</h6>
                <h6 class="card-text my-3">Wind:${day.wind.speed} MPH</h6>
                <h6 class="card-text my-3">Humidity:${day.main.humidity}%</h6>
              </div>
              </div>
            </div>`
    });
    document.querySelector(".days-forecast").innerHTML = html;
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem("cities")) || {}
}

function saveToLocalStorage(data) {
    const cities = getFromLocalStorage()
    cities[city] = data
    localStorage.setItem("cities", JSON.stringify(cities))
}

function showHistory() {
    const cities = getFromLocalStorage()
    let html = ""
    for (const key in cities) {
        html += `<button class="btn btn-secondary py-2 w-100 mt-2 mb-2">${key}</button>`
    }
    document.querySelector(".history").innerHTML = html;
    document.querySelector(".history").addEventListener("click", function(evt){
    if(evt.target.className.includes("btn")){
        var selectedCity = evt.target.innerHTML
        var cities = getFromLocalStorage()
        var data = cities[selectedCity]
        city = selectedCity
        console.log(data)
        displayContent(data)
    }
    })
}

window.onload = function () {
    showHistory()
}



