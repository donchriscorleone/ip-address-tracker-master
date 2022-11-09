const baseApi = `https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.MY_API_KEY}`
const headers = {
    method: 'GET',
    headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    mode: "cors"
};

window.localStorage.setItem('maxAttempt', 1);
window.localStorage.setItem('currentTries', 0);

const form = document.getElementById('form');
const ipAddressInput = document.querySelector('input#address');
const ipAddressEl = document.querySelector('span[data-property="ipAddress"]');
const locationEl = document.querySelector('span[data-property="location"]');
const timezoneEl = document.querySelector('span[data-property="timezone"]');
const ispEl = document.querySelector('span[data-property="isp"]');

const map = L.map('map').setView([51.505, -0.09], 13)

window.addEventListener('load', (e) => {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    changeView(34.04915, -118.09462);
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let max = parseInt(getData('maxAttempt'));
    let currentTries = parseInt(getData('currentTries'));

    if (currentTries < max) {
        getLocation(ipAddressInput.value).then(res => {
            console.warn(res);
            changeElementValue(res);
            storeData('currentTries', ++currentTries);
        }).catch(err => {
            console.warn(err);
        });
    } else {
        window.alert('You only have limited access to this IP Address tracker site. Message me at my links on the footer section for more details.')
    }
})

function changeElementValue(result) {
    const {city, region, postalCode, lat, lng} = result.location;
    ipAddressEl.innerHTML = result.ip;
    locationEl.innerHTML = `${city}, ${region} ${postalCode}`
    timezoneEl.innerHTML = `UTC ${result.location.timezone}`
    ispEl.innerHTML = result.isp;
    changeView(lat, lng);
}

function changeView(lat, lng) {
    map.setView([lat + .015, lng]);

    var myIcon = L.icon({
        iconUrl: 'images/icon-location.svg',
        iconAnchor: [22, 94],
        // popupAnchor: [-3, -76],
    });
    L.marker([lat,lng], {icon: myIcon}).addTo(map);
}

function storeData(key, value) {
    window.localStorage.setItem(key, value);
}

function getData(key) {
    return window.localStorage.getItem(key);
}


function getLocation(ipAddress) {
    const api = `${baseApi}&ipAddress=${ipAddress}`;

    return fetch(api, headers)
    .then(res => res.json())
    .then(res => res)
    .catch(err => err)
}
