
// margin conventions & svg drawing area - since we only have one chart, it's ok to have these stored as global variables
// ultimately, we will create dashboards with multiple graphs where having the margin conventions live in the global
// variable space is no longer a feasible strategy.

let margin = {top: 40, right: 40, bottom: 60, left: 60};

let width = 700 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

// Proper case function adapted from here: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();});
};

// Using a viewbox in an attempt to be responsive
let svg = d3.select("#chart-area").append("svg")
	.attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Padding for some separation between line plot and axes
let padding = 25;

// Date parser
let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%Y");

// Scales
let x = d3.scaleTime()
	.range([padding, width - padding])
let y = d3.scaleLinear()
	.range([height - padding, padding])

// Create the Axes
let xAxis = d3.axisBottom()
	.scale(x)
	.tickFormat(d3.format("d"));
let yAxis = d3.axisLeft()
	.scale(y);

// Draw the x axis
let xGroup = svg.append("g")
	.attr("class", "axis x-axis")
	.attr("transform", `translate(0, ${height})`)

// Draw the y axis
let yGroup = svg.append("g")
	.attr("class", "axis y-axis")

// Create tooltip
let tooltip = d3.select("body")
	.append("div")
	.attr('class', 'd3-tip')

// Initialize data
loadData();

// FIFA world cup
let data;

// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv", row => {
		row.YEAR = parseDate(row.YEAR);
		row.TEAMS = +row.TEAMS;
		row.MATCHES = +row.MATCHES;
		row.GOALS = +row.GOALS;
		row.AVERAGE_GOALS = +row.AVERAGE_GOALS;
		row.AVERAGE_ATTENDANCE = +row.AVERAGE_ATTENDANCE;
		return row
	}).then(csv => {
		// Store csv data in global variable
		data = csv;

		// Create the line and slider
		createLine();
		buildSlider();
		// Show the edition of the first, most recent entry
		showEdition(data[0]);
		// Draw the visualization for the first time
		updateVisualization(minMaxDateRange(data));
	});
}

// Create the slider
function buildSlider() {
	let range = document.getElementById("range");
	noUiSlider.create(range, {
		// Range over all the dates
		range: {
			'min': d3.min(data, (d) => +formatDate(d.YEAR)),
			'max': d3.max(data, (d) => +formatDate(d.YEAR))
		},
		// World cups are 4 years apart
		step: 4,
		// World cups are 4 years apart
		margin: 8,
		// Start showing all the data
		start: minMaxDateRange(data),
		// Display colored bars between handles
		connect: true,
		// Move handle on tap, bars are draggable
		behaviour: 'tap-drag',
		tooltips: true,
		format: {
			to: function(value) {
				return d3.format("d")(value);
			},
			from: function(value) {
				return +value;
			}
		},
		pips: {
			mode: 'positions',
			values: [0, 25, 50, 75, 100],
			density: 4,
			stepped: true
		}
	});
	// Attach an event listener to the slider
	range.noUiSlider.on('slide', function (values, handle) {
		console.log(values);
		updateVisualization(values)
	});
}

// Render visualization
function updateVisualization(dateRange) {

	// Create the transition
	let t = d3.transition().duration(800);

	let selection = d3.select("#data-selected").property("value");
	console.log(selection);
	let filteredData = data.filter( (d) => ((+formatDate(d.YEAR) >= dateRange[0]) && (+formatDate(d.YEAR) <= dateRange[1])));

	// Label the date range
	d3.select("#date-range").text(`${dateRange[0]}-${dateRange[1]}`);

	// Set the listener for the data selector
	d3.select("#data-selected").on("change", () => updateVisualization(minMaxDateRange(filteredData)));

	// Create circles
	let circles = svg.selectAll("circle")
		.data(filteredData);

	// Update the scalers for the new data
	x.domain(minMaxDateRange(filteredData));
	y.domain([d3.min(filteredData, (d) => d[selection]), d3.max(filteredData, (d) => d[selection])]);
	console.log(filteredData);

	svg.select(".line")
		.datum(filteredData)
		.transition(t)
		.attr("d", d3.line(filteredData)
			.x(d=> x(+formatDate(d.YEAR)))
			.y(d=> y(d[selection]))
			.curve(d3.curveLinear)
		);

	// Create / Update circles
	circles
		.enter()
		.append("circle")
		.on("click", (event, d) => showEdition(d))
		.on("mouseover", () => tooltip.style("visibility", "visible"))
		.on("mouseout", () => tooltip.style("visibility", "hidden"))
		.on('mousemove', (event,d) => {
			selection = d3.select("#data-selected").property("value");
			return tooltip.html(d.EDITION + "<br>" + selection.replace("_", " ").toProperCase() + ":  " +
				d[selection].toLocaleString("en-US"))
				.style("top", `${event.pageY - 80}px`)
				.style("left", `${event.pageX - 70}px`)
		})
		.attr("cy", d=>y(height))
		.merge(circles)
		.transition(t)
		.attr("class", "tooltip-circle")
		.attr("cy", d=>y(d[selection]))
		.attr("cx", d=>x(+formatDate(d.YEAR)))
		.attr("r", 7);


	// Remove exiting circles
	circles.exit().remove();

	// Update x axis
	xGroup
		.transition(t)
		.call(xAxis);

	// Update y axis
	yGroup
		.transition(t)
		.call(yAxis)
}

// Show details for a specific FIFA World Cup
function showEdition(d) {
	document.getElementById('summary-edition').innerHTML = d.EDITION;
	document.getElementById("summary-winner").innerHTML = d.WINNER;
	document.getElementById("summary-goals").innerHTML = d.GOALS;
	document.getElementById("summary-avg-goals").innerHTML = d.AVERAGE_GOALS;
	document.getElementById("summary-matches").innerHTML = d.MATCHES;
	document.getElementById("summary-teams").innerHTML = d.TEAMS;
	document.getElementById("summary-attendance").innerHTML = d.AVERAGE_ATTENDANCE.toLocaleString("en-US");
}

// Create the line (path) that will be used by the updating
function createLine() {
	let selection = d3.select("#data-selected").property("value");

	// Scales for initial data
	x.domain(minMaxDateRange(data));
	y.domain([d3.min(data, (d) => d[selection]), d3.max(data, (d) => d[selection])]);

	// Create line
	let line = svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", d3.line(data)
			.x(d=> x(+formatDate(d.YEAR)))
			.y(d=> y(d[selection]))
			.curve(d3.curveLinear)
		);
}

// Given the current data, return the range of years as a 2 element array
function minMaxDateRange(currentData) {
	return [d3.min(currentData, (d) => +formatDate(d.YEAR)), d3.max(currentData, (d) => +formatDate(d.YEAR))];
}
