// Init global variables
let myBubbleVis;
let selectedCategory =  document.getElementById('category').value;

// Load data using promises
let promises = [
    d3.json("visuals/bubbles/data/motive.json", (row, i) => {
        row.map((d, i) => ({id: i + 1, ...d}))
    }),
    d3.json("visuals/bubbles/data/narrative.json", (row, i) => {
        row.map((d, i) => ({id: i + 1, ...d}))
    }),
    d3.json("visuals/bubbles/data/region.json", (row, i) => {
        row.map((d, i) => ({id: i + 1, ...d}))
    })
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data);
    })
    .catch(function (err) {
        console.log(err);
    });

// initMainPage
function initMainPage(dataArray) {
    let motiveData = dataArray[0];
    let narrativeData = dataArray[1];
    let regionData = dataArray[2];

    // Init bubbles
    myBubbleVis = new BubbleVis(document.getElementById('bubble'), motiveData, narrativeData, regionData);
}

// Selector listener
function toggleSplit() {
    myBubbleVis.wrangleData();
}
// Selector listener
function changeCategory() {
    myBubbleVis.wrangleData();
}
// Proper case function adapted from here: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();});
};