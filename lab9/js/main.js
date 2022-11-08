// Function to convert date objects to strings or reverse
let dateFormatter = d3.timeFormat("%Y-%m-%d");
let dateParser = d3.timeParse("%Y-%m-%d");

let countVis;
// (1) Load data with promises

let promises = [
    d3.json("data/perDayData.json"),
    d3.json("data/myWorldFields.json")
];

Promise.all(promises)
    .then(function (data) {
        createVis(data)
    })
    .catch(function (err) {
        console.log(err)
    });

function createVis(data) {
    let perDayData = data[0]
    let metaData = data[1]

    // (2) Make our data look nicer and more useful
    allData = perDayData.map(function (d) {

        let result = {
            time: dateParser(d.day),
            count: +d["count(*)"] + 1
        };

        // Convert votes for the 15 priorities from key-value format into one single array (for each day)
        result.priorities = d3.range(0, 15).map(function (counter) {
            return d["sum(p" + counter + ")"]
        });
        // [d["sum(p0)"], d["sum(p1)"], d["sum(p2)"],...]
        // Example: [10,200,500,... ]

        // Create an array of values for age 0 - 99
        result.ages = d3.range(0, 99).map(function () {
            return 0;
        });

        // Insert the votes in the newly created array 'result.ages'
        d.age.forEach(function (a) {
            if (a.age < 100) {
                result.ages[a.age] = a["count(*)"];
            }
        })
        return result;
    });


    // (3) Create event handler
    let eventHandler = {
        bind: (eventName, handler) => {
            document.body.addEventListener(eventName, handler);
        },
        trigger: (eventName, extraParameters) => {
            document.body.dispatchEvent(new CustomEvent(eventName, {
                detail: extraParameters
            }));
        }
    }

    // (4) Create visualization instances
    countVis = new CountVis("countvis", allData, eventHandler);
    let ageVis = new AgeVis("agevis", allData);
    let prioVis = new PrioVis("priovis", allData, metaData);

    // (5) Bind event handler
    eventHandler.bind("selectionChanged", function(event){
        let rangeStart;
        let rangeEnd;
        let vis = countVis;
        // Check if we have a brushed selection, or the selection has been cleared
        if (event.detail !== null) {
            rangeStart = event.detail[0];
            rangeEnd = event.detail[1];
        } else {
            rangeStart = vis.x.invert(0);
            rangeEnd = vis.x.invert(vis.width);
        }
        // Update all the visualizations
        countVis.onSelectionChange(rangeStart, rangeEnd);
        ageVis.onSelectionChange(rangeStart, rangeEnd);
        prioVis.onSelectionChange(rangeStart, rangeEnd);
    });
}
// Function called by the reset zoom button
function resetZoom() {
    countVis.resetZoom();
}