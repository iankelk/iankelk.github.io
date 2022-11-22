
/*
 * Timeline - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the timeline should use
 */

class Timeline {

	// constructor method to initialize Timeline object
	constructor(parentElement, data){
		this._parentElement = parentElement;
		this._data = data;

		// No data wrangling, no update sequence
		this._displayData = data;
	}

	// create initVis method for Timeline class
	initVis() {

		// store keyword this which refers to the object it belongs to in variable vis
		let vis = this;

		vis.margin = {top: 0, right: 40, bottom: 30, left: 40};

		vis.width = vis._parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = vis._parentElement.getBoundingClientRect().height  - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select(vis._parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Scales and axes
		vis.x = d3.scaleTime()
			.range([0, vis.width])
			.domain(d3.extent(vis._displayData, function(d) { return d.Year; }));

		vis.y = d3.scaleLinear()
			.range([vis.height, 0])
			.domain([0, d3.max(vis._displayData, function(d) { return d.Expenditures; })]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		// SVG area path generator
		vis.area = d3.area()
			.x(function(d) { return vis.x(d.Year); })
			.y0(vis.height)
			.y1(function(d) { return vis.y(d.Expenditures); });

		// Draw area by using the path generator
		vis.svg.append("path")
			.datum(vis._displayData)
			.attr("fill", "#ccc")
			.attr("d", vis.area);

		  // TO-DO: Initialize brush component
		// Initialize time scale (x-axis)
		vis.xScale = d3.scaleTime()
			.range([0, vis.width])
			.domain(d3.extent(vis._displayData, function(d) { return d.Year; }));

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
		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")")
			.call(vis.xAxis);
	}
}