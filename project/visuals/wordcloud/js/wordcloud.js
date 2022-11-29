class WordCloud {
    constructor(parentElement, data) {
        // The DOM element of the parent
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = this.data.slice(0,150);

        // Step to alternate between rotations for fun
        this.step = 0;
        this.minMax = [parseInt(this.displayData[this.displayData.length - 1].value), parseInt(this.displayData[0].value)];
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.fill = d3.scaleOrdinal(d3.schemeCategory10);

        // define margins
        vis.margin = {top: 20, right: 10, bottom: 10, left: 10};
        vis.width =  vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left+vis.width/2}, ${vis.margin.top+ vis.height/2})`);

        vis.button = d3.select("#redraw-wordcloud").on("click", function (event) {
            console.log("submitted")
            vis.showNewWords(myWordCloud);
        });

        // How to scale the words which vary greatly in size
        vis.wordScale = d3.scaleLog()
            .domain(vis.minMax)
            .range([7,80]);

        //Create a new instance of the word cloud visualisation.
        let myWordCloud = vis.wordCloud();

        myWordCloud.update(vis.getWords(250))

        vis.showNewWords(myWordCloud);
    }

    // Encapsulate the word cloud functionality
    wordCloud() {
        let vis = this;

        //Draw the word cloud
        function draw(words) {
            const cloud = vis.svg.selectAll("g text")
                .data(words, function(d) { return d.text; })

            //Entering words
            cloud.join(
            enter => enter.append("text")
                        .style("font-family", "Impact")
                        .style("fill", function(d, i) { return vis.fill(i); })
                        .attr("text-anchor", "middle")
                        .attr('font-size', 1)
                        .text(function(d) { return d.text; }),
                    // Entering and existing words
                    update => update
                        .transition()
                        .duration(600)
                        .style("font-size", function(d) { return d.size + "px"; })
                        .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .style("fill-opacity", 1),
                    exit => exit
                        .transition()
                        .duration(200)
                        .style('fill-opacity', 1e-6)
                        .attr('font-size', 1)
                        .remove())
        }

        vis.cloud = d3.layout.cloud()
            .size([vis.width, vis.height]);

        return {
            // Recompute the word cloud. This method will
            // asynchronously call draw when the layout has been computed.
            update: function(words) {
                console.log("update words", words)
                vis.cloud
                    .words(words)
                    .padding(5)
                    .spiral('rectangular')
                    .font("Impact")
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                if (vis.step % 3 === 0) {
                    vis.step++;
                    vis.cloud
                        .rotate(function () {
                            return (~~(Math.random() * 2)) * 90;
                        })
                        .start();
                } else if (vis.step % 3 === 1) {
                    vis.step++;
                    vis.cloud
                        .rotate(function () {
                            return (~~(Math.random() * 6)-3) * 30;
                        })
                        .start();
                } else {
                    vis.step++;
                    vis.cloud
                        .rotate(function () {
                            return 30;
                        })
                        .start();
                }
            }
        }
    }

    // Prepare one of the sample sentences by removing punctuation,
    // creating an array of words and computing a random size attribute.
    getWords() {
        let vis = this;
        return vis.displayData.map(function(d) { return {text: d.key, size: vis.wordScale(d.value)}});
    }

    // This method tells the word cloud to redraw
    showNewWords(v, i) {
        let vis = this;
        v.update(vis.getWords())
    }
}