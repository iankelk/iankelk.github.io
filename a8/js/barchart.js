
/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */


class BarChart {

	constructor(parentElement, data, config) {
		this.parentElement = parentElement;
		this.data = data;
		this.config = config;
		this.displayData = data;

		this.initVis();
	}

	/*
	 * Initialize visualization (static content; e.g. SVG area, axes)
	 */
	initVis() {
		let vis = this;

		vis.margin = {top: 40, right: 50, bottom: 0, left: 100};

		vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select(vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Scales and axes. x is categorical so a scaleBand, y is linear
		vis.x = d3.scaleBand()
			.range([0, vis.height]);

		vis.y = d3.scaleLinear()
			.range([0, vis.width-50]);

		vis.xAxis = d3.axisLeft()
			.scale(vis.x);

		vis.yAxis = d3.axisBottom()
			.scale(vis.y);

		// Draw the x axis
		vis.xGroup = vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(-3,0)");

		// Draw the y axis
		vis.yGroup = vis.svg.append("g")
			.attr("class", "y-axis axis")
			.attr("transform", `translate(0,${vis.height})`);

		// Title
		vis.svg.append("text")
			.attr("x", vis.width/2 )
			.attr("class", "barchart-title")
			.attr("y", -10)
			.text(vis.config.title);

		// (Filter, aggregate, modify data)
		vis.wrangleData();
	}

	/*
	 * Data wrangling
	 */

	wrangleData() {
		let vis = this;

		// (1) Group data by key variable (e.g. 'electricity') and count leaves
		let rolled = d3.rollup(vis.displayData, leaves => leaves.length, d => d[vis.config.key])
		let arrayed = Array.from(rolled, ([key, value]) => ({key, value}));
		// (2) Sort columns descending
		vis.sorted = arrayed.sort( (a,b) => d3.descending(a.value, b.value));
		// Update the visualization
		vis.updateVis();
	}

	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
	 */

	updateVis() {
		let vis = this;

		// Define a transition to use so everything stays synced
		let t = d3.transition().duration(300);

		// (1) Update domains
		vis.x
			.domain(vis.sorted.map(d=>d.key))
			.padding(0.5);
		vis.y.domain([0, d3.max(vis.sorted, d => d.value)]);

		vis.xGroup
			.call(vis.xAxis)

		vis.yGroup
			.call(vis.yAxis
				.tickSize(0)
				.tickValues([]))

		// (2) Draw rectangles
		vis.rect = vis.svg.selectAll(".bar")
			.data(vis.sorted, d => d);

		vis.rect.enter()
			.append('rect')
			.attr("class", "bar")
			.merge(vis.rect)
			.attr("y", (d) => vis.x(d.key))
			.attr("height", vis.x.bandwidth() )
			.transition(t)
			.attr("width", function(d) { return vis.y(d.value); });

		vis.rect.exit().remove();

		// (3) Draw labels
		vis.barsLabel = vis.svg.selectAll(".bar-label")
			.data(vis.sorted);

		vis.barsLabel
			.enter()
			.append('text')
			.attr("class", "bar-label")
			.merge(vis.barsLabel)
			.attr("y", function(d) {return (vis.x(d.key) + vis.x.bandwidth()/1.2);})
			.transition(t)
			.attr("x", function(d) {return (vis.width-(vis.width-vis.y(d.value))+5);})
			.text(d=>d.value.toLocaleString("en-US"))

		vis.barsLabel.exit().remove();

		// Update the y-axis
		vis.svg.select(".y-axis").call(vis.yAxis);
	}

	/*
	 * Filter data when the user changes the selection
	 * Example for brushRegion: 07/16/2016 to 07/28/2016
	 */

	selectionChanged(brushRegion) {
		let vis = this;

		// If nothing is selected and we're already showing everything, do nothing
		if (brushRegion === null && vis.displayData === vis.data) return;
		// Else if nothing is selected but we're filtering the plot, reset it and wrangle data
		else if (brushRegion === null) vis.displayData = vis.data;
		// Else we're creating a new filter, so filter accordingly and wrangle data without changing the original data
		else vis.displayData = vis.data.filter((d) => (d.survey >= brushRegion[0]) && (d.survey <= brushRegion[1]));

		// Update the visualization
		vis.wrangleData();
	}
}
