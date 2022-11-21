class HoverVis {
    constructor(parentElement, data) {
        // The DOM element of the parent
        this.parentElement = parentElement;
        this.data = data;

        this.initVis();
    }

    initVis() {
        let vis = this;

        // vis.width = 832;
        // vis.height = 900;

        // define margins
        vis.margin = {top: 20, right: 20, bottom: 20, left: 30};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.image = vis.svg.append("svg:image")
            .attr("x", 0)
            .attr("y", 0)
            .attr("xlink:href", "img/defender.png")

        const t = d3.transition().duration(500).ease(d3.easeLinear);

        vis.circleAnimation = vis.svg.selectAll()
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("cx", (d) => +d.x)
            .attr("cy", (d) => +d.y)
            .attr("r", 12)
            .attr("fill", "green")
            .attr("stroke", "green")
            .attr("stroke-opacity", 1)
            .attr("stroke-width",3)
            .attr("opacity", 0.5)

        vis.circleAnimation
            .transition(t)
            .attr("r", 25)
            .attr("stroke-opacity", 0)
            .attr("opacity", 0)

        vis.hotspots = vis.svg.selectAll()
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("cx", (d) => +d.x)
            .attr("cy", (d) => +d.y)
            .attr("r", 12)
            .attr("fill", "green")
            .attr("opacity", 0.5)
            .on("mouseover", function(event, d) {
                const t = d3.transition().duration(300).ease(d3.easeLinear);
                d3.select(this)
                        .transition(t)
                        //.attr("fill", "red")
                        .attr("opacity", 1)
                        .attr("stroke-opacity", 1)
                }
            )
            .on("mouseout", function(event, d) {
                const t = d3.transition().duration(500).ease(d3.easeLinear);
                d3.select(this)
                    .transition(t)
                    .attr("opacity", 0.5)
                    //.attr("fill", "green")
                vis.circleAnimation
                    .attr("r", 12)
                    .attr("stroke-opacity", 1)
                    .attr("opacity", 0.5)
                    .transition(t)
                    .attr("r", 25)
                    .attr("stroke-opacity", 0)
                    .attr("opacity", 0)
            })

        vis.wrangleData()
    }

    wrangleData() {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

    }
}


