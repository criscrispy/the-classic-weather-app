let lat, lon, weather;
const proxyUrl = "https://ancient-crag-49665.herokuapp.com/" // To handle Cors errors

const button = document.getElementById('submit');

button.addEventListener('click', async event => {
    event.preventDefault();

    const data = { lat, lon, weather };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const db_response = await fetch('/api', options);
    const db_json = await db_response.json();
    console.log('db_json',db_json);
})


if ('geolocation' in navigator) {
    
    console.log('geolocation is available')

        navigator.geolocation.getCurrentPosition(async (position) => {
            lat = position.coords.latitude;
            lon =  position.coords.longitude;

            document.getElementById('latitude').textContent = lat.toFixed(3);
            document.getElementById('longitude').textContent = lon.toFixed(3);
            
            const API_URL = `weather/${lat},${lon}`;
            // const API_URL = `weather/${latToFixed3},${lonToFixed3}`;
            const options = {
            'method': "GET",
            'headers': { 'content-type': 'application/json'},
            }

            try {
                const response = await fetch(API_URL, options);
                const data = await response.json();
                console.log('full data', data);

                weather = data.weather;
                // const airQuality = data.airQuality;

                document.querySelector('#temp').textContent = `${weather.main.temp}°`;
                document.querySelector('#feels-like-temp').textContent = `${weather.main.feels_like}°`;
                document.querySelector('#temp-high').textContent = `${weather.main.temp_max}°`;
                document.querySelector('#temp-low').textContent = `${weather.main.temp_min}°`;
                document.querySelector('#weather-description').textContent = `${weather.weather[0].description}`;
                document.querySelector('#location').textContent = `${weather.name}`;
                document.querySelector('#current-time').textContent = `${Date(data.dt).toLocaleString()}`;

                // Air quality
                /* document.getElementById('aq_info').hidden = false;
                document.getElementById('aq_parameter').textContent = airQuality.parameter;
                document.getElementById('aq_value').textContent = airQuality.value;
                document.getElementById('aq_units').textContent = airQuality.unit;
                document.getElementById('aq_date').textContent = airQuality.lastUpdated;
                */
            } catch (error) {
                console.log(error);
                // if (airQuality.details) {
                //     document.getElementById('aq_info').hidden = true;
                //     document.getElementById('aq_notAvailable').hidden = false;
                // };
 
            }


        })
}
else {
    /* geolocation IS NOT available */
    console.log('Geolocation is NOT available')
}