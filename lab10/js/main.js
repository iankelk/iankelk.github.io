// Variable for the visualization instance
let stationMap;
let mbtaData;

// Hubway JSON feeds. One has station info only, the other has station status
const stationInfoURL = 'https://gbfs.bluebikes.com/gbfs/en/station_information.json';
const stationStatusURL = 'https://gbfs.bluebikes.com/gbfs/en/station_status.json';

// Load data using promises
let promises = [
    fetch(stationInfoURL).then(resp => resp.json()),
    fetch(stationStatusURL).then(resp => resp.json()),
    d3.json("data/MBTA-Lines.json").then(jsonData =>{ mbtaData = jsonData;})
];

// Wait til promises complete then call gettingStarted with the array
Promise.all(promises)
    .then(function (dataArray) {
        gettingStarted(dataArray);
    })
    .catch(function (err) {
        console.log(err);
    });

// Function that gets called once data has been fetched; we give this the array of fetched data
// From the data, we're creating the final data structure we need and create a new instance of the StationMap
function gettingStarted(dataArray) {

    console.log(dataArray);
    let station_data = dataArray[0].data.stations;
    let station_status = dataArray[1].data.stations;

    // From: https://stackoverflow.com/questions/19480008/javascript-merging-objects-by-id
    const allData = station_data.map(t1 => ({...t1, ...station_status.find(t2 => t2.station_id === t1.station_id)}))
    console.log(allData);

    // create empty data structure
    let displayData = [];

    // Prepare data by looping over stations and populating empty data structure
    allData.forEach((d,i)=>{
        displayData.push({
            index: i,
            name: d.name,
            capacity: d.capacity,
            numBikesAvailable: d.num_bikes_available,
            numBikesDisabled: d.num_bikes_disabled,
            numEbikesAvailable: d.num_ebikes_available,
            numDocksAvailable: d.num_docks_available,
            numDocksDisabled: d.num_docks_disabled,
            lat: d.lat,
            long: d.lon
        })
    })

    // Display number of stations in DOM
    document.getElementById('station-count').innerText = station_data.length;

    // Instantiate visualization object (bike-sharing stations in Boston)
    stationMap = new StationMap("station-map", displayData, mbtaData, [42.360082, -71.058880]);
}
