class ForceVis {
    constructor(parentElement, data){
        // The DOM element of the parent
        this.parentElement = parentElement;
        this.data = data;

        this.misinfoGroups = [
            { group: 1, name: "Dr Rashid A Buttar" },
            { group: 2, name: "Christiane Northrup" },
            { group: 3, name: "Robert F. Kennedy Jr" },
            { group: 4, name: "Kevin Jenkins" },
            { group: 5, name: "Dr. Joseph Mercola" },
            { group: 6, name: "Sayer Ji" },
            { group: 7, name: "Multiple People and Organizations" },
            { group: 8, name: "Donald Trump" },
            { group: 9, name: "Center for Countering Digital Hate" }];


        this.powersOfTen = {
            "followers": [10, 100, 1000, 10000,100000, 1000000, 10000000, 100000000],
            "following": [10, 100, 1000, 10000],
            "numTweets": [10, 100, 1000, 10000,100000, 1000000],
            "numLists": [10, 100, 1000, 10000,100000] };

        selectedCategoryForceDirect =  document.getElementById('category-force-direct').value;

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 0, right: 20, bottom: 0, left: 20};
        vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        console.log("width", vis.width);
        console.log("height", vis.height);

        vis.chart = vis.ForceDisjointedGraph(vis.data, {
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
        });

        vis.svg = d3.select(vis.parentElement).node().appendChild(vis.chart);

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip");

