
/*
 * Timeline - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the timeline should use
 */

class Timeline {

	// constructor method to initialize Timeline object
	constructor(parentElement, data){
		this.parentElement = parentElement;
		this.data = data;

		// No data wrangling, no update sequence
		this.displayData = data;

		this.data.forEach(function(d){
			d.date = d3.isoParse(d.date);
		});

		this.initVis();
	}

	// create initVis method for Timeline class
	initVis() {

		const formatTime = d3.timeFormat("%B %d, %Y");

		// store keyword this which refers to the object it belongs to in variable vis
		let vis = this;

		vis.margin = {top: 10, right: 40, bottom: 10, left: 40};

		vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = vis.parentElement.getBoundingClientRect().height  - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select(vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Scales and axes
		vis.x = d3.scaleTime()
			.range([0, vis.width])
			.domain(d3.extent(vis.displayData, function(d) { return d.date; }));

		vis.y = d3.scaleLinear()
			.range([vis.height, 0])
			.domain([0, d3.max(vis.displayData, function(d) { return d[selectedCasesDeaths]; })]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = vis.svg.append("g")
			.attr("class", "axis axis-y");

		// Draw area by using the path generator
		vis.pathGen = vis.svg.append("path")
		vis.pathGen2 = vis.svg.append("path")

		// Initialize brush component
		vis.brush = d3.brushX()
			.extent([[0, 0], [vis.width, vis.height]])
			.on("brush end", brushed);

		// TO-DO: Append brush component here
		vis.svg.append("g")
			.attr("class", "x brush")
			.call(vis.brush)
			.selectAll("rect")
			.attr("y", -6)
			.attr("height", vis.height + 7);

		vis.svg.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", vis.width)
			.attr("height", vis.height);

		// Append x-axis
		vis.xGroup = vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")")

		// Create a label saying what date range has been brushed
		vis.dateRange = vis.xGroup
			.append("text")
			.attr("class", "date-range")
			.attr('text-anchor', 'start')
			.attr('x', 0)
			.attr('y', -120)
			.attr('fill', 'black')
			.text(formatTime(vis.displayData[0].date) + " - " +
				formatTime(vis.displayData[vis.displayData.length-1].date));

		vis.xGroup
			.call(vis.xAxis);



		vis.wrangleData();

	}
	wrangleData() {
		let vis = this;

		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		const t = d3.transition().duration(500).ease(d3.easeLinear);

		//vis.y.domain([0, d3.max(vis.displayData, (d) => d["cases"])]);
		if (selectedCasesDeaths === "cases") {
			vis.y.domain([0, d3.max(vis.displayData, (d) => d.cases)]);
		} else if (selectedCasesDeaths === "deaths") {
			vis.y.domain([0, d3.max(vis.displayData, (d) => d.deaths)]);
		} else {
			vis.y.domain([0, d3.max(vis.displayData, (d) => Math.log10(d.cases+1))]);
		}

		let tickFormat;

		if (selectedCasesDeaths === "cases" || selectedCasesDeaths === "deaths") {
			vis.drawPaths([selectedCasesDeaths], false);
			tickFormat = d3.format('.2s')
		} else {
			vis.drawPaths(["cases", "deaths"], true)
			tickFormat = vis.logFormatTick;
		}

		// Use the appropriate ticks and update y axis
		vis.yAxis.transition().duration(400).call(d3.axisLeft(vis.y).ticks(5).tickFormat(tickFormat));

		// TO-DO: Initialize brush component
        // Initialize time scale (x-axis)
        vis.xScale = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.displayData, function(d) { return d.date; }));

	}

	drawPaths(areaToDraw, log=false) {
		const colors = {"cases": "#3A4FD8", "deaths": "orange"};
		let vis = this;

		// SVG area path generator
		vis.area = d3.area()
			.x(function (d) {
				return vis.x(d.date);
			})
			.y0(vis.height)
			.y1(function (d) {
				if (log) return vis.y(Math.log10(d[areaToDraw[0]] + 1));
				else return vis.y(d[areaToDraw[0]]);
			});

		// Draw area by using the path generator
		vis.pathGen
			.datum(vis.displayData)
			.transition().duration(400)
			.attr("d", vis.area)
			.attr("fill", colors[areaToDraw[0]]);

		// SVG area path generator
		vis.area2 = d3.area()
			.x(function (d) {
				return vis.x(d.date);
			})
			.y0(vis.height)
			.y1(function (d) {
				if (log) return vis.y(Math.log10(d[areaToDraw[1]] + 1));
				else return vis.y(0);
			});

		vis.pathGen2
			.datum(vis.displayData)
			.transition().duration(400)
			.attr("d", vis.area2)
			.attr("fill", colors["deaths"]);

	}

	logFormatTick(d) {
		switch (d) {
			case 1:
				return "10";
			case 2:
				return "100";
			case 3:
				return "1k";
			case 4:
				return "10k";
			case 5:
				return "100k";
			default:
				return "0";
		}
	}
}