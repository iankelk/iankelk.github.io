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
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
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

        vis.hotspots = vis.svg.selectAll("circle")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("cx", (d) => +d.x)
            .attr("cy", (d) => +d.y)
            .attr("r", 12)
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


