// Init global variables
let myBubbleVis;
let selectedCategoryBubbles =  document.getElementById('category-bubbles').value;

// Load data using promises
let promisesBubbles = [
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

Promise.all(promisesBubbles)
    .then(function (data) {
        initMainPageBubbles(data);
    })
    .catch(function (err) {
        console.log(err);
    });

// initMainPage
function initMainPageBubbles(dataArray) {
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

// When the user clicks on <div>, open the popup
function helpBubbles() {
    let popup = document.getElementById("help-bubbles");
    popup.classList.toggle("show");
}