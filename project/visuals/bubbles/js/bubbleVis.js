class BubbleVis {
    constructor(parentElement, motiveData, narrativeData, regionData){
        // The DOM element of the parent
        this.parentElement = parentElement;
        this.motiveData = motiveData;
        this.narrativeData = narrativeData;
        this.regionData = regionData;
        this.data = motiveData;

        this.categories = {};
        this.categories["motive"] =  [...new Set(motiveData.map(d => d.motive))]
        this.categories["narrative"] =  [...new Set(narrativeData.map(d => d.narrative))]
        this.categories["region"] =  [...new Set(regionData.map(d => d.region))]

        selectedCategoryBubbles =  document.getElementById('category-bubbles').value;
        console.log("categories", this.categories);

        this.initVis()
    }

    initVis() {
        let vis = this;

        const formatTime = d3.timeFormat("%B %d, %Y");

        vis.margin = {top: 30, right: 100, bottom: 10, left: 200};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 400;

        console.log("width", vis.width)

        // SVG drawing area
        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("viewBox", [0, 0, vis.width, vis.height]);

        // vis.svg = d3.select(vis.parentElement).append("svg")
        //     .attr("width", vis.width + vis.margin.left +  Math.ceil(vis.margin.right))
        //     .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        //    // .attr("viewBox", [0, 0, vis.width, height])
        //     .append("g")
        //     .attr("transform", "translate(" + vis.margin.left+ "," + vis.margin.top + ")");

        // vis.svg.attr("viewBox", [0, 0, vis.width, height]) ;


        vis.x = d3.scaleLinear()
            .domain(d3.extent(vis.data, d => d3.isoParse(d.date)))
            .range([vis.margin.left, vis.width - vis.margin.right])

        vis.y = d3.scaleBand()
            .domain(vis.categories[selectedCategoryBubbles])
            .range([vis.height / 2, vis.height / 2])

        vis.r = d3.scaleSqrt()
            .domain(d3.extent(vis.data, d => d.count))
            .range([6,15])

        vis.colour = d3.scaleOrdinal(d3.schemeTableau10)


        vis.xAxis = g =>
            g
                .attr("transform", `translate(0, ${vis.margin.top})`)
                //.call(d3.axisTop(vis.x).ticks(10).tickFormat(formatTime))
                .call(d3.axisTop(vis.x).tickValues(d3.timeDay.range(new Date(2020, 0, 27), new Date(2021, 0, 4), 60)).tickFormat(formatTime))
                .call(g => g.select(".domain").remove())
                .call(g =>
                    g
                        .append("text")
                        .attr("x", vis.width - vis.margin.right)
                        .attr("y", 10)
                        .attr("fill", "currentColor")
                        .attr("text-anchor", "middle")
                        .text("Years →")
                )

        vis.yAxis = (g, scale = vis.y, ticks = vis.y.domain()) =>
            g
                .attr("transform", `translate(30, 0)`)
                .call(d3.axisLeft(scale).tickValues(ticks))
                .call(g => g.style("text-anchor", "start"))
                .call(g => g.select(".domain").remove())

        vis.svg.append("g").call(vis.xAxis);
        vis.yG = vis.svg.append("g").attr("stroke-width", 0);

        vis.wrangleData();
    }
    wrangleData() {
        let vis = this;

        vis.data = vis.getDataset();

        vis.updateVis()
    }
    updateVis() {
        let vis = this;

        const formatTime = d3.timeFormat("%B %d, %Y");

        // If the simulation is running already, stop it to free up resources
        if (vis.simulation) vis.simulation.stop();

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip");

        const split = (document.getElementById('split').checked);

        vis.r.domain(d3.extent(vis.data, d => d.count))
        vis.x.domain(d3.extent(vis.data, d => d3.isoParse(d.date)))
        vis.y.domain(vis.categories[selectedCategoryBubbles])

        if (vis.node) {
            console.log("removing node")
            vis.node.remove();
        }
        vis.node = vis.svg.append("g")
            .selectAll("circle")
            .data(vis.data)
            .join("circle")
            .attr("cx", d => vis.x(d3.isoParse(d.date)))
            .attr("cy", d => vis.y(d[selectedCategoryBubbles]) + vis.y.bandwidth() / 2)
            .attr("r", d => vis.r(d.count))
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", d => vis.colour(d[selectedCategoryBubbles]))
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('fill', 'rgba(173,222,255,0.62)');
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: darkgrey; padding: 10px">
                         <h4>${selectedCategoryBubbles.toProperCase()}: ${d[selectedCategoryBubbles]}</h4>
                         <strong>Date: </strong> ${formatTime(d3.isoParse(d.date))}<br />
                         <strong>Count: </strong>${d.count}<br />
                     </div>`);
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '1px')
                    .attr("fill", d => vis.colour(d[selectedCategoryBubbles]))
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        vis.simulation = d3.forceSimulation()
            .force("x", d3.forceX(d => vis.x(d3.isoParse(d.date))))
            .force("y", d3.forceY(d => vis.y(d[selectedCategoryBubbles]) + vis.y.bandwidth() / 2))
            .force("collide", d3.forceCollide(d => vis.r(d.count) + 1).strength(0.5));

        vis.simulation.on("tick", () => {
            vis.node
                //.attr("cy", vis.height / 2)
                //.attr("cy", 0)
                //.attr("opacity", 0)
                .transition()
                .delay((d, i) => d.x)
                //.attr("opacity", 1)
                .ease(d3.easeLinear)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        });

        vis.height = split ? 500 : 300;


        vis.y.domain(split ? vis.categories[selectedCategoryBubbles] : vis.categories[selectedCategoryBubbles].concat("Global")); // workaround for updating the yAxis
        vis.y.range(split ? [vis.margin.top, vis.height - vis.margin.bottom] : [vis.height / 2, vis.height / 2]);
        let ticks = split ? vis.categories[selectedCategoryBubbles] : ["Global"];
        console.log("ticks", ticks)

        const t = vis.svg.transition().duration(400);
        vis.svg.transition(t).attr("viewBox", [0, 0, vis.width, vis.height]) ;
        vis.yG.transition(t).call(vis.yAxis, vis.y, ticks);

        vis.simulation.nodes(vis.data); // update nodes
        vis.simulation.alpha(1).restart(); // restart simulation

    }
    // Depending on which data we're looking at, format the ticks to better display it
    getDataset() {
        let vis = this;
        selectedCategoryBubbles = document.getElementById('category-bubbles').value;
        switch (selectedCategoryBubbles) {
            case "motive":
                return vis.motiveData;
            case "narrative":
                return vis.narrativeData;
            case "region":
                return vis.regionData;
        }
    }
}