// Init global variables
let myForceVis;
let selectedCategoryForceDirect =  document.getElementById('category-force-direct').value;

// Load data using promises
let promisesForceDirect = [
    d3.json("visuals/forceDirect/data/misinfo6.json", (row, i) => {
        row.map((d, i) => ({id: i + 1, ...d}))
    })
];

Promise.all(promisesForceDirect)
    .then(function (data) {
        initMainPageForceDirect(data);
    })
    .catch(function (err) {
        console.log(err);
    });

// initMainPage
function initMainPageForceDirect(dataArray) {
    let data = dataArray[0];

    // Init force
    myForceVis = new ForceVis(document.getElementById('force'), data);
}

// Selector listener
function changeCategoryForceDirect() {
    selectedCategoryForceDirect =  document.getElementById('category-force-direct').value;
    myForceVis.wrangleData();
}
// Proper case function adapted from here: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();});
};

// var string="The water content is considered acceptable for this voltage class. Dielectric Breakdown Voltage is unacceptable for transformers > 288 KV. Power factors, Interfacial Tension and Neutralization Number are acceptable for continued use in-service.";
function splitLongString(N, longString) {
    let app = longString.split(' '),
        arrayApp = [],
        stringApp = "";
    app.forEach(function (sentence, index) {
        stringApp += sentence + ' ';

        if ((index + 1) % N === 0) {
            arrayApp.push(stringApp);
            stringApp = '';
        } else if (app.length === index + 1 && stringApp !== '') {
            arrayApp.push(stringApp);
            stringApp = '';
        }
    });
    return arrayApp.join("<br />");
};

// When the user clicks on <div>, open the popup
function helpForceDirect() {
    let popup = document.getElementById("help-force-direct");
    popup.classList.toggle("show");
}
