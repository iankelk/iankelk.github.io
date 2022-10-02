// Global constants
const barWidth = 42;
const barPadding = 6;
const barRightOffset = 275;
const textLeftOffset = 6;
const textRightOffset = 10;
const textTopOffset = 5;
const units = ["height_m", "height_ft"];

// Global variables to allow unit switching
let unit = "height_m";
let current_index = 0;

d3.csv("data/buildings.csv", (row) => {
    // Convert numeric fields to numbers
    row.height_ft = +row.height_ft;
    row.height_m = +row.height_m;
    row.height_px = +row.height_px;
    row.floors = +row.floors;
    return row
}).then( (data) => {
    // Sort the data
    data.sort( (a,b) => b.height_m - a.height_m);
    // Add an index to the data
    for (let i = 0; i < data.length; i++) {
        data[i].i = i;
    }
    // Log the current state of the data with the index
    console.log(data)

    // Create the visualization barchart area
    let svg = d3.select("#barchart")
        .append("svg")
        .attr('width', 550)
        .attr('height', 500);

    // Draw the bar chart and summary. Initialize it to current index which is initially 0
    drawBarChart(svg, data);
    showSummary(data[current_index]);

    // Get the toggle for the units (feet or meters)
    let unit_toggle = document.querySelector('#units');
    // Add a listener to the unit toggle to update the units and regenerate the summary
    unit_toggle.addEventListener('change', (event) => {
        unit = units[+unit_toggle.checked]
        updateUnits();
        showSummary(data[current_index])
    });
});

function drawBarChart(svg, data) {
    // Draw bars with click listener
    let bars = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr('x', barRightOffset)
        .attr('y', (d, i) =>  (barWidth + barPadding) * i)
        .attr('width', (d) => d.height_px )
        .attr('height', barWidth)
        .attr('class', 'building-bar')
        .on('click', (event, d) => showSummary(d));

    // Add building name labels with click listener
    let buildingNames = bars.select("text.label-name")
        .data(data)
        .enter()
        .append("text")
        .attr('class', 'label-name')
        .attr("x", () => barRightOffset - textRightOffset)
        .attr("y", (d, i) => (barWidth + barPadding) * i + barWidth / 2 + textTopOffset)
        .text((d) => d.building)
        .on('click', (event, d) => showSummary(d));

    // Add height labels to the bars
    let heightLabels = svg.selectAll("text.label-height")
        .data(data)
        .enter()
        .append("text")
        .attr('class', 'label-height')
        .attr("x", (d) => barRightOffset + d.height_px - textLeftOffset)
        .attr("y", (d, i) => (barWidth + barPadding) * i + barWidth / 2 + textTopOffset)
        .text( (d) => d[unit].toLocaleString("en-US"));
}

// Update the building heights in the bar chart when units are changed
function updateUnits() {
    d3.selectAll("text.label-height").each(function(d, i) {
        d3.select(this)
            .text(d[unit].toLocaleString("en-US"));
    });
}

// Display the summary on the side
function showSummary(data) {
    // Save the index of the current summary globally in case the units change
    current_index = data.i;
    // Get the height and height units dependong on the selection
    let height = data[unit];
    let height_unit = unit === "height_m" ? "m" : "ft";

    // Create the HTML for the summary table with the various bootstrap classes for appearance
    let summaryTable = `<h4>${data.building}</h4><br />`;
    summaryTable += `<table class='table table-responsive table-striped table-hover table-borderless'>`;

    summaryTable += `<tr><td class="header-cell">Height (${height_unit})</td>`;
    summaryTable += `<td class="header-cell"><b>${height.toLocaleString("en-US")}</b></td></tr>`;

    summaryTable += `<tr><td>City</td>`;
    summaryTable += `<td><b>${data.city}</b></td></tr>`;

    summaryTable += `<tr><td>Country</td>`;
    summaryTable += `<td><b>${data.country}</b></td></tr>`;

    summaryTable += `<tr><td>Floors</td>`;
    summaryTable += `<td><b>${data.floors}</b></td></tr>`;

    summaryTable += `<tr><td>Completed</td>`;
    summaryTable += `<td><b>${data.completed}</b></td></tr>`;

    summaryTable += `</tr></table></div>`;

    // Add the summary table to the DOM under the element "building-summary" and "building-image"
    document.getElementById("building-summary").innerHTML = summaryTable;
    document.getElementById('building-image').setAttribute('src', `/img/${data.image}`);

    // Add a wikipedia button with the link just the building name with spaces replaced with underscores
    let wiki_button = document.getElementById('wikipedia');
    wiki_button.setAttribute('href', `https://en.wikipedia.org/wiki/${data.building.replace(/ /g, '_')}`);
    wiki_button.innerHTML = `Wikipedia article for ${data.building}`;
}
