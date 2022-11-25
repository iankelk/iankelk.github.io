
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

		// store keyword this which refers to the object it belongs to in variable vis
		let vis = this;

		vis.margin = {top: 0, right: 40, bottom: 30, left: 40};

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

		// Draw area by using the path generator
		vis.pathGen = vis.svg.append("path")

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

		// append tooltip
		vis.radioButtons = d3.select(".timeline-row").append('div')
			.attr('class', "radio-buttons")
			.style("opacity", 1)
			.style("left",20 + "vw")
			.style("bottom", 16  + "vh")
			.html(`
                     <div style="border: thin solid grey; border-radius: 5px; padding: 5px; width:7%;">
                     	<label >
                        	<input type="radio" name="case" value="cases" id="case" onchange="toggleCase()" checked/>Cases
                    	</label>
						<label >
							<input type="radio" name="case" value="deaths" id="death" onchange="toggleCase()"/>Deaths
						</label>
						<label >
							<input type="radio" name="case" value="both" onchange="toggleCase()"/>Both (Log10)
						</label>
                    </div>`);

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


		// // SVG area path generator
		// vis.area = d3.area()
		// 	.x(function(d) { return vis.x(d.date); })
		// 	.y0(vis.height)
		// 	.y1(function(d) { return vis.y(d[selectedCasesDeaths]); });
		//
		// // Draw area by using the path generator
		// vis.pathGen
		// 	.datum(vis.displayData)
		// 	.transition().duration(400)
		// 	.attr("d", vis.area)
		// 	.attr("fill", "#ccc");

		console.log("selectedCasesDeaths", selectedCasesDeaths)
		if (selectedCasesDeaths === "cases") {
			if (vis.pathGen2) vis.pathGen2.remove()
			vis.drawPath("red", "cases", vis.pathGen);
		} else if (selectedCasesDeaths === "deaths") {
			if (vis.pathGen2) vis.pathGen2.remove()
			vis.drawPath("yellow", "deaths", vis.pathGen);
		} else {
			vis.pathGen2 = vis.svg.append("path")
			vis.drawPath("red", "cases", vis.pathGen, true)
			vis.drawPath("yellow", "deaths", vis.pathGen2, true);
		}
		// selectedCasesDeaths === "cases" ? vis.drawPath("red", selectedCasesDeaths, vis.pathGen) : vis.drawPath("yellow", selectedCasesDeaths, vis.pathGen);
		//vis.drawPath("yellow", "cases", vis.pathGenCases);
		//vis.drawPath("red", "deaths", vis.pathGenDeaths)

		// TO-DO: Initialize brush component
        // Initialize time scale (x-axis)
        vis.xScale = d3.scaleTime()
            .range([0, vis.width])
            .domain(d3.extent(vis.displayData, function(d) { return d.date; }));

	}

	drawPath(color, areaToDraw, pathGen, log=false) {
		let vis = this;

		// SVG area path generator
		vis.area = d3.area()
			.x(function(d) { return vis.x(d.date); })
			.y0(vis.height)
			.y1(function(d) {
				if (log) return vis.y(Math.log10(d[areaToDraw]+1));
				else return vis.y(d[areaToDraw]);
			});

		// Draw area by using the path generator
		pathGen
			.datum(vis.displayData)
			.transition().duration(400)
			.attr("d", vis.area)
			.attr("fill", color);
	}
}