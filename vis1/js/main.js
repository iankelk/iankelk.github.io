// Init global variables
let myBubbleVis;

// Load data using promises
let promises = [
    d3.json("data/data2.json", (row, i) => {
        row.map((d, i) => ({id: i + 1, ...d}))
    })
];

Promise.all(promises)
    .then(function (data) {
        prepareData(data);
    })
    .catch(function (err) {
        console.log(err);
    });

// Prepare data by constructing the familiar data structure from the 3 datasets
function prepareData(dataArray) {
    // let familyData = dataArray[0];
    // let marriageData = dataArray[1];
    // let businessData = dataArray[2];
    // let preparedData = [];
    //
    // marriageData.forEach((d, i)=>{
    //     let numMarriages = d3.sum(d);
    //     let numBusinesses = d3.sum(businessData[i]);
    //     let numCombined = numMarriages + numBusinesses;
    //
    //     preparedData.push({
    //         index: i,
    //         name: familyData[i].Family,
    //         allRelations: numCombined,
    //         businessTies: numBusinesses,
    //         businessValues: businessData[i],
    //         marriages: numMarriages,
    //         marriageValues: d,
    //         numPriorates: familyData[i].Priorates,
    //         wealth: familyData[i].Wealth
    //     })
    // })
    console.log(dataArray);
    initMainPage(dataArray);
}

// initMainPage
function initMainPage(data) {
    // Init matrix
    myBubbleVis = new BubbleVis(document.getElementById('bubble'), data[0]);
}

// Selector listener
function changeSelection() {
    myBubbleVis.wrangleData();
}
