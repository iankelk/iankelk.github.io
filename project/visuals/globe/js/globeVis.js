/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */

class GlobeVis {

    constructor(parentElement, geoData, historyData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.historyData = historyData;

        // define colors
        this.colors = ['grey', 'red'];

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;


        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Create a space for the description
        vis.description = d3.select("#description").append('div');


        // Create a space for the image
        vis.newsimage = d3.select("#newsimage");

        // Create a projection
        // Define Scale and include zoom factor
        vis.zoom = (vis.height) * 249.5

        vis.projection = d3.geoOrthographic()
            .translate([vis.width / 2, vis.height / 2])
            .scale(230);

        // Define a geogenerator and pass the projection
        vis.path = d3.geoPath()
            .projection(vis.projection);

        // Convert TopoJSON into GeoJSON
        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features;

        // Add the "water" before the countries
        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#0B0B45')
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);

        // Draw countries
        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path);

        // Draw the legend group
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width * 2.8 / 4}, ${vis.height - 40})`)

        vis.xAxsGroup = vis.svg.append("g")
            .attr('class', 'x-axis')
            .attr('transform', `translate(${vis.width * 2.8 / 4}, ${vis.height - 20})`)

        // Define the scale
        // Based on Ian Kelk's implementation here
        // https://edstem.org/us/courses/24903/discussion/2024176
        vis.legendScale = d3.scaleBand()
            .rangeRound([0, 100])
            // .padding(0)
            .domain(vis.colors.map( (d, i) => ["nothing", "fake"][i]));

        // Implement the bars
        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append("rect")
            .attr("width", "30")
            .attr("height", "20")
            .attr("x", (d, i) => i * 50 + 12)
            .attr("fill", d => d)

        vis.xAxis = d3.axisBottom()
            .scale(vis.legendScale)
            .ticks(4)


        // Make the map draggable
        let m0,
            o0;

        vis.svg.call(
            d3.drag()
                .on("start", function (event) {

                    let lastRotationParams = vis.projection.rotate();
                    m0 = [event.x, event.y];
                    o0 = [-lastRotationParams[0], -lastRotationParams[1]];
                })
                .on("drag", function (event) {
                    if (m0) {
                        let m1 = [event.x, event.y],
                            o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
                        vis.projection.rotate([-o1[0], -o1[1]]);
                    }

                    // Update the map
                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll(".country").attr("d", vis.path)
                    d3.selectAll(".graticule").attr("d", vis.path)
                })
        )

        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        // Store the list of countries that contain fake news
        let countriesFake = []

        vis.historyData.forEach(d => {
            if(!countriesFake.includes(d.name)){
                countriesFake.push(d.name)
            }
        });




        // Create data structure with information for each country
        vis.countryInfo = {};
        vis.geoData.objects.countries.geometries.forEach(d => {


            vis.countryInfo[d.properties.name] = {
                name: d.properties.name,
                countryId: d.id
            }
            let countryName = d.properties.name;

            // Change color of country if it has fake news in the dataset
            if(countriesFake.includes(d.properties.name)){
                vis.countryInfo[d.properties.name].color = "red";
                vis.countryInfo[d.properties.name].fakes = true;
                vis.countryInfo[d.properties.name].news = vis.historyData.filter(d => d.name == countryName);
            }else {
                vis.countryInfo[d.properties.name].color = "gray";
                vis.countryInfo[d.properties.name].fakes = false;
                vis.countryInfo[d.properties.name].news = {};

            }
        })

        // console.log(vis.countryInfo);

        vis.updateVis()
    }

    updateVis() {
        let vis = this;


        // console.log(vis.countryInfo);

        // Create a tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip');


        // Update the fill attribute using the lookup table
        vis.countries
            .style("fill", function (d) {
                return vis.countryInfo[d.properties.name].color
            })
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)');

                // Update the tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 5px">
                             <h3>${d.properties.name}<h3>
                             <h4> Click on countries in red to display a random fake news from that country </h4>
                             <h4> The timeline will display the current event in red and other events for that country in darker red</h4>

                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", d => vis.countryInfo[d.properties.name].color)

                // Make the tooltip disappear
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });


        vis.countries
            .on("click", function(event, d) {


                // Center the globe on that location
                vis.spinGlobe(vis.countryInfo[d.properties.name].name)

                // Display fake news only for countries that have it
                if(vis.countryInfo[d.properties.name].fakes === true){


                    // Select a random historical event from that country
                    let historicalEvent = vis.countryInfo[d.properties.name]
                        .news[Math.floor(Math.random()*vis.countryInfo[d.properties.name].news.length)]

                    // Update the timeline and the description based on this event
                    linkViews(historicalEvent);
                }

            })

        // Render the x axis
        vis.svg.select(".x-axis")
            .transition()
            .duration(500)
            .call(vis.xAxis);
    }

    // Funtion to spin the globe to the centered country based on the timeline
    spinGlobe(countryName){
        let vis = this;

        // Match the country on the map with the country chosen
        let getName = vis.world.filter(d => d.properties.name == countryName)

        // Center on that country
        let center = d3.geoCentroid(getName[0]);

        // Based on this link
        // https://stackoverflow.com/questions/63808899/using-d3-how-can-i-create-a-smooth-transition-on-my-globe-animation

        // Make a transition to rotate to that country
        d3.transition()
            .duration(2000)
            .ease(d3.easeCubic)
            .tween("rotate", function() {
                const r = d3.interpolate(vis.projection.rotate(), [-center[0], -center[1]]);
                return function(t) {
                    vis.projection.rotate(r(t));
                    // Update the map
                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll(".country").attr("d", vis.path)
                    d3.selectAll(".graticule").attr("d", vis.path)
                };
            })

    }


}
