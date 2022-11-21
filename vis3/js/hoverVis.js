class HoverVis {
    constructor(parentElement, data) {
        // The DOM element of the parent
        this.parentElement = parentElement;
        this.data = data;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = 832;
        vis.height = 900;

        // init drawing area
        vis.svg = d3.select("#hotspot-image").append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height);

        vis.image = vis.svg.append("svg:image")
            .attr("x", 0)
            .attr("y", 0)
            .attr("xlink:href", "img/defender.png")

        vis.hotspots = vis.svg.selectAll("circle")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("cx", (d) => +d.x)
            .attr("cy", (d) => +d.y)
            .attr("r", 40)
            .attr("fill", "green")
            .on("mouseover", function(event, d) {
                    d3.select(this)
                        .attr("fill", "red")
                }
            )
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .attr("fill", "green")
            })
    }

    wrangleData() {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

    }
}


