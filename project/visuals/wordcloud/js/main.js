// Init global variables
let myWordCloud;

// Load data using promises
let promisesWordcloud = [
    d3.csv("/project/visuals/wordcloud/data/wordcloud.csv")
];

Promise.all(promisesWordcloud)
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



