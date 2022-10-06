
// margin conventions & svg drawing area - since we only have one chart, it's ok to have these stored as global variables
// ultimately, we will create dashboards with multiple graphs where having the margin conventions live in the global
// variable space is no longer a feasible strategy.

let margin = {top: 40, right: 40, bottom: 60, left: 60};

let width = 600 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Date parser
let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%Y");

// Scales
let x = d3.scaleTime()
	.range([0, width])
let y = d3.scaleLinear()
	.range([height,0])

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

		// Create the line and slider with initial values
		createLine();
		buildSlider();
		// Draw the visualization for the first time
		updateVisualization(minMaxDateRange(data));
	});
}

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
		margin: 4,
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
	let selectedData = data.map(function(d){ return {...d, value:d[selection]}});
	let filteredData = selectedData.filter( (d) => ((+formatDate(d.YEAR) >= dateRange[0]) && (+formatDate(d.YEAR) <= dateRange[1])));

	// Set the listener for the data selector
	d3.select("#data-selected").on("change", () => updateVisualization(minMaxDateRange(filteredData)));

	// Create circles
	let circles = svg.selectAll("circle")
		.data(filteredData);

	// Update the scalers for the new data
	x.domain(minMaxDateRange(filteredData));
	y.domain([d3.min(filteredData, (d) => d.value), d3.max(filteredData, (d) => d.value)]);
	console.log(filteredData);

	svg.select(".line")
		.datum(filteredData)
		.transition(t)
		.attr("d", d3.line(filteredData)
			.x(d=> x(+formatDate(d.YEAR)))
			.y(d=> y(d[selection]))
			.curve(d3.curveLinear)
		);

	circles.exit().remove();

	// Create / Update circles
	circles
		.enter()
		.append("circle")
		.data(filteredData)
		.merge(circles)
		.transition(t)
		.attr("class", "chart-point")
		.attr("cx", d=>x(+formatDate(d.YEAR)))
		.attr("cy", d=>y(d.value))
		.attr("r", 5)

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
function showEdition(d){
	
}

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

function minMaxDateRange(currentData) {
	return [d3.min(currentData, (d) => +formatDate(d.YEAR)), d3.max(currentData, (d) => +formatDate(d.YEAR))];
}
