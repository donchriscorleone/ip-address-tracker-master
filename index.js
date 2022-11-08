const apiKey = "at_04riVppoAWt4NcDU4dwB266oQabhl"; //Please don't use my key.

const baseApi = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`
const headers = {
    method: 'GET',
    headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    mode: "cors"
};

window.localStorage.setItem('maxAttempt', 2);
window.localStorage.setItem('currentTries', 0);

const form = document.getElementById('form');
const ipAddressInput = document.querySelector('input#address');
const ipAddressEl = document.querySelector('span[data-property="ipAddress"]');
const locationEl = document.querySelector('span[data-property="location"]');
const timezoneEl = document.querySelector('span[data-property="timezone"]');
const ispEl = document.querySelector('span[data-property="isp"]');


form.addEventListener('submit', (e) => {
    e.preventDefault();
    let max = parseInt(getData('maxAttempt'));
    let currentTries = parseInt(getData('currentTries'));

    if (currentTries < max) {
        getLocation(ipAddressInput.value).then(res => {
            console.warn(res);
            const {city, region, postalCode} = res.location;
            ipAddressEl.innerHTML = res.ip;
            locationEl.innerHTML = `${city}, ${region} ${postalCode}`
            timezoneEl.innerHTML = `UTC ${res.location.timezone}`
            ispEl.innerHTML = res.isp;

            storeData('currentTries', ++currentTries);
        }).catch(err => {
            console.warn(err);
        });
    } else {
        window.alert('You only have limited access to this IP Address tracker site. Message me at my links on the footer section for more details.')
    }
})

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
