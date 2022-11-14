/* * * * * * * * * * * * * *
*          Timeline         *
* * * * * * * * * * * * * */

class TimelineVis {

    constructor(parentElement, geoData, historyData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.historyData = historyData;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Set the timeline
        vis.timelineScale = d3.scaleTime()
            .domain(d3.extent(vis.historyData, d=> d.year))
            .range([0, vis.width * 0.8])

        vis.xAxsGroup = vis.svg.append("g")
            .attr('class', 'timeline-axis')
            .attr('transform', `translate(${vis.width * 0.1}, ${vis.height * 0.5})`);

        // Add circles
        vis.xAxsGroup.selectAll().data(vis.historyData)
            .enter()
            .append("circle")
            .attr('class', 'circle')
            .attr("r", "5")
            .attr("cx", d => vis.timelineScale(d.year))
            .attr("cy", "5")
            .attr("fill", "steelblue")

        // TODO: Make circles clickable and linked to each fake news event
        // Make the globe spin to the corresponding country on click

        vis.xAxis = d3.axisTop()
            .scale(vis.timelineScale)
            .ticks(10);

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.xAxsGroup.selectAll('.circle')
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'steelblue')
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", "steelblue")
            });



        // Render the x axis
        vis.svg.select(".timeline-axis")
            .transition()
            .duration(500)
            .call(vis.xAxis);

    }


}