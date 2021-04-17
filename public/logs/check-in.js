
const mymap = L.map('checkinMap').setView([0, 0], 1);
const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tileUrl =
    'https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);


getData();

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    console.log('data', data)

    for (item of data) {
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);
        let txt = `The weather here at ${item.weather.name} (${item.lat}&deg;,
        ${item.lon}&deg;) is ${item.weather.weather[0].description} 
        with a temperature of ${item.weather.main.temp}&deg; C.`;

        marker.bindPopup(txt);
    }
}
