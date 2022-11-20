class ForceVis {
    constructor(parentElement, miserablesData){
        // The DOM element of the parent
        this.parentElement = parentElement;
        this.miserablesData = miserablesData;
        this.data = miserablesData;
        console.log("data", miserablesData)

        this.misinfoGroups = [
            { group: 1, name: "Dr Rashid A Buttar" },
            { group: 2, name: "Christiane Northrup" },
            { group: 3, name: "Robert F. Kennedy Jr" },
            { group: 4, name: "Kevin Jenkins" },
            { group: 5, name: "Dr. Joseph Mercola" },
            { group: 6, name: "Sayer Ji" },
            { group: 7, name: "Contacted by multiple people" },
            { group: 8, name: "Donald Trump" }];

        this.powersOfTen = {
            "followers": [10, 100, 1000, 10000,100000, 1000000, 10000000, 100000000],
            "following": [10, 100, 1000, 10000,100000],
            "numTweets": [10, 100, 1000, 10000,100000, 1000000],
            "numLists": [10, 100, 1000, 10000,100000, 1000000] };

        selectedCategory =  document.getElementById('category').value;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 0, right: 20, bottom: 0, left: 20};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        console.log("width", vis.width)
        console.log("height", vis.height)

        vis.chart = vis.ForceDisjointedGraph(vis.miserablesData, {
            nodeId: d => d.username,
            nodeGroup: d => d.group,
            nodeTitle: d => `${d.username}\n${d.group}`,
            linkStrokeWidth: l => Math.sqrt(l.value),
            nodeRadius: 2,
            nodeStroke: d => d.verified ? '#1DA1F2' : "#fff",
            nodeStrokeWidth: d => d.verified ? 3 : 1.5,
            linkStrength: 0.3,
            nodeStrength: -50,
            width: vis.width,
            height: 700
        })

        vis.svg = d3.select(vis.parentElement).node().appendChild(vis.chart)


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

        vis.updateVis()
    }
    updateVis() {
        let vis = this;

        let t = d3.transition(800);

        let updatedRadius = d => {
            return vis.scaleRadius(+d[selectedCategory])
        }

        vis.node
            //.attr("r", 2)
            .transition(800)
            .delay((d,i) => 7*i )
            .attr("r", updatedRadius)

        vis.legendScale
            .domain(vis.powersOfTen[selectedCategory])

        vis.legendAxisGroup
            .transition(t)
            .call(vis.legendAxis)

        vis.sizeCircles = vis.sizeLegend.selectAll("circle")
            .data(vis.powersOfTen[selectedCategory]);

        const num = vis.powersOfTen[selectedCategory].length;
        const multipliers = { followers: 60, following: 95, numTweets: 80, numLists: 80};
        const offsets = { followers: 40, following: 60, numTweets: 50, numLists: 50};

        vis.sizeCircles
            .enter()
            .append("circle")
            .attr("r", 2)
            .merge(vis.sizeCircles)
            .transition(t)
            .attr("r", (d, i) => vis.scaleRadius(d))
            .attr("cx", (d, i) => i * multipliers[selectedCategory] + offsets[selectedCategory])
            .attr("fill", (d,i) => "grey")

        vis.sizeCircles.exit().remove();

    }

    scaleRadius(radius) {
        const sizeMultipliers = {
            followers: 1.1,
            following: 1.5,
            numTweets: 1.2,
            numLists: 1.5
        }
        let rd = Math.round(Math.log(radius))*sizeMultipliers[selectedCategory];
        return  rd < 4 ? 4 : rd;
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
        console.log("G",G)
        const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);

        // Replace the input nodes and links with mutable objects for the simulation.
        nodes = d3.map(nodes, (d, i) => ({id: N[i],
                                        name: d.name,
                                        group: d.group,
                                        followers: d.followers_count,
                                        following: d.following_count,
                                        numTweets: d.tweet_count,
                                        numLists: d.listed_count,
                                        description: d.description ? d.description : "",
                                        location: d.location ? d.location : "",
                                        verified: d.verified}));
        console.log("nodes", nodes)
        links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

        // Compute default domains.
        if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

        // Construct the scales.
        const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

        // Construct the forces.
        const forceNode = d3.forceManyBody();
        const forceLink = d3.forceLink(links).id(({index: i}) => N[i]).distance(35);
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
           // .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("viewBox", [-width / 3, -height / 2, width, height])
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

        svg.append('defs').append('marker')
            .attr("id",'arrowhead')
            .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
            .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
            .attr('refY',0)
            .attr('orient','auto')
            .attr('markerWidth',4)
            .attr('markerHeight',4)
            .attr('xoverflow','visible')
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#999')
            .style('stroke','none');

        const link = svg.append("g")
            .attr("stroke", linkStroke)
            .attr("stroke-opacity", linkStrokeOpacity)
            .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
            .attr("stroke-linecap", linkStrokeLinecap)
            .attr('marker-end','url(#arrowhead)') //The marker-end attribute defines the arrowhead or polymarker that will be drawn at the final vertex of the given shape.
            .selectAll("line")
            .data(links)
            .join("line");

        if (W) link.attr("stroke-width", ({index: i}) => W[i]);

        vis.node = svg.append("g")
            .attr("fill", nodeFill)
            .attr("stroke-opacity", nodeStrokeOpacity)
            .selectAll("circle")
            .data(nodes)
            .join("circle")

        vis.node
            .attr("r", nodeRadius)
            .attr("stroke", nodeStroke)
            .attr("stroke-width", nodeStrokeWidth)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('fill', 'rgba(173,222,255,0.62)');
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY -160 + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: darkgrey; padding: 10px">
                         <h4>${d.name} (${d.id})</h4>
                         ${d.description ? splitLongString(7, d.description) + "<br /><br />" : ""}
                         <img src="img/profile_pics/${d.group === 9 ? "suspended" : d.id}.jpg"><br /><br />
                         <strong>Location:</strong> ${d.location}<br />
                         <strong>Followers: </strong> ${d.followers.toLocaleString("en-US")}<br />
                         <strong>Following: </strong> ${d.following.toLocaleString("en-US")}<br />
                         <strong>Number of Tweets: </strong> ${d.numTweets.toLocaleString("en-US")}<br />
                         <strong>Number of lists: </strong> ${d.numLists.toLocaleString("en-US")}<br />
                         <strong>Group: </strong> ${d.group}<br />
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

        if (G) vis.node.attr("fill", ({index: i}) => color(G[i]));
       // if (T) node.append("title").text(({index: i}) => T[i]);

        // Handle invalidation.
        if (invalidation != null) invalidation.then(() => simulation.stop());

        // Color Legend
        vis.legend = svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${400},${-200})`)

        vis.legend.selectAll().data([1])
            .enter()
            .append('text')
            .text("The nodes at the centers represent:")
            .attr("y", -55)
            .attr("x", -12)

        vis.legend.selectAll().data([1])
            .enter()
            .append('text')
            .text("(Hover on colors to highlight)")
            .attr("y", -30)
            .attr("x", -12)

        vis.legend.selectAll().data(vis.misinfoGroups)
            .enter()
            .append("circle")
            .attr("r", 15)
            .attr("cy", (d, i) => i * 40)
            .attr("cx", 10)
            .attr("fill", (d,i) => colors[i])
            .attr("class", (d,i) => `group_${d.group}`)
            .on('mouseover', function(event, d) {
                const group = +d3.select(this).attr("class").substring(6)
                console.log("group", group)
                vis.node
                    .transition(300)
                    .attr("fill", function(d,i) {
                        return d.group === group ? color(G[i]) : "#B8B8B8";
                    })
            })
            .on('mouseout', function (event, d) {
                vis.node
                    .transition(300)
                    .attr("fill", (d,i) => color(G[i]));

            })

        vis.legend.selectAll().data(vis.misinfoGroups)
            .enter()
            .append('text')
            .text((d,i) => d.name)
            .attr("y", (d, i) => i * 40+5)
            .attr("x", 35)

        vis.legend.selectAll().data([1])
            .enter()
            .append("circle")
            .attr("r", 15)
            .attr("cy", 350)
            .attr("cx", 10)
            .attr("fill", "silver")
            .attr("stroke", "#1DA1F2")
            .attr("stroke-opacity", 1)
            .attr("stroke-width",3)
            .on('mouseover', function(event, d) {
                vis.node
                    .transition(300)
                    .attr("fill", function(d,i) {
                        return d.verified ? color(G[i]) : "#B8B8B8";
                    })
            })
            .on('mouseout', function (event, d) {
                vis.node
                    .transition(300)
                    .attr("fill", (d,i) => color(G[i]));

            })

        vis.legend.selectAll().data([1])
            .enter()
            .append('text')
            .text("Verified on Twitter")
            .attr("y", 355)
            .attr("x", 35)

        // Size Legend
        vis.sizeLegend = svg.append("g")
            .attr('class', 'size-legend')
            .attr('transform', `translate(${400},${250})`)

        // vis.sizeCircles = vis.sizeLegend.selectAll();
        //
        // vis.sizeCircles
        //     .data(vis.powersOfTen[selectedCategory])
        //     .enter()
        //     .append("circle")
        //     .attr("r", (d, i) => vis.scaleRadius(d))
        //     .attr("cx", (d, i) => i * 60 + 40 )
        //     .attr("fill", (d,i) => colors[i]);

        vis.legendScale = d3.scaleBand()
            .rangeRound([0, 500])
            .padding(0.25)
            .domain(vis.powersOfTen[selectedCategory])

        vis.legendAxis = d3.axisBottom()
            .scale(vis.legendScale)
            .tickFormat(d3.format(",.0f"));

        vis.legendAxisGroup = svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(400,280)`);

        vis.legendAxisGroup
            .call(vis.legendAxis)

        //vis.circles = vis.sizeLegend.selectAll("circle");

        function intern(value) {
            return value !== null && typeof value === "object" ? value.valueOf() : value;
        }

        function ticked() {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            vis.node
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