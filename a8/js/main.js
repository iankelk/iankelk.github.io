// Bar chart configurations: data keys and chart titles
let configs = [
    {key: "ownrent", title: "Own or Rent"},
    {key: "electricity", title: "Electricity"},
    {key: "latrine", title: "Latrine"},
    {key: "hohreligion", title: "Religion"}
];

// Initialize variables to save the charts later
let barcharts = [];
let areachart;

// Date parser to convert strings to date objects
let parseDate = d3.timeParse("%Y-%m-%d");

// (1) Load CSV data
// 	(2) Convert strings to date objects
// 	(3) Create new bar chart objects
// 	(4) Create new are chart object

d3.csv("data/household_characteristics.csv", d => {
    // convert numeric fields to numbers
    d.survey = parseDate(d.survey);
    d.population = +d.population;
    return d;
}).then( data => {
    // Build and display the charts
    drawAreaChart(data);
    drawBarChart(data);
});

// React to 'brushed' event and update all bar charts
function brushed(event) {
    // If no region was selected, reset the filtering
    if (event.selection === null) {
        barcharts.forEach(d => d.selectionChanged(null));
        return;
    }
    // Get the extent of the current brush
    let selectionRange = d3.brushSelection(d3.select(".brush").node());
    // Convert the extent into the corresponding domain values
    let selectionDomain = selectionRange.map(areachart.x.invert);
    // Update barcharts
    barcharts.forEach(d => d.selectionChanged(selectionDomain));
}

function drawBarChart(data) {
    // Create the bar chart objects
    configs.forEach(function(d,i){
        barcharts[i] = new BarChart(document.getElementById(configs[i].key), data, configs[i]);
    });
}

function drawAreaChart(data) {
    // Create the area chart
    areachart = new AreaChart(document.getElementById("timeline"), data);
}