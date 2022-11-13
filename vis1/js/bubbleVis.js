class BubbleVis {
    constructor(parentElement, data){
        // The DOM element of the parent
        this.parentElement = parentElement;
        this.data = data;
        this.motives = [...new Set(data.map(d => d.motive))]
        console.log("motives", this.motives);

        this.initVis()
    }

    initVis() {
        let vis = this;

        const parseTime = d3.timeParse("%Y");
        console.log("hi")
        console.log("hi", parseTime("2022.3"));

        let height = 800 // initial height

        vis.margin = {top: 50, right: 100, bottom: 50, left: 170};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.x = d3.scaleLinear()
            .domain(d3.extent(vis.data, d => d.date))
            .range([0, vis.width])

        vis.y = d3.scaleBand()
            .domain(vis.motives)
            .range([height / 2, height / 2])

        vis.xAxis = g =>
            g
                //.attr("transform", `translate(0, ${vis.margin.top})`)
                .call(d3.axisTop(vis.x).ticks(10))
                .call(g => g.select(".domain").remove())
                .call(g =>
                    g
                        .append("text")
                        .attr("x", vis.width)
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

        vis.r = d3.scaleSqrt()
            .domain(d3.extent(vis.data, d => d.count))
            .range([6, 20])

        vis.colour = d3.scaleSequential(d3.extent(vis.data, d => d.date), d3.interpolatePlasma)

        vis.svg.append("g").call(vis.xAxis);
        vis.yG = vis.svg.append("g").attr("stroke-width", 0);

        let node = vis.svg.append("g")
            .selectAll("circle")
            .data(vis.data)
            .join("circle")
            .attr("cx", d => vis.x(d.date))
            .attr("cy", d => vis.y(d.motive) + vis.y.bandwidth() / 2)
            .attr("r", d => vis.r(d.count))
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("fill", d => vis.colour(d.date));

        vis.simulation = d3.forceSimulation()
            .force("x", d3.forceX(d => vis.x(d.date)))
            .force("y", d3.forceY(d => vis.y(d.motive) + vis.y.bandwidth() / 2))
            .force("collide", d3.forceCollide(d => vis.r(d.count) + 1).strength(0.3));

        vis.simulation.on("tick", () => {
            node
                .transition()
                .delay((d, i) => d.x)
                .ease(d3.easeLinear)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        });

        vis.wrangleData();
    }
    wrangleData() {
        let vis = this;

        // Get the selected order
        //vis.selectedOrder =  document.getElementById('ordering').value;

        vis.updateVis()
    }
    updateVis() {
        let vis = this;

        const selection =  document.getElementById('selection').value;
        console.log("selection", selection);

        const split = (selection !== "all");

        let height = split ? 800 : 400;

        vis.y.domain(split ? vis.motives : vis.motives.concat("Global")); // workaround for updating the yAxis
        vis.y.range(split ? [0, vis.height] : [vis.height / 2, vis.height / 2]);
        let ticks = split ? vis.motives : ["Global"];

        const t = vis.svg.transition().duration(750);
        vis.svg.transition(t).attr("viewBox", [0, 0, vis.width, height]) ;
        vis.yG.transition(t).call(vis.yAxis, vis.y, ticks);

        vis.simulation.nodes(vis.data); // update nodes
        vis.simulation.alpha(1).restart(); // restart simulation

    }
}