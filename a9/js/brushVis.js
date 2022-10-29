
class BrushVis {

    // constructor method to initialize Timeline object
    constructor(_parentElement, covidData2020, covidData2022) {
        this.parentElement = _parentElement;
        this.covidData2020 = covidData2020;
        this.covidData2022 = covidData2022;
        this.parseDate = d3.timeParse("%m/%d/%Y");
        this.formatTime = d3.timeFormat("%B %d, %Y");

        // call method initVis
        this.initVis();
    }

    // init brushVis
    initVis(){
        let vis = this;

        vis.margin = {top: 20, right: 50, bottom: 20, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // clip path
        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // add title
        vis.title = vis.svg.append('g')
            .attr('class', 'title')
            .append('text')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // init scales
        vis.x = d3.scaleTime().range([0, vis.width]);
        vis.y = d3.scaleLinear().range([vis.height, 0]);

        // init x & y axis
        vis.xAxis = vis.svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + vis.height + ")");
        vis.yAxis = vis.svg.append("g")
            .attr("class", "axis axis--y");

        // init pathGroup
        vis.pathGroup = vis.svg.append('g').attr('class', 'pathGroup');

        // init path one (average)
        vis.pathOne = vis.pathGroup
            .append('path')
            .attr("class", "pathOne");

        // init path two (single state)
        vis.pathTwo = vis.pathGroup
            .append('path')
            .attr("class", "pathTwo");

        // init path generator
        vis.area = d3.area()
            // .curve(d3.curveMonotoneX)
            .x(function (d) {
                return vis.x(d.date);
            })
            .y0(vis.y(0));

        // init brushGroup:
        vis.brushGroup = vis.svg.append("g")
            .attr("class", "brush");

        // init brush
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])

        // Add legend
        vis.legend = vis.svg.append("g")
            .attr('class', 'timeline-legend')
            .attr("transform", `translate(10, 0)`)

        vis.legend
            .append("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("width", 12)
            .attr("height", 12)
            .style("fill", "#428A8D");

        vis.legend
            .append("text")
            .attr("x", 18)
            .attr("y", 7)
            .text("U.S. Population")
            .attr("class", "timeline-legend-text")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle")

        vis.stateLegendLabel = vis.legend
            .append("text")
            .attr("x", 18)
            .attr("y", 27)
            .text("")
            .attr("class", "timeline-legend-text")
            .style("font-size", "15px")
            .attr("alignment-baseline","middle");


        // init basic data processing
        this.wrangleDataStatic();
    }

    // init basic data processing - prepares data for brush - done only once
    wrangleDataStatic(){
        let vis = this;

        vis.data = (selectedYear === "2020") ? vis.covidData2020 : vis.covidData2022;

        // rearrange data structure and group by state
        let dataByDate = Array.from(d3.group(vis.data, d => d.submission_date), ([key, value]) => ({key, value}))


        vis.preProcessedData = [];

        // iterate over each year
        dataByDate.forEach(year => {
            let tmpSumNewCases = 0;
            let tmpSumNewDeaths = 0;
            year.value.forEach(entry => {
                tmpSumNewCases += +entry['new_case'];
                tmpSumNewDeaths += +entry['new_death'];
            });

            vis.preProcessedData.push(
                {date: vis.parseDate(year.key), newCases: tmpSumNewCases, newDeaths: tmpSumNewDeaths}
            )
        });

        vis.preProcessedData.sort((a, b) => {
            return a.date - b.date;
        })

        this.wrangleDataResponsive();
    }

    // additional DataFiltering - only needed if we want to draw a second chart
    wrangleDataResponsive(){
        let vis = this;

        vis.data = (selectedYear === "2020") ? vis.covidData2020 : vis.covidData2022;

        vis.filteredData = [];

        // filter
        if (selectedState !== '') {
            vis.data.forEach(date => {
                if (selectedState === nameConverter.getFullName(date.state)) {
                    vis.filteredData.push(date)
                }
            })
        }

        // rearrange data structure and group by state
        let dataByDate = Array.from(d3.group(vis.filteredData, d => d.submission_date), ([key, value]) => ({key, value}))

        vis.dataPathTwo = [];

        // iterate over each year
        dataByDate.forEach(year => {
            let tmpSumNewCases = 0;
            let tmpSumNewDeaths = 0;
            year.value.forEach(entry => {
                tmpSumNewCases += +entry['new_case'];
                tmpSumNewDeaths += +entry['new_death'];
            });

            vis.dataPathTwo.push(
                {date: vis.parseDate(year.key), newCases: tmpSumNewCases, newDeaths: tmpSumNewDeaths}
            )
        });
        vis.dataPathTwo.sort((a, b) => {
            return a.date - b.date;
        })


        this.wrangleData();
    }

    wrangleData(){
        let vis = this;

        // Update the visualization
        this.updateVis();
    }

    updateVis(){
        let vis = this;

        // init path generator
        vis.area
            .y1(function (d) {
                if (selectedCategory === "absCases" || selectedCategory === "relCases") return vis.y(d.newCases);
                else return vis.y(d.newDeaths);
            });

        let title = (selectedCategory === "absCases" || selectedCategory === "relCases") ? "Cases" : "Deaths";
            vis.title
            .text(`COVID-19 ${selectedYear} Timeline (New ${title})`);

        // update domains
        vis.x.domain(d3.extent(vis.preProcessedData, function (d) {
            return d.date
        }));
        vis.y.domain(d3.extent(vis.preProcessedData, function (d) {
            if (selectedCategory === "absCases" || selectedCategory === "relCases") return d.newCases;
            else return d.newDeaths;
        }));

        // draw x & y axis
        vis.xAxis.transition().duration(400).call(d3.axisBottom(vis.x));
        vis.yAxis.transition().duration(400).call(d3.axisLeft(vis.y).ticks(5).tickFormat(d3.format('.2s')));

        // draw pathOne
        vis.pathOne.datum(vis.preProcessedData)
            .transition().duration(400)
            .attr("d", vis.area)
            .attr("fill", "#428A8D")
            .attr("stroke", "#136D70")
            .attr("clip-path", "url(#clip)");


        // draw pathOne
        vis.pathTwo.datum(vis.dataPathTwo)
            .transition().duration(400)
            .attr("d", vis.area)
            .attr('fill', 'rgba(255,0,0,0.47)')
            .attr("stroke", "#darkred")
            .attr("clip-path", "url(#clip)");

        if (selectedState !== '') {
            vis.legend
                .append("rect")
                .attr("x",0)
                .attr("y",20)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", "rgba(255,0,0,0.47)");

            vis.stateLegendLabel.text(`${selectedState} Population`)

       }
        vis.brush
            .on("brush end", function (event) {
                if (event.selection !== null) {
                    selectedTimeRange = [vis.x.invert(event.selection[0]), vis.x.invert(event.selection[1])];
                }
                else {
                    selectedTimeRange = [vis.x.invert(0), vis.x.invert(vis.width)];
                }
                myDataTable.wrangleData();
                myMapVis.dateRange
                    .text(`${vis.formatTime(selectedTimeRange[0])} - ${vis.formatTime(selectedTimeRange[1])}`);
                myMapVis.wrangleData();
                myBarVisOne.wrangleData();
                myBarVisTwo.wrangleData();
            });

        vis.brushGroup
            .call(vis.brush);
    }
}
