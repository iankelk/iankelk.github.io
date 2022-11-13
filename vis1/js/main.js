// Init global variables
let myBubbleVis;
let selectedCategory =  document.getElementById('category').value;


// Load data using promises
let promises = [
    d3.json("data/motive.json", (row, i) => {
        row.map((d, i) => ({id: i + 1, ...d}))
    }),
    d3.json("data/narrative.json", (row, i) => {
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
    let motiveData = dataArray[0];
    let narrativeData = dataArray[1];

    // Init matrix
    myBubbleVis = new BubbleVis(document.getElementById('bubble'), motiveData, narrativeData);
}

// Selector listener
function toggleSplit() {
    myBubbleVis.wrangleData();
}
// Selector listener
function changeCategory() {
    myBubbleVis.wrangleData();
}
