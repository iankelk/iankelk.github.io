// Init global variables
let myMatrixVis;

// Load data using promises
let promises = [
    d3.csv("data/florentine-family-attributes.csv", (row, i) => {
        // Convert numeric fields to numbers
        row.Wealth = +row.Wealth;
        row.Priorates = +row.Priorates;
        return row;
    }),

    // It turned out to be tricky reading in the CSVs of the matrices. There seems to be no way
    // to do it in D3 currently when the CSV doesn't have column headers, so I added them.
    d3.csv("data/marriages.csv", (row, i) => {
        // Convert all fields to numbers
        let arr = [];
        for (let i = 1; i < (Object.keys(row).length+1); i++) {
            arr.push(+row["col" + i]);
        }
        return arr;
    }),

    d3.csv("data/businesses.csv", (row, i) => {
        // Convert all fields to numbers
        let arr = [];
        for (let i = 1; i < (Object.keys(row).length+1); i++) {
            arr.push(+row["col" + i]);
        }
        return arr;
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
    let familyData = dataArray[0];
    let marriageData = dataArray[1];
    let businessData = dataArray[2];
    let preparedData = [];

    marriageData.forEach((d, i)=>{
        let numMarriages = d3.sum(d);
        let numBusinesses = d3.sum(businessData[i]);
        let numCombined = numMarriages + numBusinesses;

        preparedData.push({
            index: i,
            name: familyData[i].Family,
            allRelations: numCombined,
            businessTies: numBusinesses,
            businessValues: businessData[i],
            marriages: numMarriages,
            marriageValues: d,
            numPriorates: familyData[i].Priorates,
            wealth: familyData[i].Wealth
        });
    })
    initMainPage(preparedData);
}

// initMainPage
function initMainPage(data) {
    // Init matrix
    myMatrixVis = new MatrixVis(document.getElementById('matrix'), data);
}

// Selector listener
function changeOrdering() {
    myMatrixVis.wrangleData();
}
