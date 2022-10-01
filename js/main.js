// Load CSV file
d3.csv("data/zaatari-refugee-camp-population.csv", d => {
    // convert numeric fields to numbers
    d.date = d3.timeParse("%Y-%m-%d")(d.date);
    d.population = +d.population;
    return d;
}).then( data => {
    // Build and display the charts
    drawAreaChart(data);
    drawBarChart();
});

function drawAreaChart(data) {
    // SVG Size
    const width_raw = 770,
        height_raw = 500;

    // Margin object with properties for the four directions
    const margin = {top: 30, right: 90, bottom: 100, left: 90};

    // Width and height as the inner dimensions of the chart area
    let width = width_raw - margin.left - margin.right,
        height = height_raw - margin.top - margin.bottom;

    // Define 'svg' as a child-element (g) from the drawing area and include spaces
    let svg = d3.select("#area-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Create Scales
    let dateScale = d3.scaleTime()
        .domain([d3.min(data, (d) => d.date), d3.max(data, (d) => d.date)] )
        .range([0, width]);

    // Creating population scale function
    let populationScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.population + 10000)])
        .range([height, 0]);

    // Create area
    let areaChart = d3.area()
        .x(d => dateScale(d.date))
        .y1(d => populationScale(d.population))
        .y0(populationScale.range()[0]);

    // Create upper boundary line
    let topLine = d3.line()
        .x(d => dateScale(d.date))
        .y(d => populationScale(d.population))
        .curve(d3.curveMonotoneX);

    // Draw the area
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", areaChart);

    // Add main title
    svg.append("text")
        .attr("class", "text area-chart-title")
        .attr("x", width / 2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Camp Population");

    // Draw boundary line
    svg.append("path")
        .datum(data)
        .attr("class", "top-line")
        .attr("d", topLine);

    let xAxis = d3.axisBottom()
        .scale(dateScale)
        .tickFormat(d3.timeFormat("%b %Y"));

    let yAxis = d3.axisLeft()
        .scale(populationScale);

    // Draw the x axis
    let xGroup = svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)

    // Add tick marks
    xGroup
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "translate(5,20) rotate(45)");

    // Append label
    xGroup
        .append("text")
        .attr("class", "axis-label x-label")
        .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", 70)
        .text("Date")

    // Draw the y axis
    let yGroup = svg.append("g")
        .attr("class", "axis y-axis")

    // Add tick marks
    yGroup
        .call(yAxis)

    // Append label
    yGroup
        .append("text")
        .attr("transform", `rotate(-90)translate(${-height/2}, -300)`)
        .attr("class", "axis-label y-label")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 233)
        .text("Population");

    // Create tooltip elements group
    let tooltips = svg.append("g")
        .style("display", "none");

    // Append a vertical tooltip line that's a little shorter than the full plot
    // so it doesn't crash into the plot title
    tooltips.append("line")
        .attr("class", "tooltip-line")
        .attr("y1", 10)
        .attr("y2", height);

    // Append an empty SVG text element for the tooltip population value
    let tooltipPopulation = tooltips.append("text")
        .attr("class", "tooltip-population")
        .attr("dx", 10)
        .attr("y", 20);

    // Append an empty SVG text element for the tooltip date value
    let tooltipDate = tooltips.append("text")
        .attr("class", "tooltip-date")
        .attr("dx", 10)
        .attr("y", 40);

    // Append a rectangle over the whole chart to capture ‘mouse events’
    svg.append("rect")
        .attr("width", width-1)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on('mouseover', (event, d) => tooltips.style("display", null))
        .on('mouseout', (event, d) => tooltips.style("display", "none"))
        .on("mousemove", (event) => mousemove(event));

    // Function that handles the positioning of the tooltip
    function mousemove(event) {
        let bisectDate = d3.bisector(d=>d.date).left;
        // Inverting the scale gives us an approximate date that may not actually be in the data
        let approxDate = dateScale.invert(d3.pointer(event)[0]);
        // Use bisector to find the index of the closest date to the approximate date
        let index = bisectDate(data, approxDate);
        // Get the population and date from the index
        let population = data[index].population.toLocaleString("en-US");
        let date = data[index].date;
        tooltips.attr("transform", `translate(${dateScale(date)}, 0)`)
        tooltipPopulation.text(population);
        tooltipDate.text(date.toLocaleDateString("en-US"));
    }
}

function drawBarChart() {
    // SVG Size
    const width_raw = 500,
        height_raw = 500;

    // Margin object with properties for the four directions
    const margin = {top: 30, right: 20, bottom: 100, left: 70};

    // Width and height as the inner dimensions of the chart area
    let width = width_raw - margin.left - margin.right,
        height = height_raw - margin.top - margin.bottom;

    // Create a compound JS data structure to store information about the shelter types
    let data = [
        { shelterType: "Caravans", percentage: 0.7968},
        { shelterType: "Combination", percentage: 0.1081},
        { shelterType: "Tents", percentage: 0.0951}
    ];

    // Define 'svg' as a child-element (g) from the drawing area and include spaces
    let svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create the scales
    let bandScale = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.25)
        .domain(data.map( (d) => d.shelterType));

    let percentScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    // Create the axes
    let xAxis = d3.axisBottom()
        .scale(bandScale)

    let yAxis = d3.axisLeft()
        .scale(percentScale)
        .ticks(10, "%");

    // Create the bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => bandScale(d.shelterType))
        .attr("y", (d) => percentScale(d.percentage))
        .attr("height", (d) => height - percentScale(d.percentage))
        .attr("width", width / data.length - 40);

    // Create a format to display percents to 2 decimal places
    const p = d3.precisionFixed(0.01);
    const f = d3.format("." + p + "%");

    // Add bar labels
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text((d) => f(d.percentage))
        .attr("x", (d) => bandScale(d.shelterType) + 40)
        .attr("y", (d) => percentScale(d.percentage) - 10)
        .attr("text-anchor", "middle")
        .attr("class", "bar-label");

    // Add main title
    svg.append("text")
        .attr("class", "text area-chart-title")
        .attr("x", width / 2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Type of Shelter");

    // Draw the x axis
    let xGroup = svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height})`)

    // Add tick marks
    xGroup
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "translate(0,10)");

    // Append label
    xGroup
        .append("text")
        .attr("class", "axis-label x-label")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", 70)
        .text("Type of Shelter")

    // Draw the y axis
    let yGroup = svg.append("g")
        .attr("class", "axis y-axis")

    // Add tick marks
    yGroup
        .call(yAxis)

    // Append label
    yGroup
        .append("text")
        .attr("transform", `rotate(-90)translate(${-width/2},-300)`)
        .attr("class", "axis-label y-label")
        .attr("text-anchor", "middle")
        .attr("x", -15)
        .attr("y", 250)
        .text("Percentage");
}