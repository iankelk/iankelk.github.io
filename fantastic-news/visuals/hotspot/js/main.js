// Init global variables

let myHoverVis;


// Load data using promises
let promisesHotspot = [
    d3.json("visuals/hotspot/data/hotspots.json", (row, i) => {
        row.map((d, i) => ({id: i + 1, ...d}))
    })
];


Promise.all(promisesHotspot)
    .then(function (data) {
    initMainPageHotspot(data);
})
    .catch(function (err) {
        console.log(err);
    });

// initMainPage
function initMainPageHotspot(dataArray) {
    let data = dataArray[0];

    // Init hover
    myHoverVis = new HoverVis(document.getElementById('hotspot-image'), data);
}

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
