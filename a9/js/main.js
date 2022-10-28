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

// load data using promises
let promises = [

    // d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),  // not projected -> you need to do it
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to fit your browser window
    d3.csv("data/covid_data_20.csv"),
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

    // log data
    // console.log('check out the data', dataArray);

    // init table
    myDataTable = new DataTable('tableDiv', dataArray[1], dataArray[2]);

    // TODO - init map
    myMapVis = new MapVis('mapDiv', dataArray[0], dataArray[1], dataArray[2]);

    // TODO - init bars
    myBarVisOne = new BarVis('barDiv', true, "Worst");
    myBarVisTwo = new BarVis('barTwoDiv', false, "Best");

    // init brush
    myBrushVis = new BrushVis('brushDiv', dataArray[1]);
}

function categoryChange() {
    selectedCategory =  document.getElementById('categorySelector').value;
    myMapVis.wrangleData(); // maybe you need to change this slightly depending on the name of your MapVis instance
    myBarVisOne.wrangleData();
    myBarVisTwo.wrangleData();
}
