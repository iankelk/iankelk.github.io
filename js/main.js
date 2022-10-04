// SVG drawing area
let margin = {top: 40, right: 10, bottom: 20, left: 80};

let width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scales
let x = d3.scaleBand()
	.rangeRound([0, width])
	.paddingInner(0.1);

let y = d3.scaleLinear()
	.range([height, 0]);

// Create the Axes
let xAxis = d3.axisBottom()
	.scale(x);
let yAxis = d3.axisLeft()
	.scale(y);

// Draw the x axis
let xGroup = svg.append("g")
	.attr("class", "axis x-axis")
	.attr("transform", `translate(0, ${height})`)

// Draw the y axis
let yGroup = svg.append("g")
	.attr("class", "axis y-axis")

// Create the Y axis label
yGroup
	.append("text")
	.attr("transform", `rotate(-90)translate(${-height/2}, -300)`)
	.attr("class", "axis-label y-label")
	.attr("text-anchor", "middle")
	.attr("x", 0)
	.attr("y", 233)
	.text("stores");

// Initialize UI
let initialRanking = d3.select("#ranking-type").property("value");
let sortByCompanies = true;

console.log(initialRanking);

// Initialize data
loadData();

// Create a 'data' property under the window object
// to store the coffee chain data
Object.defineProperty(window, 'data', {
	// data getter
	get: function() { return _data; },
	// data setter
	set: function(value) {
		_data = value;
		// update the visualization each time the data property is set by using the equal sign (e.g. data = [])
		updateVisualization()
	}
});


// Load CSV file
function loadData() {
	d3.csv("data/coffee-house-chains.csv").then(csv=> {

		csv.sort((a,b)=> b.stores - a.stores);

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
		});

		// Store csv data in global variable
		data = csv;

		// updateVisualization gets automatically called within the data = csv call;
		// basically(whenever the data is set to a value using = operator);
		// see the definition above: Object.defineProperty(window, 'data', { ...
	});
}

// option 1: D3
d3.select("#ranking-type").on("change", updateVisualization);

d3.select("#change-sorting").on("click", () => {
	sortByCompanies = !sortByCompanies;
	updateVisualization();
});

// Render visualization
function updateVisualization() {

	// Choose selection based on dropdown
	let selection = d3.select("#ranking-type").property("value");
	let filteredData = data.map(function(d){return {company: d.company, value: d[selection]}});

	// Sort data based on sort button
	let sortedData = sortData(filteredData,sortByCompanies);

	// Update the scalers for the new data
	x.domain(sortedData.map( (d) => d.company));
	y.domain([0, d3.max(sortedData, (d) => d.value)]);

	// Define the bar chart
	let bar = svg.selectAll("rect")
		// Custom key function
		.data(sortedData, function(entry) { return entry.company; });
		// Basic keys by index
		//.data(sortedData);

	// Update the axes
	xAxis.scale(x)
	yAxis.scale(y)

	// Enter and update the bar chart
	bar
		.enter()
		.append("rect")
		.merge(bar)
		.style("opacity", 0.5)
		.transition()
		.duration(1000)
		.style("opacity", 1)
		.attr("class", "bar")
		.attr("x", (d) => x(d.company))
		.attr("y", (d) => y(d.value))
		.attr("width", x.bandwidth())
		.attr("height", d=> height - y(d.value));

	// Remove the old bar chart
	bar.exit().remove();

	// Update x axis
	xGroup
		.transition()
		.duration(1000)
		.call(xAxis)

	// Update y axis
	yGroup
		.transition()
		.duration(1000)
		.call(yAxis)

	// Append y axis label
	svg.selectAll(".axis-label.y-label")
		.text(selection);
}

function sortData(data, toggle){
	if (toggle) {
		return data.sort( (a,b) => b.value - a.value);
	} else {
		return data.sort( (a,b) => a.value - b.value);
	}
}