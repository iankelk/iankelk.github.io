/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables, switches, helper functions
let myGlobeVis;
let myTimelineVis;

// Date parser to convert strings to date objects
let parseDate = d3.timeParse("%Y");
let formatYear = d3.timeFormat("%Y");

function updateAllVisualizations(){
    myGlobeVis.wrangleData()
}

// load data using promises
let promiseGlobe = [
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"),
    d3.tsv("visuals/globe/data/historyfake.tsv")
];

Promise.all(promiseGlobe)
    .then( function(data){

        // prepare the data
        data = prepareDataGlobe(data);
        initMainPageGlobe(data)
    })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPageGlobe(allDataArray) {
    // Create div
    myGlobeVis = new GlobeVis('globeDiv', allDataArray[0], allDataArray[1])
    myTimelineVis = new TimelineVis('timelineDiv', allDataArray[0], allDataArray[1])

}

function prepareDataGlobe(data) {

    // Convert the strings to dates
    data[1].forEach(d => {
        d.year = parseDate(d.year);
    });


    return data
}