const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

// console.log(process.env);
const app = express();
// determing port
const port = process.env.PORT || 3001;

app.use(express.static('public'));
app.listen(port, () => console.log(`listening on port ${port}`));
app.use(express.json({ limit: '1mb' }))

/////////////////////////////////////////////
// Saving to a database
////////////////////////////////////////////
const database = new Datastore('database.db');
database.loadDatabase();
// const allData = [];

app.post('/api', (request, response) => {

    console.log('this is my request')
    const data = request.body;
    const timestamp = new Date().toLocaleString();
    data.timestamp = timestamp;
    database.insert(data);
    response.json({
        status: 'success',
        timestamp,
        lat: data.lat,
        lon: data.lon,
        mainTemp: data.weather.main.temp,
        feels_like: data.weather.main.feels_like,
        maxTEmp: data.weather.main.temp_max,
        minTEmp: data.weather.main.temp_min,
        weatherDescription: data.weather.weather[0].description,
        location: data.weather.name,

    })
})

/////////////////////////////////////////////
// Database query 
////////////////////////////////////////////
app.get('/api', (request, response) => {
    database.find({}, function (err, data) { // Find all entries from the database
        if (err) {
            console.log(err)
            response.end();
            return;
        }
        response.json(data);
    });
})

////////////////////////////////////////////
// Weather endpoint
//////////////////////////////////////////
app.get('/weather/:latlon', async (request, response) => {

    console.log('request params :', request.params);

    const latlon = request.params.latlon.split(',');
    console.log('using split to make latlon array', latlon)

    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);

    const options = {
        'method': "GET",
        'headers': { 'content-type': 'application/json' },
    }

    // fetching from weather api
    const weather_API_KEY = process.env.weather_API_KEY;
    const weather_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weather_API_KEY}`;

    const weatherFetchResponse = await fetch(weather_API_URL, options);
    const weatherJson = await weatherFetchResponse.json();

    // featching from air quality(aq) api - air quality
    // const aqAPI_URL = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    // const aqFetchResponse = await fetch(aqAPI_URL, options);
    // const aqJson = await aqFetchResponse.json();

    // const data = {weather : weatherJson, airQuality : aqJson};
    const data = { weather: weatherJson };

    response.json(data);

})
