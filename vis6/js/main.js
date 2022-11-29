// Init global variables
let myWordCloud;

// Load data using promises
let promises = [
    d3.csv("data/wordcloud.csv")
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

    // Init story
    myWordCloud = new WordCloud(document.getElementById('wordcloud'), data);
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
    myStoryVis.wrangleData();
}


