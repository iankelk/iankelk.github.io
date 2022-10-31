/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */


class MapVis {

    // Constructor method to initialize Map object
    constructor(parentElement, mapData) {
        this.parentElement = parentElement;
        this.mapData = mapData;
        this.initVis();
    }

    initVis() {
        let vis = this;

        const parseDate = d3.timeParse("%m/%d/%Y");
        const formatTime = d3.timeFormat("%B %d, %Y");

        vis.margin = {top: 10, right: 15, bottom: 20, left: 15};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // Initialize drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Create the path
        vis.path = d3.geoPath()

        // Decide the zoom amount
        vis.viewpoint = {'width': 975, 'height': 610};
        vis.zoom = vis.width / vis.viewpoint.width;

        // Adjust map position, group will contain all state paths
        vis.map = vis.svg.append("g")
            .attr("class", "map")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`);

        // Get the map features
        vis.usMap = topojson.feature(vis.mapData, vis.mapData.objects.states).features

        // Create the state paths
        vis.states = vis.map.selectAll(".state")
            .data(vis.usMap)
            .enter().append("path")
            .attr('stroke-width', '1px')
            .attr('stroke', 'black')
            .attr("fill", "transparent")
            .attr("d", vis.path)
            .attr("class", (d) => nameConverter.getAbbreviation(d.properties.name))

        // Add legend group
        vis.legendGroup = vis.svg.append("g")
            .attr('class', 'timeline-legend')
            .attr("transform", `translate(10, ${vis.height-50})`);

        // Add x axis group
        vis.xGroup = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", `translate(10, ${vis.height-15})`);

        // Create a title for the legend
        vis.title = vis.xGroup
            .append("text")
            .attr("class", "legend-text")
            .attr('text-anchor', 'start')
            .attr('x', 0)
            .attr('y', -70)
            .attr('fill', 'black');

        // Create a label saying what date range has been brushed
        vis.dateRange = vis.xGroup
            .append("text")
            .attr("class", "date-range")
            .attr('text-anchor', 'start')
            .attr('x', 0)
            .attr('y', -47)
            .attr('fill', 'black')
            .text(formatTime(parseDate(myDataTable.covidData[0].submission_date)) + " - " +
                formatTime(parseDate(myDataTable.covidData[myDataTable.covidData.length-1].submission_date)));

        // Create scale for legend
        let legendColorScale = d3.scaleSequential()
            .interpolator(d3.interpolateViridis)
            .domain([0,100])

        // Create a gradient by drawing many squares
        let gradientData = d3.range(100);
        vis.legend = vis.legendGroup.selectAll(".rects")
            .data(gradientData)
            .enter()
            .append("rect")
            .attr("y", 0)
            .attr("height", 25)
            .attr("x", (d,i) => i*6)
            .attr("width", 6)
            .attr("fill", d=>legendColorScale(d))

        // Create legend scaler and axis
        vis.x = d3.scaleLinear()
            .range([0, 600]);
        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

       vis.wrangleData();
    }

    wrangleData() {
        let vis = this
        // dataTable's wrangle data is always called first, and prepares the data into myDataTable.stateInfo
        vis.stateInfo = myDataTable.stateInfo;
        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        const parseDate = d3.timeParse("%m/%d/%Y");
        const formatTime = d3.timeFormat("%B %d, %Y");

        // Title the legend with what category we're displaying
        let sel = document.getElementById('categorySelector');
        vis.title
            .text(sel.options[sel.selectedIndex].text);

        let t = d3.transition().duration(700);

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip");

        // Create the map color scale
        vis.colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateViridis)
            .domain([0, d3.max(vis.stateInfo, d=>d[selectedCategory])]);

        // Try to color the map. If the user brushes an area too small to return any data, catch and log the error
        try {
            vis.states
                .attr("fill", function (d) {
                    let state = vis.stateInfo.find(o => o.state === d.properties.name);
                    return vis.colorScale(state[selectedCategory])
                });
        }
        catch(e) {
            console.log("Brush selection too small to render: vis.stateInfo length=", vis.stateInfo.length);
        }
        // Fill all the states and add the tooltips
        vis.states
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('fill', 'rgba(173,222,255,0.62)');

                let state = vis.stateInfo.find(o => o.state === d.properties.name);
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: darkgrey; padding: 10px">
                         <h4>${state.state} (${selectedYear})</h4>
                         <strong>Population: </strong> ${state.population.toLocaleString("en-US")}<br />
                         <strong>Cases (absolute): </strong>${state.absCases.toLocaleString("en-US")}<br />
                         <strong>Deaths (absolute): </strong>${state.absDeaths.toLocaleString("en-US")}<br />
                         <strong>Cases (relative): </strong>${state.relCases.toFixed(2)}%<br />
                         <strong>Deaths (relative): </strong>${state.relDeaths.toFixed(3)}%
                     </div>`);

                selectedState = d.properties.name;
                myBarVisOne.highlightBar();
                myBarVisTwo.highlightBar();
                myBrushVis.wrangleDataResponsive();
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '1px')
                    .attr("fill", function (d) {
                        let state = vis.stateInfo.find(o => o.state === d.properties.name);
                        return vis.colorScale(state[selectedCategory])
                    })
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
                // Remove the highlighted bars from the bar charts
                myBarVisOne.removeHighlightBar();
                myBarVisTwo.removeHighlightBar();
            });
        // Adjust the axis domains and tick marks
        vis.x.domain([0, d3.max(vis.stateInfo, d=>d[selectedCategory])]);
        vis.xGroup
            .transition(t)
            .call(vis.xAxis.tickFormat(getTickFormatter()));

    }
    // Highlight the appropriate state by coloring it
    highlightState() {
        let vis = this;
        vis.svg.selectAll(`.${nameConverter.getAbbreviation(selectedState)}`)
            .attr('stroke-width', '2px')
            .attr('fill', 'rgba(173,222,255,0.62)');
    }
    // Remove the highlight and color the state as it was originally
    removeHighlightState() {
        let vis = this;
        vis.svg.selectAll(`.${nameConverter.getAbbreviation(selectedState)}`)
            .attr('stroke-width', '1px')
            .attr("fill", function (d) {
                let myStateInfo = vis.stateInfo.filter( (d) => d.state === selectedState);
                return vis.colorScale(myStateInfo[0][selectedCategory])
            });
    }
}
