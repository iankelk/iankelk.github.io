class MatrixVis {
    constructor(parentElement, data){
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];
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

        vis.wrangleData();

    }
    wrangleData() {
        let vis = this;
        vis.displayData = vis.data.map((x) => x);

        vis.selectedOrder =  document.getElementById('ordering').value;

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

        console.log(vis.displayData);

        vis.rows = vis.svg.selectAll(".matrix-row")
            //.data(vis.displayData, (d) => d.name);
            //.data(vis.displayData);
            .data(vis.displayData, function (d) {
                console.log("in it", d.name);
                //return d.name;
            });

        // define row groups
        vis.rowGroups = vis.rows
            .enter()
            .append("g")
            //.attr("class", d => `matrix-row row${d.index}`)
            .attr("class", function (d) {
                console.log("over here", d.name);
                return `matrix-row row${d.index}`
            })
            .attr("transform", (d,i)=> `translate(0, ${(vis.cellHeight + vis.cellPadding) * i})`)
            .merge(vis.rows);

        // remove previous labels
        vis.rowGroups.selectAll(".row-label").remove()

        // Define triangles
        vis.triangles = vis.rowGroups.append("g")
            .attr("class", "triangles")

        // Upper triangle
        vis.triangles.selectAll(".triangles-marriages")
            .data(d => d.marriageValues)
            .enter()
            .append("path")
            .attr("class", "triangles-marriages")
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

        // Lower triangle
        vis.triangles.selectAll(".triangles-businesses")
            .data(d => d.businessValues)
            .enter()
            .append("path")
            .attr("class", "triangles-businesses")
            .merge(vis.triangles)
            .attr("d", function(d,index) {
                // Shift the triangles on the x-axis (columns)
                let x = (vis.cellHeight + vis.cellPadding) * index;
                // All triangles of the same row have the same y-coordinates
                // Vertical shifting is already done by transforming the group elements
                let y = 0;

                return `M ${x} ${y} l 0 ${vis.cellHeight}  l ${vis.cellHeight} 0 z`;
            })
            .attr("fill", d=> (d===1)? color1: color4);

        vis.triangles.exit().remove();

        // add row labels
        vis.rowGroups
            .append("text")
            .attr("class", "row-label")
            .attr("transform", (d,i) => `translate(-10,${(vis.cellHeight + vis.cellPadding)/2})`)
            .attr("text-anchor", "end")
            .style("fill", "black")
            .text(d => d.name);

        vis.rowGroups.merge(vis.rowGroups).transition().duration(1000);

        // exit
        vis.rows.exit().remove();

        // column labels
        vis.colGroups = vis.svg.selectAll("g.matrix-row")
            .data(vis.data);

        vis.colGroups
            .append("text")
            .attr("class", "col-label")
            .attr("transform", (d,i)=>"translate("+(((vis.cellHeight+vis.cellPadding)*i)+10)+","+((-(vis.cellHeight+vis.cellPadding)*i)-5)+") rotate(-45)")
            .text(d=>d.name)
    }
}