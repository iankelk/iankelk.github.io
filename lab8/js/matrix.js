class MatrixVis {
    constructor(parentElement, data){
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = this.data.map((x) => x);
        this.cellHeight = 35;
        this.cellPadding = 5;

        this.initVis()
    }

    initVis() {
        let vis = this;
        
        vis.margin = {top: 100, right: 20, bottom: 0, left: 200};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // Initialize drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.rows = vis.svg.selectAll(".matrix-row")
            .data(vis.displayData, (d) => d.name);

        // define row groups
        vis.rowGroups = vis.rows
            .enter()
            .append("g")
            .attr("class", d => `matrix-row row${d.index}`)
            .attr("transform", (d,i)=> `translate(0, ${(vis.cellHeight + vis.cellPadding) * i})`)
            .merge(vis.rows);

        // Define triangles
        vis.triangles = vis.rowGroups.append("g")

        // Upper triangles
        vis.triangles.selectAll(".triangles-marriages")
            .data(d => d.marriageValues)
            .enter()
            .append("path")
            .attr("class", (d, index) => `triangles-marriages triangles col${index}`)
            .merge(vis.triangles)
            .attr("d", function(d,index) {
                // Shift the triangles on the x-axis (columns)
                let x = (vis.cellHeight + vis.cellPadding) * index;
                // All triangles of the same row have the same y-coordinates
                // Vertical shifting is already done by transforming the group elements
                let y = 0;

                return `M ${x} ${y} l ${vis.cellHeight}  0 l 0  ${vis.cellHeight} z`;
            })
            .attr("fill", d=> (d===1)? color2: color4);

        // Lower triangles
        vis.triangles.selectAll(".triangles-businesses")
            .data(d => d.businessValues)
            .enter()
            .append("path")
            .attr("class", (d, index) => `triangles-businesses triangles col${index}`)
            .merge(vis.triangles)
            .attr("d", function(d,index) {
                // Shift the triangles on the x-axis (columns)
                let x = (vis.cellHeight + vis.cellPadding) * index;
                // All triangles of the same row have the same y-coordinates
                // Vertical shifting is already done by transforming the group elements
                let y = 0;

                return `M ${x} ${y} l 0 ${vis.cellHeight}  l ${vis.cellHeight} 0 z`;
            })
            .attr("fill", d => (d === 1) ? color1 : color4);

        // Add row labels
        vis.rowGroups
            .append("text")
            .attr("class", "row-label")
            .attr("transform", (d,i) => `translate(-10,${(vis.cellHeight + vis.cellPadding)/2})`)
            .attr("text-anchor", "end")
            .style("fill", "black")
            .text(d => d.name);

        // Column labels
        vis.colGroups = vis.svg.selectAll(".matrix-col")
            .data(vis.data);

        vis.colGroups
            .enter()
            .append("text")
            .attr("class", "col-label")
            .attr("transform", (d,i)=>`translate(${((vis.cellHeight+vis.cellPadding)*i)+20}, ${(-(vis.cellHeight + vis.cellPadding))+30}) rotate(-45)`)
            .text(d=>d.name)

        vis.wrangleData();
    }
    wrangleData() {
        let vis = this;

        vis.selectedOrder =  document.getElementById('ordering').value;
        vis.displayData = vis.data.map((x) => x);

        // Sort based on selected order
        if (vis.selectedOrder !== "default") {
            console.log("sorting", vis.selectedOrder);
            vis.displayData.sort((a,b) => {
                return b[vis.selectedOrder] - a[vis.selectedOrder];
            })
        }

        vis.updateVis()
    }
    updateVis() {
        let vis = this;

        let t = d3.transition().duration(500);

        // Define row groups
        vis.rowGroups
            .data(vis.displayData, (d) => d.name)
            .merge(vis.rowGroups)
            .transition(t)
            .attr("transform", (d,i)=> `translate(0, ${(vis.cellHeight + vis.cellPadding) * i})`);

        // Mouse events
        vis.triangles.selectAll(".triangles")
            .on('mouseover', function(event, d) {
                let triangle = d3.select(this);
                let col = +triangle._groups[0][0].classList[2].substring(3);
                vis.svg.selectAll(`.col${col}`)
                    .attr("opacity", 0.5);
            })
            .on('mouseout', function (event, d) {
                let triangle = d3.select(this);
                let col = +triangle._groups[0][0].classList[2].substring(3);
                vis.svg.selectAll(`.col${col}`)
                    .attr("opacity", 1);
            })

        vis.triangles
            .on('mouseover', function(event, d) {
                vis.svg.selectAll(`.row${d.index}`)
                    .attr("opacity", 0.5);
            })
            .on('mouseout', function(event, d) {
                vis.svg.selectAll(`.row${d.index}`)
                    .attr("opacity", 1);
            })
    }
}