        vis.wrangleData();
    }
    wrangleData() {
        let vis = this;

        vis.updateVis();
    }
    updateVis() {
        let vis = this;

        let t = d3.transition().duration(800);

        let updatedRadius = d => {
            return vis.scaleRadius(+d[selectedCategoryForceDirect]);
        };

        vis.node
            .transition(800)
            .delay((d,i) => 7*i )
            .attr("r", updatedRadius);

        vis.legendScale
            .domain(vis.powersOfTen[selectedCategoryForceDirect]);

        vis.legendAxisGroup
            .transition(t)
            .call(vis.legendAxis);

        vis.sizeCircles = vis.sizeLegend.selectAll("circle")
            .data(vis.powersOfTen[selectedCategoryForceDirect]);

        const multipliers = { followers: 60, following: 117.5, numTweets: 80, numLists: 95};
        const offsets = { followers: 40, following: 74, numTweets: 50, numLists: 60};

        vis.sizeCircles
            .enter()
            .append("circle")
            // .attr("r", 2)
            .attr("class", (d) => "size_" + d)
            .merge(vis.sizeCircles)
            .on('mouseover', function(event, d) {
                const size = +d3.select(this).attr("class").substring(5)
                const nextSize = size*10;
                d3.select(this)
                    .attr("fill", "dodgerblue");
                let count = 0;
                vis.node
                    .transition(300)
                    .attr("fill", function(d,i) {
                        if (d[selectedCategoryForceDirect] >= size && d[selectedCategoryForceDirect] < nextSize) count++;
                        return d[selectedCategoryForceDirect] >= size && d[selectedCategoryForceDirect] < nextSize ? vis.color(vis.G[i]) : "#B8B8B8";
                    });
                const sizeWordingBefore = { followers: "having", following: "following", numTweets: "tweeting", numLists: "being on"};
                const sizeWordingAfter = { followers: "followers", following: "other accounts", numTweets: "times", numLists: "lists"};

                vis.counter.html(`${count} highlighted for ${sizeWordingBefore[selectedCategoryForceDirect]} ${size.toLocaleString("en-US")} to ${(nextSize-1).toLocaleString("en-US")} ${sizeWordingAfter[selectedCategory]}`);
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr("fill", "grey")
                vis.node
                    .transition(300)
                    .attr("fill", (d,i) => vis.color(vis.G[i]));
                vis.counter.html(``);
            })

            .transition(t)
            .attr("r", (d, i) => vis.scaleRadius(d))
            .attr("cx", (d, i) => i * multipliers[selectedCategoryForceDirect] + offsets[selectedCategoryForceDirect])
            .attr("fill", (d,i) => "grey");

        vis.sizeCircles.exit().remove();
    }

    scaleRadius(radius) {
        const sizeMultipliers = {
            followers: 1.1,
            following: 1.5,
            numTweets: 1.2,
            numLists: 1.5
        };
        let rd = Math.round(Math.log(radius))*sizeMultipliers[selectedCategoryForceDirect];
        return  rd < 4 ? 4 : rd;
    }

    // THE BELOW CODE IS _HEAVILY_ MODIFIED BUT WAS BASED ON THE OBSERVABLE CODE CREDITED BELOW
    // I HAVE LEFT THE COPYRIGHT AS CREDIT TO SHOW THE ORIGINAL AUTHORS, BUT THIS IS ESSENTIALLY A FORK
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
        vis.G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
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
        links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

        // Compute default domains.
        if (vis.G && nodeGroups === undefined) nodeGroups = d3.sort(vis.G);

        // Construct the scales.
        vis.color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

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

        // Create the graph nodes
        vis.node = svg.append("g")
            .attr("fill", nodeFill)
            .attr("stroke-opacity", nodeStrokeOpacity)
            .selectAll("circle")
            .data(nodes)
            .join("circle");

        vis.node
            .attr("r", nodeRadius)
            .attr("stroke", nodeStroke)
            .attr("stroke-width", nodeStrokeWidth)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('fill', 'rgba(173,222,255,0.62)');
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY -160 + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: darkgrey; padding: 10px">
                         <h4>${d.name} (${d.id})</h4>
                         ${d.description ? splitLongString(7, d.description) + "<br /><br />" : ""}
                         <img src="visuals/forceDirect/img/profile_pics/${d.group === 10 ? "suspended" : d.id}.jpg"><br /><br />
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
                    .attr("fill", (d) => vis.color(vis.G[d.index]))
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .on('mousemove', (event,d) => {
                vis.tooltip
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY -160 + "px")
            })
            .call(drag(simulation));

        if (vis.G) vis.node.attr("fill", (d) => vis.color(vis.G[d.index]));

        // Handle invalidation.
        if (invalidation != null) invalidation.then(() => simulation.stop());

        // Color Legend
        vis.legend = svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(400,-220)`);

        vis.legend.selectAll().data([1])
            .enter()
            .append('text')
            .text("The nodes at the centers represent:")
            .attr("y", -80)
            .attr("x", -12);

        vis.legend.selectAll().data([1])
            .enter()
            .append('text')
            .text("(Hover on colors and sizes to highlight)")
            .attr("y", -55)
            .attr("x", -12);

        vis.legend.selectAll().data(vis.misinfoGroups)
            .enter()
            .append("circle")
            .attr("r", 15)
            .attr("cy", function(d, i) {
                if (d.group > 6) {return i * 40 - 5}
                else { return i * 40 - 30 }})
            .attr("cx", 10)
            .attr("fill", (d,i) => colors[i])
            .attr("class", (d,i) => `group_${d.group}`)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr("r", 18)
                const group = +d3.select(this).attr("class").substring(6)
                let count = 0;
                vis.node
                    .transition(300)
                    .attr("fill", function(d,i) {
                        if (d.group === group) count++;
                        return d.group === group ? vis.color(vis.G[i]) : "#B8B8B8";
                    })
                const person = vis.misinfoGroups.filter(obj => {
                    return obj.group === group
                })
                vis.counter.html(`${count} highlighted for ${person[0].name}`);
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr("r", 15);
                vis.node
                    .transition(300)
                    .attr("fill", (d,i) => vis.color(vis.G[i]));
                vis.counter.html("");
            });

        vis.legend.selectAll().data(vis.misinfoGroups)
            .enter()
            .append('text')
            .text((d,i) => d.name)
            .attr("y", function(d, i) {
                if (d.group > 6) {return i * 40}
                else { return i * 40 - 25 }})
            //.attr("y", (d, i) => i * 40 - 25)
            .attr("x", 35);

        // Verified
        vis.legend.selectAll().data([1])
            .enter()
            .append("circle")
            .attr("r", 15)
            .attr("cy",380)
            .attr("cx", 10)
            .attr("fill", "white")
            .attr("opacity", 0.5)
            .attr("stroke", "#1DA1F2")
            .attr("stroke-opacity", 1)
            .attr("stroke-width",3)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr("r", 18)
                let count = 0;
                vis.node
                    .transition(300)
                    .attr("fill", function(d,i) {
                        if (d.verified) count++;
                        return d.verified ? vis.color(vis.G[i]) : "#B8B8B8";
                    })
                vis.counter.html(`${count} people highlighted for verified accounts`)
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr("r", 15);
                vis.node
                    .transition(300)
                    .attr("fill", (d,i) => vis.color(vis.G[i]));
                vis.counter.html("");
            });

        // Suspended
        vis.legend.selectAll().data([1])
            .enter()
            .append("circle")
            .attr("r", 15)
            .attr("cy", 420)
            .attr("cx", 10)
            .attr("fill", "#B8B8B8")
            .on('mouseenter', function(event, d) {
                d3.select(this)
                    .attr("r", 18)
                let count = 0;
                vis.node
                    .attr("fill", function(d,i) {
                        if (d.group === 10) count++;
                        return d.group === 10 ? vis.color(vis.G[i]) : "#B8B8B8";
                    })
                    .attr("opacity", function(d,i) {
                        return d.group === 10 ? 1 :0.1;
                    })
                    .transition(100)
                    .attr("r", 10)
                    .transition(100)
                    .attr("r", (d, i) => vis.scaleRadius(+d[selectedCategoryForceDirect ]));
                vis.counter.html(`${count} people highlighted for suspended accounts`)
            })
            .on('mouseleave', function (event, d) {
                d3.select(this)
                    .attr("r", 15);
                vis.node
                    .attr("fill", (d,i) => vis.color(vis.G[i]))
                    .attr("opacity", 1);
                vis.counter.html("");
            });

        vis.legend.selectAll().data(["Verified on Twitter", "Suspended on Twitter"])
            .enter()
            .append('text')
            .text((d) => d)
            .attr("y", (d, i) => i * 40 + 385)
            .attr("x", 35);

        // Size Legend
        vis.sizeLegend = svg.append("g")
            .attr('class', 'size-legend')
            .attr('transform', `translate(300,250)`);

        vis.legendScale = d3.scaleBand()
            .rangeRound([0, 500])
            .padding(0.25)
            .domain(vis.powersOfTen[selectedCategoryForceDirect]);

        vis.legendAxis = d3.axisBottom()
            .scale(vis.legendScale)
            .tickFormat(d3.format(",.0f"));

        vis.legendAxisGroup = svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(300,280)`);

        vis.legendAxisGroup
            .call(vis.legendAxis);

        vis.counter = vis.legend
            .append("text")
            .attr("class", "counter")
            .attr('text-anchor', 'start')
            .attr('x', -10)
            .attr('y', -105)
            .attr('fill', 'black');

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

        // Adding local variable to use in the below dictionary
        const color = vis.color;
        return Object.assign(svg.node(), {scales: {color}});
    }
}