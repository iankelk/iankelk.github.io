// Init global variables
let myForceVis;
let selectedCategory =  document.getElementById('category').value;

// Load data using promises
let promises = [
    d3.json("data/miserables.json", (row, i) => {
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
    let miserablesData = dataArray[0];

    console.log(miserablesData);
    // Init force
    myForceVis = new ForceVis(document.getElementById('force'), miserablesData);
}

// Selector listener
function changeCategory() {
    myForceVis.wrangleData();
}
// Proper case function adapted from here: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();});
};