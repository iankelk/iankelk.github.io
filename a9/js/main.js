/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let myDataTable,
    myMapVis,
    myBarVisOne,
    myBarVisTwo,
    myBrushVis;

let selectedTimeRange = [];
let selectedState = '';
let selectedCategory =  document.getElementById('categorySelector').value;
let selectedYear = document.getElementById('yearSelector').value;



// load data using promises
let promises = [

    // d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),  // not projected -> you need to do it
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to fit your browser window
    d3.csv("data/covid_data_20.csv"),
    d3.csv("data/covid_data_22_clean.csv"),
    d3.csv("data/census_usa.csv")
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

// initMainPage
function initMainPage(dataArray) {

    myDataTable = new DataTable('tableDiv', dataArray[1], dataArray[2], dataArray[3]);

    // init map
    myMapVis = new MapVis('mapDiv', dataArray[0]);
    // init bars
    myBarVisOne = new BarVis('barDiv', true);
    myBarVisTwo = new BarVis('barTwoDiv', false);
    // init timeline
    myBrushVis = new BrushVis('brushDiv', dataArray[1], dataArray[2]);

}

function categoryChange() {
    selectedCategory =  document.getElementById('categorySelector').value;
    myMapVis.wrangleData();
    myBarVisOne.wrangleData();
    myBarVisTwo.wrangleData();
}

function yearChange() {
    selectedYear = document.getElementById('yearSelector').value;
    myDataTable.wrangleData();
    myBrushVis.brushGroup.call(myBrushVis.brush.clear);
    myBrushVis.wrangleDataStatic();
    myMapVis.wrangleData();
    myBarVisOne.wrangleData();
    myBarVisTwo.wrangleData();
}
