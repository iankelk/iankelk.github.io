// Init global variables
let myHoverVis;

// Load data using promises
let promises = [
    d3.json("data/hotspots.json", (row, i) => {
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
    let data = dataArray[0];

    // Init force
    myHoverVis = new HoverVis(document.getElementById('hotspot-image'), data);
}

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
