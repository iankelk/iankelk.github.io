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



