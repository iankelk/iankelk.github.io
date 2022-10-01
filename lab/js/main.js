// SVG Size
let width_raw = 700,
	height_raw = 500;

// Margin object with properties for the four directions
let margin = {top: 20, right: 10, bottom: 20, left: 40};

// Width and height as the inner dimensions of the chart area
let width = width_raw - margin.left - margin.right,
	height = height_raw - margin.top - margin.bottom;

// Load CSV file
d3.csv("data/wealth-health-2014.csv", d => {
	// TODO: convert values where necessary in this callback (d3.csv reads the csv line by line. In the callback,
	//  you have access to each line (or row) represented as a js object with key value pairs. (i.e. a dictionary).
	// convert numeric fields to numbers
	d.LifeExpectancy = +d.LifeExpectancy;
	d.Income = +d.Income;
	d.Population = +d.Population;
	return d;
}).then( data => {
	// Analyze the dataset in the web console
	console.log(data);
	console.log("Countries: " + data.length)

	data.sort( (a,b) => b.Population - a.Population);

	let padding = 30;
	let leftPadding = 25;

	// Define 'svg' as a child-element (g) from the drawing area and include spaces
	let svg = d3.select("#chart-area")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Creating income scale function
	let incomeScale = d3.scaleLinear()
		.domain([d3.min(data, (d) => d.Income), d3.max(data, (d) => d.Income)] )
		.range([0, width]);

	// Creating income logarithmic scale function
	let incomeScaleLog = d3.scaleLog()
		.domain([d3.min(data, (d) => d.Income)-100, d3.max(data, (d) => d.Income)] )
		.range([0, width]);

	// Creating income scale function
	let lifeExpectancyScale = d3.scaleLinear()
		.domain([d3.min(data, (d) => d.LifeExpectancy), d3.max(data, (d) => d.LifeExpectancy)])
		.range([height - padding, padding]);

	// Creating population scale function
	let populationScale = d3.scaleLinear()
		.domain([d3.min(data, (d) => d.Population), d3.max(data, (d) => d.Population)])
		.range([4, 30]);

	let regionColorScale = d3.scaleOrdinal(d3.schemeAccent);

	console.log(incomeScale(5000));
	console.log(lifeExpectancyScale(68));

	// Add Circles
	let circles = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("fill", (r) => regionColorScale(r.Region))
		.attr("r", (r) => populationScale(r.Population))
		//.attr("cx", (r) => incomeScale(r.Income))
		.attr("cx", (r) => incomeScaleLog(r.Income))
		.attr("cy", (r) => lifeExpectancyScale(r.LifeExpectancy))
		.attr("stroke", "black")

	let xAxis = d3.axisBottom()
		//.scale(incomeScale);
		.scale(incomeScaleLog);

	let yAxis = d3.axisLeft()
		.scale(lifeExpectancyScale);

	// Draw the x axis
	let xGroup = svg.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", "translate(0," + (height-25) + ")")

	// Add tick marks
	xGroup
		.call(xAxis)

	// Append label
	xGroup
		.append("text")
		.attr("class", "x-label")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", -10)
		.text("Income per Person (GDP per Capita)");

	// Draw the y axis
	let yGroup = svg.append("g")
		.attr("class", "axis Y-axis")
		.attr("transform", "translate(0,0)")

	// Add tick marks
	yGroup
		.call(yAxis)

	// Append label
	yGroup
		.append("text")
		.attr("transform", "rotate(-90)translate(" + -30 + "," + -210 +")")
		.attr("class", "y-label")
		.attr("text-anchor", "end")
		.attr("x", 0)
		.attr("y", height/2)
		.text("Life Expectancy");

	// TODO: sort the data

	// TODO: Call your separate drawing function here, i.e. within the .then() method's callback function

});

// TODO: create a separate function that is in charge of drawing the data, which means it takes the sorted data as an argument
// function ... (){}
// Add svg element (drawing space)
