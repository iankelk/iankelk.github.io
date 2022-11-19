class ForceVis {
    constructor(parentElement, miserablesData){
        // The DOM element of the parent
        this.parentElement = parentElement;
        this.miserablesData = miserablesData;
        this.data = miserablesData;

        //console.log("motives", this.motives);
        selectedCategory =  document.getElementById('category').value;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        console.log("width", vis.width)

        // // SVG drawing area
        // vis.svg = d3.select(vis.parentElement)
        //     .append("svg")
        //     .attr("viewBox", [0, 0, vis.width, vis.height]);

        vis.chart = vis.ForceDisjointedGraph(vis.miserablesData, {
            nodeId: d => d.id,
            nodeGroup: d => d.group,
            nodeTitle: d => `${d.id}\n${d.group}`,
            linkStrokeWidth: l => Math.sqrt(l.value),
            nodeRadius: d => {
                let radius = Math.round(Math.log(+d.followers+1));
                radius = radius < 4 ? 4 : radius;
                console.log(radius);
                return radius;
            },
            nodeStroke: d => d.verified ? "magenta" : "#fff",
            linkStrength: 0.2,
            nodeStrength: -40,
            width: vis.width,
            height: 800
        })

        d3.select(vis.parentElement).node().appendChild(vis.chart)

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip");
        // SVG drawing area
        // vis.svg = d3.select(vis.parentElement)
        //     .append(vis.chart)
            //.attr("viewBox", [0, 0, vis.width, vis.height]);


        // vis.svg = d3.select(vis.parentElement).append("svg")
        //     .attr("width", vis.width + vis.margin.left +  Math.ceil(vis.margin.right))
        //     .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        //    // .attr("viewBox", [0, 0, vis.width, height])
        //     .append("g")
        //     .attr("transform", "translate(" + vis.margin.left+ "," + vis.margin.top + ")");

        // vis.svg.attr("viewBox", [0, 0, vis.width, height]) ;




        vis.wrangleData();
    }
    wrangleData() {
        let vis = this;

        //vis.data = vis.getDataset();
        // Get the selected order
        //vis.selectedOrder =  document.getElementById('ordering').value;

        vis.updateVis()
    }
    updateVis() {
        let vis = this;

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

    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/disjoint-force-directed-graph
    ForceDisjointedGraph({
        nodes, // an iterable of node objects (typically [{id}, …])
        links // an iterable of link objects (typically [{source, target}, …])
    }, {
        nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
        nodeGroup, // given d in nodes, returns an (ordinal) value for color
        nodeGroups, // an array of ordinal values representing the node groups
        nodeTitle, // given d in nodes, a title string
        nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
        nodeStroke = "#fff", // node stroke color
        nodeStrokeWidth = 1.5, // node stroke width, in pixels
        nodeStrokeOpacity = 1, // node stroke opacity
        nodeRadius = 5, // node radius, in pixels
        nodeStrength,
        linkSource = ({source}) => source, // given d in links, returns a node identifier string
        linkTarget = ({target}) => target, // given d in links, returns a node identifier string
        linkStroke = "#999", // link stroke color
        linkStrokeOpacity = 0.6, // link stroke opacity
        linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
        linkStrokeLinecap = "round", // link stroke linecap
        linkStrength,
        colors = d3.schemeTableau10, // an array of color strings, for the node groups
        width = 640, // outer width, in pixels
        height = 400, // outer height, in pixels
        invalidation // when this promise resolves, stop the simulation
    } = {}) {
        // Compute values.
        let vis = this;
        const N = d3.map(nodes, nodeId).map(intern);
        const LS = d3.map(links, linkSource).map(intern);
        const LT = d3.map(links, linkTarget).map(intern);
        if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
        const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
        const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
        const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);

        console.log("nodes_before", nodes)

        // Replace the input nodes and links with mutable objects for the simulation.
        nodes = d3.map(nodes, (d, i) => ({id: N[i], group: d.group, followers: d.followers_count, verified: d.verified}));
        console.log("nodes", nodes)
        links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

        // Compute default domains.
        if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

        // Construct the scales.
        const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

        // Construct the forces.
        const forceNode = d3.forceManyBody();
        const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
        if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
        if (linkStrength !== undefined) forceLink.strength(linkStrength);

        const simulation = d3.forceSimulation(nodes)
            .force("link", forceLink)
            .force("charge", forceNode)
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", ticked);

        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        const link = svg.append("g")
            .attr("stroke", linkStroke)
            .attr("stroke-opacity", linkStrokeOpacity)
            .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
            .attr("stroke-linecap", linkStrokeLinecap)
            .selectAll("line")
            .data(links)
            .join("line");

        if (W) link.attr("stroke-width", ({index: i}) => W[i]);

        const node = svg.append("g")
            .attr("fill", nodeFill)
            .attr("stroke-opacity", nodeStrokeOpacity)
            .attr("stroke-width", nodeStrokeWidth)
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("r", nodeRadius)
            .attr("stroke", nodeStroke)
            // .join(
            //     enter => enter.append("circle")
            //         .attr("r", nodeRadius)
            // )
            .on('mouseover', function(event, d) {
                console.log(d)
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('fill', 'rgba(173,222,255,0.62)');
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: darkgrey; padding: 10px">
                         <h4>Username: ${d.id}</h4>
                         <strong>Followers: </strong> ${d.followers.toLocaleString("en-US")}<br />
                        ${d.verified ? "<strong>Verified Account</strong>" : ""}
                        ${d.group === 11 || d.id === "realDonaldTrump" ? "<strong>Suspended Account</strong>" : ""}
                     </div>`);
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '1px')
                    .attr("fill", ({index: i}) => color(G[i]))
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .call(drag(simulation));

        if (G) node.attr("fill", ({index: i}) => color(G[i]));
        if (T) node.append("title").text(({index: i}) => T[i]);

        // Handle invalidation.
        if (invalidation != null) invalidation.then(() => simulation.stop());

        function intern(value) {
            return value !== null && typeof value === "object" ? value.valueOf() : value;
        }

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }

        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended);
        }

        return Object.assign(svg.node(), {scales: {color}});
    }
}