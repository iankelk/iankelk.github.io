/* * * * * * * * * * * * * *
*      class BarVis        *
* * * * * * * * * * * * * */


class BarVis {

    constructor(parentElement, descending){
        this.parentElement = parentElement;
        this.descending = descending;
        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 30, right: 30, bottom: 50, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.title = vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .attr('transform', `translate(${vis.width / 2}, 0)`)
            .attr('text-anchor', 'middle');

        // tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")

        // TODO
        // Scales
        vis.x = d3.scaleBand()
            .rangeRound([0, vis.width])
            .paddingInner(0.2);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        // Create the Axes
        vis.xAxis = d3.axisBottom()
            .scale(vis.x);
        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        // Draw the x axis
        vis.xGroup = vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${vis.height})`)

        // Draw the y axis
        vis.yGroup = vis.svg.append("g")
            .attr("class", "axis y-axis")

        this.wrangleData();
    }

    wrangleData(){
        let vis = this
        vis.stateInfo = myDataTable.stateInfo;
        // TODO: Sort and then filter by top 10
        // maybe a boolean in the constructor could come in handy ?

        if (vis.descending){
            vis.stateInfo.sort((a,b) => {return b[selectedCategory] - a[selectedCategory]})
        } else {
            vis.stateInfo.sort((a,b) => {return a[selectedCategory] - b[selectedCategory]})
        }
        vis.topTenData = vis.stateInfo.slice(0, 10)
        vis.updateVis()

    }

    updateVis(){
        let vis = this;

        let title = vis.descending ? "Ten Worst States (" + selectedYear + ")" : "Ten Best States (" + selectedYear + ")";
        vis.title
            .text(title);

        vis.colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateViridis)
            .domain([
                d3.min(vis.stateInfo, d=>d[selectedCategory]), d3.max(vis.stateInfo, d=>d[selectedCategory])])

        let t = d3.transition().duration(700);

        // Update the scalers for the new data
        vis.x.domain(vis.topTenData.map( (d) => d.state));
        vis.y.domain([0, d3.max(vis.topTenData, (d) => d[selectedCategory])]);

        // Define the bar chart
        let bar = vis.svg.selectAll("rect")
            // Custom key function to match bars to states
            .data(vis.topTenData, (d) => d.state);

        // Update the axes
        vis.xAxis.scale(vis.x)
        vis.yAxis.scale(vis.y)

        // Remove the old bar chart
        bar.exit().remove();

        // Enter and update the bar chart
        bar
            .enter()
            .append("rect")
            .attr("y", vis.height)
            .attr("x", (d) => vis.x(d.state))
            .merge(bar)
            .style("opacity", 0.5)
            .attr("width", vis.x.bandwidth())
            .attr("fill", (d) => vis.colorScale(d[selectedCategory]))
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)')

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX - 200 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: darkgrey; padding: 10px">
                         <h4>${d.state} (${selectedYear})</h4>
                         <strong> Population </strong>: ${d.population.toLocaleString("en-US")}<br />  
                         <strong>Cases (absolute): </strong>${d.absCases.toLocaleString("en-US")}<br /> 
                         <strong>Deaths (absolute): </strong>${d.absDeaths.toLocaleString("en-US")}<br /> 
                         <strong>Cases (relative): </strong>${d.relCases.toFixed(2)}%<br /> 
                         <strong>Deaths (relative): </strong>${d.relDeaths.toFixed(3)}%
                     </div>`);

                selectedState = d.state;
                myMapVis.highlightState();
                myBrushVis.wrangleDataResponsive();
            })
            .on('mouseout', function (event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", function (d) {
                        let myState = d.state
                        let myStateInfo = vis.stateInfo.filter( (d) => d.state === myState);
                        return vis.colorScale(myStateInfo[0][selectedCategory])
                    })

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
                myMapVis.removeHighlightState();

            })
            .transition(t)
            .style("opacity", 1)
            .attr("class", (d) => nameConverter.getAbbreviation(d.state))
            .attr("y", (d) => vis.y(d[selectedCategory]))
            .attr("x", (d) => vis.x(d.state))
            .attr("height", function (d) { let ht = vis.height - vis.y(d[selectedCategory]); return (ht < 0) ? 0 : ht;} )


        // Update x axis
        vis.xGroup
            .transition(t)
            .call(vis.xAxis)
            .selectAll("text")
            .attr("transform", "translate(5,12) rotate(25)");

        // Update y axis
        vis.yGroup
            .transition(t)
            .call(vis.yAxis.tickFormat(getTickFormatter()))

    }

    highlightBar() {
        let vis = this;
        vis.svg.selectAll(`.${nameConverter.getAbbreviation(selectedState)}`)
            .attr('stroke-width', '2px')
            .attr('stroke', 'black')
            .attr('fill', 'rgba(173,222,255,0.62)');
    }

    removeHighlightBar() {
        let vis = this;
        vis.svg.selectAll(`.${nameConverter.getAbbreviation(selectedState)}`)
            .attr('stroke-width', '0px')
            .attr("fill", function (d) {
                let myStateInfo = vis.stateInfo.filter( (d) => d.state === selectedState);
                return vis.colorScale(myStateInfo[0][selectedCategory])
            });
    }
}