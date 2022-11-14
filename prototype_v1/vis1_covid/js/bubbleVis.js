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

        //console.log("motives", this.motives);
        selectedCategory =  document.getElementById('category').value;
        console.log("categories", this.categories);

        this.initVis()
    }

    initVis() {
        const nativeWidth = 1000;
        let vis = this;

        let height = 800 // initial height
        let actualWidth = vis.parentElement.getBoundingClientRect().width;
        vis.zoom = actualWidth / nativeWidth;
        if (vis.zoom > 1) vis.zoom = 1;

        vis.margin = {top: 50, right: 100, bottom: 50, left: 170};
        vis.width = actualWidth - vis.margin.left - Math.ceil(vis.zoom*vis.margin.right);
        vis.height = height - vis.margin.top - vis.margin.bottom;

        console.log("width", vis.width)

        // SVG drawing area
        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left +  Math.ceil(vis.zoom*vis.margin.right))
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
           // .attr("viewBox", [0, 0, vis.width, height])
            .append("g")
            .attr("transform", "translate(" + vis.margin.left+ "," + vis.margin.top + ")");

        // vis.svg.attr("viewBox", [0, 0, vis.width, height]) ;


        vis.x = d3.scaleLinear()
            .domain(d3.extent(vis.data, d => d.date))
            .range([0, vis.width])

        vis.y = d3.scaleBand()
            .domain(vis.categories[selectedCategory])
            .range([height / 2, height / 2])

        //vis.zoom = vis.width / nativeWidth;
        console.log("zoom", vis.zoom);


        vis.r = d3.scaleSqrt()
            .domain(d3.extent(vis.data, d => d.count))
            .range([Math.ceil(6*vis.zoom), Math.ceil(20*vis.zoom)])

        vis.colour = d3.scaleSequential(d3.extent(vis.data, d => d.date), d3.interpolateViridis)

        vis.xAxis = g =>
            g
                //.attr("transform", `translate(0, ${vis.margin.top})`)
                .call(d3.axisTop(vis.x).ticks(10))
                .call(g => g.select(".domain").remove())
                .call(g =>
                    g
                        .append("text")
                        .attr("x", vis.width-20)
                        .attr("y", 10)
                        .attr("fill", "currentColor")
                        .attr("text-anchor", "middle")
                        .text("Years →")
                )

        vis.yAxis = (g, scale = vis.y, ticks = vis.y.domain()) =>
            g
                .attr("transform", `translate(-150, 0)`)
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
        // Get the selected order
        //vis.selectedOrder =  document.getElementById('ordering').value;

        vis.updateVis()
    }
    updateVis() {
        let vis = this;

        // If the simulation is running already, stop it to free up resources
        if (vis.simulation) vis.simulation.stop();

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip");

        const split = (document.getElementById('split').value !== "all");

        let height = split ? 800 : 400;

        vis.r.domain(d3.extent(vis.data, d => d.count))
        vis.x.domain(d3.extent(vis.data, d => d.date))
        vis.y.domain(vis.categories[selectedCategory])

        if (vis.node) {
            console.log("removing node")
            vis.node.remove();
        }
        vis.node = vis.svg.append("g")
            .selectAll("circle")
            .data(vis.data)
            .join("circle")
            .attr("cx", d => vis.x(d.date))
            .attr("cy", d => vis.y(d[selectedCategory]) + vis.y.bandwidth() / 2)
            .attr("r", d => vis.r(d.count))
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", d => vis.colour(d.date))
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
                         <h4>${selectedCategory.toProperCase()}: ${d[selectedCategory]}</h4>
                         <strong>Date: </strong> ${d.date.toLocaleString("en-US")}<br />
                         <strong>Count: </strong>${d.count}<br />
                     </div>`);
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '1px')
                    .attr("fill", d => vis.colour(d.date))
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });


        console.log("selectedCategory", selectedCategory)

        vis.simulation = d3.forceSimulation()
            .force("x", d3.forceX(d => vis.x(d.date)))
            .force("y", d3.forceY(d => vis.y(d[selectedCategory]) + vis.y.bandwidth() / 2))
            .force("collide", d3.forceCollide(d => vis.r(d.count) + 1).strength(0.5));

        vis.simulation.on("tick", () => {
            vis.node
                .attr("cy", vis.height / 2)
                .transition()
                .delay((d, i) => d.x)
                .ease(d3.easeLinear)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        });


        vis.y.domain(split ? vis.categories[selectedCategory] : vis.categories[selectedCategory].concat("Global")); // workaround for updating the yAxis
        vis.y.range(split ? [0, vis.height] : [vis.height / 2, vis.height / 2]);
        let ticks = split ? vis.categories[selectedCategory] : ["Global"];
        console.log("ticks", ticks)

        const t = vis.svg.transition().duration(400);
        //vis.svg.transition(t).attr("viewBox", [0, 0, vis.width, height]) ;
        vis.yG.transition(t).call(vis.yAxis, vis.y, ticks);

        vis.simulation.nodes(vis.data); // update nodes
        vis.simulation.alpha(1).restart(); // restart simulation

    }
    // Depending on which data we're looking at, format the ticks to better display it
    getDataset() {
        let vis = this;
        selectedCategory = document.getElementById('category').value;
        switch (selectedCategory) {
            case "motive":
                return vis.motiveData;
            case "narrative":
                return vis.narrativeData;
            case "region":
                return vis.regionData;
        }
    }
}