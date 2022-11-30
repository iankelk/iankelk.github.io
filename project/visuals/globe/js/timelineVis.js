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

        vis.margin = {top: 0, right: 20, bottom: 0, left: 20};
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

        // Create a tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip-globe")
            .attr('id', 'timelineTooltip');

        // Center the globe on the UK for the first news in the timeline
        setTimeout(myGlobeVis.spinGlobe("United Kingdom"), 2000)

        // Update the text for the first news in the timeline
        let firstEvent = vis.historyData[0];
        updateText(firstEvent);

        // Store the index of the news from the UK in a variable for drawing the circles
        const ukIndex = [0, 2, 6]

        // Add circles
        vis.xAxsGroup.selectAll().data(vis.historyData)
            .enter()
            .append("circle")
            .attr('class', 'circle')
            .attr('id', d=> `news-${d.id}`)
            .attr("r", "8")
            .transition()
            .duration(2000)
            .attr("cx", d => vis.timelineScale(d.year))
            .attr("cy", (d, i) => {
                if(i % 2 != 0){
                    return "-10";
                } else{
                    return "10";
                }
            })
            .attr("fill", (d, i) => {
                if(ukIndex.includes(i)){
                    return "orange";
                } else{
                    return "#0B0B45";
                }
            })

        // Pre-select the first circle
        d3.select("#news-1")
            .attr("stroke-width", "5")
            .attr("stroke", "maroon");

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
                    // .attr('stroke-width', '2px')
                    // .attr('stroke', 'black')
                    .attr("r", "11px")

                // Update the tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgray; padding: 2px">
                             <p>${d.event}, ${formatYear(d.year)}<p>

                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('r', '8px')

                // Make the tooltip disappear
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .on('click', (event,d) =>{

                // Center the globe to the location
                myGlobeVis.spinGlobe(d.name);

                // Update the timeline and the description based on this event
                linkViews(d);
            });



        // Render the x axis
        vis.svg.select(".timeline-axis")
            .transition()
            .duration(2000)
            .call(vis.xAxis);

    }


}