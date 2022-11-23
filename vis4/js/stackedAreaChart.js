
/*
 * StackedAreaChart - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the that's provided initially
 * @param  displayData      -- the data that will be used finally (which might vary based on the selection)
 *
 * @param  focus            -- a switch that indicates the current mode (focus or stacked overview)
 * @param  selectedIndex    -- a global 'variable' inside the class that keeps track of the index of the selected area
 */

class StackedAreaChart {

// constructor method to initialize StackedAreaChart object
constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.displayData = [];
	this.filter = "";

	this.data.tweets.forEach(function(d){
		d.date = d3.timeMonth(d3.isoParse(d.date));
	});
	this.data.tweets = this.aggregateDates(this.data.tweets)
	
	this.data.retweets.forEach(function(d){
		d.date = d3.isoParse(d.date);
	});
	this.data.favorites.forEach(function(d){
		d.date = d3.isoParse(d.date);
	});

    let colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c'];

    // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
    this.dataCategories = Object.keys(this.data[selectedTweetCategory][0]).filter(d =>d !== "date")

	console.log(this.dataCategories)

    //prepare colors for range
    let colorArray = this.dataCategories.map( (d,i) => {
        return colors[i%6]
    })

	console.log("colorarray",colorArray)
    //Set ordinal color scale
    this.colorScale = d3.scaleOrdinal()
        .domain(this.dataCategories)
        .range(colorArray);

	//this.colorScale = d3.scaleOrdinal(this.dataCategories, d3.schemeTableau10)
	console.log(this.colorScale("DrButtar"))

	this.initVis();
}

	/*
	 * Method that initializes the visualization (static content, e.g. SVG area or axes)
 	*/
	initVis(){
		let vis = this;

		console.log("data here",vis.data[selectedTweetCategory])

		vis.margin = {top: 40, right: 40, bottom: 60, left: 40};

		vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select(vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Overlay with path clipping
		vis.svg.append("defs").append("clipPath")
			.attr("id", "clip")

			.append("rect")
			.attr("width", vis.width)
			.attr("height", vis.height);

		// Scales and axes
		vis.x = d3.scaleTime()
			.range([0, vis.width])

		vis.y = d3.scaleLinear()
			.range([vis.height, 0]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis");

	
		// TO-DO (Activity II): Initialize stack layout
		vis.stack = d3.stack()
			.keys(vis.dataCategories);

		// TO-DO (Activity II) Stack data
		vis.stackedData = vis.stack(vis.data[selectedTweetCategory]);

		console.log(vis.stackedData)

		// TO-DO (Activity II) Stacked area layout
		vis.area = d3.area()
			.curve(d3.curveCardinal)
			.x(d=> vis.x(d.data.date))
			.y0(d=> vis.y(d[0]))
			.y1(d=> vis.y(d[1]));

		// SVG area path generator
		vis.areaSingle = d3.area()
			.curve(d3.curveCardinal)
			.x(d=> vis.x(d.data.date))
			.y0(vis.height)
			.y1(d => vis.y(d[1]-d[0]));


		//TO-DO (Activity IV): Add Tooltip placeholder
		vis.tooltipText = vis.svg.append("text")
			.attr("class", "categories")
			.attr("x", 10)
			.attr("y", 0)

		// TO-DO: (Filter, aggregate, modify data)
		vis.wrangleData();

	}

	/*
 	* Data wrangling
 	*/
	wrangleData(transitionTime = 0){
		let vis = this;

		vis.stackedData = vis.stack(vis.data[selectedTweetCategory]);

		vis.displayData = vis.stackedData;

		if (vis.filter !== "") {
			let indexOfFilteredCategory = vis.dataCategories.findIndex(d => d === vis.filter);
			vis.displayData = [vis.stackedData[indexOfFilteredCategory]];
		}

		// Update the visualization
		vis.updateVis(transitionTime);
	}

	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
 	* Function parameters only needed if different kinds of updates are needed
 	*/
	updateVis(transitionTime=0){
		let vis = this;

		// Add a transition for when the brush is cleared
		let t = d3.transition().duration(transitionTime);

		vis.x.domain(d3.extent(vis.data[selectedTweetCategory], d=> d.date));

		// Update domain
        // Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
		vis.y.domain([0, d3.max(vis.displayData, function(d) {
			return d3.max(d, function(e) {
				if (vis.filter) {
					return e[1]-e[0];
				}
				else {
					return e[1];
				}
			});
		})
		]);


		console.log("displayData", this.displayData)
		// Draw the layers
		let categories = vis.svg.selectAll(".area")
			.data(vis.displayData);

		let cat = categories.enter().append("path")
			.attr("class", "area")
			.merge(categories)
			// TO-DO (Activity IV): update tooltip text on hover
			.on("mouseover", function(event, d) {
				vis.tooltipText
					.text(d.key);
			})
			.on("click", (event, d)=> {
				let transitionTime = (vis.filter) ? 0 : 300;
				vis.filter = (vis.filter) ? "" : d.key;
 				vis.wrangleData(transitionTime);
			})
			.transition(t)
			.style("fill", (d,i) => {
				console.log("i",i)
				console.log("d",d)
				return vis.colorScale(d.key)
			})
			.attr("d", function(d) {
				if(vis.filter) {
					return vis.areaSingle(d);
				}
				else {
					return vis.area(d);
				}
			})

		categories.exit().remove();

		// Call axis functions with the new domain
		vis.svg.select(".x-axis").call(vis.xAxis);
		vis.svg.select(".y-axis").call(vis.yAxis);
	}

	aggregateDates(data) {
		const a = [];
		for(let item of data) {
			if (a[item.date]) {
				a[item.date].DrButtar += item.DrButtar;
				a[item.date].DrChrisNorthrup += item.DrChrisNorthrup;
				a[item.date].RobertKennedyJr += item.RobertKennedyJr;
				a[item.date].kevdjenkins1 += item.kevdjenkins1;
				a[item.date].mercola += item.mercola;
				a[item.date].sayerjigmi += item.sayerjigmi;
			} else {
				a[item.date] = item;
			}
		}
		const b = [];
		for (let key in a) {
			b.push(a[key]);
		}
		return b;
	}
}