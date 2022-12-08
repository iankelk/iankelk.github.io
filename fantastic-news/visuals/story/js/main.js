// Init global variables
let myStoryVis;
let type = 0;

// Load data using promises
let promisesStory = [
    d3.json("/project/visuals/story/data/world.geojson.json"),
    d3.csv("/project/visuals/story/data/fake_news_story.csv")
];

Promise.all(promisesStory)
    .then(function (data) {
        initMainPageStory(data);
    })
    .catch(function (err) {
        console.log(err);
    });

// initMainPage
function initMainPageStory(dataArray) {
    let mapGeoJson = dataArray[0];
    let fake_news_data = dataArray[1];

    // Init story
    myStoryVis = new StoryVis(document.getElementById('story'), mapGeoJson, fake_news_data);
}

// Selector listener
function nextSlide() {
    if (type < 6) {
        type += 1;
    } else {
        type = 0;
    }
    console.log("type changed to", type)
    myStoryVis.morph(type);
}
// Selector listener
function previousSlide() {
    if (type > 0) {
        type -= 1;
    } else {
        type = 6;
    }
    console.log("type changed to", type)
    myStoryVis.morph(type);
}
function resetSlides() {
    type = 0;
    console.log("type changed to", type)
    myStoryVis.morph(type);
}


