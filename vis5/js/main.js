// Init global variables
let myStoryVis;
let type = 0;

// Load data using promises
let promises = [
    d3.json("data/world.geojson.json"),
    d3.csv("data/mismanaged_plastic.csv")
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
    let mapGeoJson = dataArray[0];
    let mismanaged_plastic = dataArray[1];

    // Init story
    myStoryVis = new StoryVis(document.getElementById('story'), mapGeoJson, mismanaged_plastic);
}

// Selector listener
function nextSlide() {
    if (type < 6) {
        type += 1;
    }
    console.log("type changed to", type)
    myStoryVis.wrangleData();
}
// Selector listener
function previousSlide() {
    if (type > 0) {
        type -= 1;
    }
    console.log("type changed to", type)
    myStoryVis.wrangleData();
}
function resetSlides() {
    type = 0;
    console.log("type changed to", type)
}


