class WordCloud {
    constructor(parentElement, data) {
        // The DOM element of the parent
        this.parentElement = parentElement;
        this.data = data;
        // Make a deep copy of the data for display purposes
        //this.displayData = this.data.map((x) => x);

        // this.width = 1000;
        // this.height = 750;

        console.log(this.data);
        this.minMax = [this.data[this.data.length - 1].value, this.data[0].value];

        console.log("minMax", this.minMax);

        //Some sample data - http://en.wikiquote.org/wiki/Opening_lines
        this.words = [
            "You don't know about me without you have read a book called The Adventures of Tom Sawyer but that ain't no matter.",
            "The boy with fair hair lowered himself down the last few feet of rock and began to pick his way toward the lagoon."
            // "When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton.",
            // "It was inevitable: the scent of bitter almonds always reminded him of the fate of unrequited love."
        ]


        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.fill = d3.scaleOrdinal(d3.schemeCategory10);

        // define margins
        vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
        // vis.width = vis.parentElement.getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = vis.parentElement.getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.width = 500 - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // init drawing area
        // vis.svg = d3.select(vis.parentElement).append("svg")
        //     .attr("width", vis.width + vis.margin.left + vis.margin.right)
        //     .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        //     .append('g')
        //     .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        //Construct the word cloud's SVG element
        vis.svg = d3.select(vis.parentElement).append("svg")
            .attr("width", 500)
            .attr("height", 500)
            .append("g")
            .attr("transform", "translate(250,250)");

        vis.form = d3.select("#form").on("submit", function (event) {
            console.log("submitted")
            event.preventDefault();
            return false;
        });

        //Create a new instance of the word cloud visualisation.
        let myWordCloud = vis.wordCloud();

        vis.showNewWords(myWordCloud);


        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

    }

    convertRange( value, r1, r2 ) {
        let vis = this;
        r1 = vis.minMax;
        r2 = [1,10]
        return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
    }

    // Encapsulate the word cloud functionality
    wordCloud() {
        let vis = this;

        //Draw the word cloud
        function draw(words) {
            const cloud = vis.svg.selectAll("g text")
                .data(words, function(d) { return d.text; })

            //Entering words
            cloud.enter()
                .append("text")
                .style("font-family", "Impact")
                .style("fill", function(d, i) { return vis.fill(i); })
                .attr("text-anchor", "middle")
                .attr('font-size', 1)
                .text(function(d) { return d.text; });

            //Entering and existing words
            cloud
                .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

            //Exiting words
            cloud.exit()
                .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
        }


        //Use the module pattern to encapsulate the visualisation code. We'll
        // expose only the parts that need to be public.
        return {

            // Recompute the word cloud for a new set of words. This method will
            // asynchronously call draw when the layout has been computed.
            // The outside world will need to call this function, so make it part
            // of the wordCloud return value.
            update: function(words) {
                d3.layout.cloud().size([500, 500])
                    .words(words)
                    .padding(5)
                    .rotate(function() { return ~~(Math.random() * 2) * 90; })
                    .font("Impact")
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                    .start();
            }
        }

    }

    //Prepare one of the sample sentences by removing punctuation,
    // creating an array of words and computing a random size attribute.
    getWords(i) {
        let vis = this;

        console.log("i", i)
        return vis.words[i]
            .replace(/[!\.,:;\?]/g, '')
            .split(' ')
            .map(function(d) {
                return {text: d, size: 10 + Math.random() * 60};
            })
    }

    // This method tells the word cloud to redraw with a new set of words.
    // In reality the new words would probably come from a server request,
    // user input or some other source.
    showNewWords(v, i) {

        let vis = this;
        i = i || 0;

        console.log("vis.words", vis.words)
        v.update(vis.getWords(i++ % vis.words.length))
        setTimeout(function() { vis.showNewWords(v, i)}, 2000)
    }


}