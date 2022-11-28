class StoryVis {
    constructor(parentElement, mapData, data) {
        // The DOM element of the parent
        this.parentElement = parentElement;
        this.mapData = mapData;
        this.data = data;
        // Make a deep copy of the data for display purposes
        //this.displayData = this.data.map((x) => x);

        this.width = 1200;
        this.height = 750;
        this.node_radius = 2;

        this.fn_per_dot = 5;
        this.min_fn_graph = 5;

        this.individual_ratios = {
            "USA": 0.634,
            "CHN": 0.77,
            "TUR": 0.763,
            "ESP": 0.878,
            "DEU": 0.865,
            "BRA": 0.914,
            "IND": 0.614,
            "EGY": 0.964,
            "ITA": 0.852,
            "GBR": 0.766
        }

        this.top10Countries = ['United States', 'China', 'Turkey', 'Spain', 'Germany', 'Brazil', 'India', 'Egypt', 'Italy', 'United Kingdom'];

        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = ({top: 100, bottom: 50, left: 50, right: 50})

        vis.projection = d3.geoEquirectangular().fitSize([vis.width, vis.height], vis.mapData).rotate([-30, 0]);
        vis.topCountries = vis.getTopCountries();
        vis.nodesData = vis.getNodesData();
        vis.nodesData1 = vis.getNodesData1();

        console.log("nodesData", this.nodesData)
        console.log("nodesData1", this.nodesData1)

        vis.svg = d3.create('svg')
            // .attr('viewBox', [0,0,vis.width*1.3+500, vis.height*1.9-300])
            .attr('viewBox', [0, 0, vis.width, vis.height * 1.3])
            .attr("height", vis.height)
            .attr("width", vis.width)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .style('background', "#333333")

        const wrapper = vis.svg.append('g').attr("transform", `translate(${vis.margin.left},${vis.margin.top})`)

        let geoGenerator = d3.geoPath().projection(vis.projection)

        let regions = wrapper.selectAll('region').data(vis.mapData.features)
        vis.areas = regions.enter().append('path').attr('class', 'areas').attr('d', d => geoGenerator(d)).attr('fill', '#969696')

        vis.x_countries = d3.scaleBand().domain(vis.data.filter(d => d.num_fake_news > vis.min_fn_graph).sort((a, b) => a.num_fake_news - b.num_fake_news).map(v => v.country)).range([vis.width, 50])

        vis.y_count = d3.scaleLinear().domain([0, 380]).range([vis.height - 75, 0])

        vis.countNews = {};
        for (let country_code in vis.individual_ratios) {
            vis.countNews[country_code]  = parseInt(vis.nodesData1.filter(v => v.country_code === country_code).splice(-1)[0].count * vis.individual_ratios[country_code]);
        }
        const sumValues = obj => Object.values(obj).reduce((a, b) => a + b, 0);

        vis.sumNews = sumValues(vis.countNews);


        console.log("countNews", vis.countNews);
        console.log("sumNews", vis.sumNews);


        // parseInt(vis.nodesData1.filter(v => v.country === "Philippines").splice(-1)[0].count * 0.52)

        vis.count_sachet = parseInt(vis.nodesData1.filter(v => v.country_code === "PHL").splice(-1)[0].count * 0.52)

        vis.xAxisCountries = g => g
            .call(d3.axisBottom(vis.x_countries))
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.tick line').remove())

        vis.yAxis_countries = wrapper.append("g").attr('transform', `translate(${0}, ${vis.height - 75})`).call(vis.xAxisCountries).selectAll("text")
            .style("text-anchor", "end").attr('opacity', 0).attr("dy", "-1.5em").attr('dx', '-2em')
            .attr("transform", "rotate(-70)");


        // step 1 Description
        vis.step1description = vis.svg.append('g').attr("transform", `translate(${vis.width / 2},${vis.height / 2})`).attr('opacity', 0)
        vis.step1description.append('text').attr('class', "text-color-header").text('Disinformation in the COVID-19 Era').attr('y', 0)

        // step 2 Description
        vis.step2description = wrapper.append('g').attr("transform", `translate(${(vis.width / 2) + vis.width / 4},${vis.height / 2})`)
        // move to 50
        const s2 = vis.step2description.append('text')
        s2.append('tspan').attr('class', "text-color-header").text('5,301 pieces').attr('x', 0)
            .attr('dy', 5)
        s2.append('tspan').attr('class', "text-color").text('of disinformation were documented from January 2020 to March 2021.').attr('x', 0)
            .attr('dy', "2em")

        const node_desc = vis.step2description.append('g').attr('transform', `translate(${0}, ${60})`)
        node_desc.append("text").attr('y', 20).attr('class', 'text-color').text(`Each node is equal to ${vis.fn_per_dot} pieces of disinformation.`)

        // step 3 Description
        vis.step3description = wrapper.append('g').attr("transform", `translate(${vis.width / 2},${220})`)
        const s3 = vis.step3description.append('text').attr('class', "text-color").style('font-size', "3.5em").text('50%').append('tspan').attr('class', "text-color").text(" of all COVID-19 disinformation came from Asia.")

        // step 4 Description
        vis.step4description = wrapper.append('g').attr("transform", `translate(${vis.width / 2},${220})`).attr('opacity', 0)
        const s4 = vis.step4description.append('text').attr('class', "text-color normal").text("However, the top 10 countries produced more than")
        s4.append('tspan').attr('class', "text-color red").style('font-size', "3.5em").text(' 52%')
        vis.step4description.append('text').attr('y', 40).attr('class', "text-color normal").text("of the fake news about COVID-19")

        // with 3.3kg per Capita, philippines contributes more plastic waste than next 4 countries on the list.

        // step 5 description
        vis.step5description = wrapper.append('g').attr("transform", `translate(${vis.width / 2},${320})`).attr('opacity', 0)
        const s5 = vis.step5description.append('text').attr('class', "text-color").text("The United States and China alone produced 18% of the fake news about COVID-19.")

        // step 6 description
        vis.step6description = wrapper.append('g').attr("transform", `translate(${vis.width / 2},${420})`).attr('opacity', 1)
        const s6 = vis.step6description.append('text').attr('class', "text-color amber").text("Individuals")
        s6.append('tspan').attr('class', "text-color normal").text(' account for ').append('tspan').attr('class', "text-color amber").style('font-size', "3em").text('77%')
        vis.step6description.append('text').attr('y', 50).append('tspan').attr('class', "text-color normal").text(' of fake news created from the top 10 countries.')


        vis.nodes = wrapper.selectAll('circle').data(vis.nodesData1).join('circle').attr('r', vis.node_radius).attr('fill', 'whitesmoke').attr('stroke', 'black').attr('stroke-width', 0.2)

        // init simulation
        vis.simulation = d3.forceSimulation();
        vis.simulation.nodes(vis.nodesData1);
        vis.simulation.force('charge', d3.forceManyBody().strength(0))
            .force('collision', d3.forceCollide().radius(d => vis.node_radius + 0.5).iterations(10))

        vis.svg = d3.select(vis.parentElement).node().appendChild(vis.initStepZero());

        //vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.morph(type);

    }

    // filter out low total mismanaged waste
    getNodesData() {
        let vis = this;

        const nodesData = [];
        const count = {}
        vis.data.forEach(v => {
            if (v.num_fake_news > vis.fn_per_dot) {
                for (let i = 0; i < Math.floor(v.num_fake_news / vis.fn_per_dot); i++) {
                    count[v.country] = (count[v.country] || 0) + 1;

                    if (vis.topCountries.includes(v.country)) {
                        nodesData.push({...v, count: count[v.country], top_country: true})
                    } else {
                        nodesData.push({...v, count: count[v.country], top_country: false})
                    }
                }
            }
        })
        return nodesData
    }

    getNodesData1() {
        let vis = this;

        const cols = 19
        const rows = 50

        // add a grid scale
        const calc_grid_pos = (i, nc, nr) => {
            const cs = (vis.height) / nc
            const rs = (vis.width / 2) / nr

            return {y: (Math.floor(i / nr) * cs), x: rs * (i % nr)}
        }

        return vis.nodesData.sort((a, b) => b.num_fake_news - a.num_fake_news).map((v, i) => {
            const result = calc_grid_pos(i, rows, cols)
            let t = vis.projection([parseFloat(v.long), parseFloat(v.lat)])
            return (
                {...v, x_grid: result.x, y_grid: result.y, x_map: t[0], y_map: t[1]}
            )
        })
    }

    getTopCountries() {
        let vis = this;
        return vis.data.filter(d => d.num_fake_news > vis.min_fn_graph).sort((a, b) => b.num_fake_news - a.num_fake_news).slice(0, 10).map(v => v.country);
    }

    morph(type) {
        console.log(type)
        let vis = this;
        if (type === 0) {

            vis.simulation.stop()

            // hide
            d3.select('.annotations-class').transition().duration(1000).attr('opacity', 1)
            vis.areas.transition().duration(200).attr('opacity', 0)
            vis.nodes.transition().duration(800).attr('r', 0).attr('transform', d => `translate(${Math.random() * vis.width},${0})`)
            vis.step2description.transition().duration(800).attr('opacity', 0)
            vis.step3description.transition().duration(800).attr('opacity', 0)
            vis.step4description.transition().duration(300).attr('opacity', 0)
            vis.step5description.transition().duration(300).attr('opacity', 0)
            vis.step6description.transition().duration(300).attr('opacity', 0)
            vis.yAxis_countries.attr('opacity', 0)
            // show
            vis.step1description.transition().duration(800).attr('opacity', 1)

        } else if (type === 1) {


            // hide
            d3.select('.annotations-class').transition().duration(1000).attr('opacity', 0)

            vis.areas.transition().duration(200).attr('opacity', 0)
            vis.step1description.transition().duration(800).attr('opacity', 0)
            vis.step3description.transition().duration(800).attr('opacity', 0)
            vis.step4description.transition().duration(300).attr('opacity', 0)
            vis.step5description.transition().duration(300).attr('opacity', 0)
            vis.step6description.transition().duration(300).attr('opacity', 0)
            vis.yAxis_countries.attr('opacity', 0)


            //show
            vis.simulation.stop()
            vis.nodes.transition().duration(1500).attr('transform', d => `translate(${d.x_grid},${d.y_grid})`).attr('r', 6).attr('fill', 'whitesmoke')
            vis.step2description.transition().duration(800).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2) + vis.width / 4},${vis.height / 2})`)

        } else if (type === 2) {

            // hide
            d3.select('.annotations-class').transition().duration(1000).attr('opacity', 0)
            vis.step1description.transition().duration(800).attr('opacity', 0)
            vis.step3description.transition().duration(800).attr('opacity', 0)
            vis.step4description.transition().duration(300).attr('opacity', 0)
            vis.step5description.transition().duration(300).attr('opacity', 0)
            vis.step6description.transition().duration(300).attr('opacity', 0)
            vis.yAxis_countries.attr('opacity', 0)

            // show
            vis.step3description.transition().duration(800).attr('opacity', 1)
            vis.step2description.transition().duration(800).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2)},${50})`)

            vis.areas.transition().duration(400).attr('opacity', 0.4)
            vis.nodes.attr('r', vis.node_radius).attr('fill', 'whitesmoke')

            vis.simulation.force('y', d3.forceY().y(d => d.y_map)).force('x', d3.forceX().x(d => d.x_map))

            vis.simulation.on('tick', () => {
                vis.nodes.transition().duration(800).ease(d3.easeLinear).attr('transform', function (d) {
                    return `translate(${d.x},${d.y})`
                })
            })
            vis.simulation.alpha(1).alphaDecay(0.05).velocityDecay(0.36).restart()

        } else if (type === 3) {

            //hide
            d3.select('.annotations-class').transition().duration(1000).attr('opacity', 0)
            vis.step1description.transition().duration(800).attr('opacity', 0)
            vis.step3description.transition().duration(800).attr('opacity', 0)
            vis.step5description.transition().duration(300).attr('opacity', 0)
            vis.step6description.transition().duration(300).attr('opacity', 0)
            vis.yAxis_countries.attr('opacity', 0)

            // show
            vis.step4description.transition().duration(800).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2)},${200})`)
            vis.step2description.transition().duration(800).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2)},${50})`)

            vis.simulation.force('y', d3.forceY().y(d => d.y_map)).force('x', d3.forceX().x(d => d.x_map))
                .force('collision', d3.forceCollide().radius(d => vis.node_radius + 0.5).iterations(10))


            vis.nodes.attr('r', vis.node_radius).attr('fill', d => {
                if (d.country_code in vis.individual_ratios) {
                    return 'red'
                } else {
                    return 'whitesmoke'
                }
            })
            vis.simulation.force('y', d3.forceY().y(d => d.y_map)).force('x', d3.forceX().x(d => d.x_map))
            vis.areas.transition().duration(400).attr('opacity', 0.4)
            vis.nodes.attr('r', vis.node_radius)
            vis.simulation.on('tick', () => {
                vis.nodes.transition().duration(700).ease(d3.easeLinear).attr('transform', function (d) {
                    return `translate(${d.x},${d.y})`
                })
            })
            vis.simulation.alpha(1).alphaDecay(0.05).velocityDecay(0.36).restart()

        } else if (type === 4) {
            //hide
            d3.select('.annotations-class').transition().duration(1000).attr('opacity', 0)
            vis.step1description.transition().duration(800).attr('opacity', 0)
            vis.step3description.transition().duration(800).attr('opacity', 0)
            vis.step5description.transition().duration(300).attr('opacity', 0)
            vis.step6description.transition().duration(300).attr('opacity', 0)
            vis.areas.transition().duration(200).attr('opacity', 0)


            vis.simulation.stop()
            vis.step4description.transition().duration(800).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2)},${200})`)
            vis.step2description.transition().duration(800).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2)},${50})`)
            vis.step5description.transition().duration(800).attr('opacity', 1)
            vis.nodes.attr('r', vis.node_radius).attr('fill', d => {
                if (d.country_code in vis.individual_ratios) {
                    return 'red'
                } else {
                    return 'whitesmoke'
                }
            })
            vis.yAxis_countries.attr('opacity', 1)

            vis.simulation.force('y', d3.forceX().x(d => vis.x_countries(d.country)).strength(4))
                .force('x', d3.forceY().y(d => vis.y_count(d.count)).strength(1))
            vis.simulation.restart()
            vis.simulation.on('tick', () => {
                vis.nodes.transition().duration(800).ease(d3.easeLinear).attr('transform', function (d) {
                    return `translate(${d.x},${d.y})`
                })
            })
            vis.simulation.alpha(1).alphaDecay(0.1).velocityDecay(0.36).restart()

        } else if (type === 5) {
            d3.select('.annotations-class').transition().duration(1000).attr('opacity', 0)
            // show map
            vis.areas.transition().duration(200).attr('opacity', 0)
            vis.step4description.transition().duration(800).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2)},${200})`)
            vis.step5description.transition().duration(800).attr('opacity', 1)
            vis.step6description.transition().duration(300).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2)},${430})`)
            vis.step2description.transition().duration(800).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2)},${50})`)
            vis.yAxis_countries.attr('opacity', 1)
            vis.nodes.attr('r', vis.node_radius).attr('fill', d => {
                if (d.country_code in vis.individual_ratios) {
                    if (d.count <= vis.countNews[d.country_code]) {
                        return '#ffbf00'
                    } else {
                        return 'red'
                    }
                } else {
                    return 'whitesmoke'
                }
            })

            vis.simulation.stop()
            vis.simulation.force('y', d3.forceX().x(d => vis.x_countries(d.country)).strength(1))
                .force('x', d3.forceY().y(d => vis.y_count(d.count)).strength(0.5))

            vis.simulation.restart()
            vis.simulation.on('tick', () => {
                vis.nodes.transition().duration(800).ease(d3.easeLinear).attr('transform', function (d) {
                    return `translate(${d.x},${d.y})`
                })
            })
            vis.simulation.alpha(1).alphaDecay(0.1).velocityDecay(0.36).restart()
        } else if (type === 6) {

            // hide

            d3.select('.annotations-class').transition().duration(1000).attr('opacity', 0)
            vis.step1description.transition().duration(800).attr('opacity', 0)
            vis.step3description.transition().duration(800).attr('opacity', 0)
            vis.step4description.transition().duration(800).attr('opacity', 0)
            vis.step5description.transition().duration(300).attr('opacity', 0)
            vis.step6description.transition().duration(300).attr('opacity', 0)
            vis.areas.transition().duration(200).attr('opacity', 0)
            vis.yAxis_countries.attr('opacity', 0)


            // show
            vis.step2description.transition().duration(800).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2) + vis.width / 4},${50})`)
            vis.step4description.transition().duration(300).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2) + vis.width / 4},${330})`)
            vis.step6description.transition().duration(300).attr('opacity', 1).attr("transform", `translate(${(vis.width / 2) + vis.width / 4},${530})`)

            d3.select('.annotations-class').transition().duration(1000).attr('opacity', 0)
            vis.areas.transition().duration(200).attr('opacity', 0)

            vis.nodes.attr('r', vis.node_radius).attr('fill', d => {
                if (d.country_code in vis.individual_ratios) {
                    if (d.index <= vis.sumNews-1) {
                        return '#ffbf00'
                    } else {
                        return 'red'
                    }
                } else {
                    return 'whitesmoke'
                }
            })

            vis.simulation.stop()
            vis.nodes.transition().duration(1600).attr('transform', d => `translate(${d.x_grid},${d.y_grid})`).attr('r', 6)
        }
        // #ffbf00

    }

    initStepZero() {
        let vis = this;
        vis.simulation.stop()

        // hide
        d3.select('.annotations-class').transition().duration(1000).attr('opacity', 1)
        vis.areas.transition().duration(200).attr('opacity', 0)
        vis.nodes.transition().duration(800).attr('r', 0).attr('transform', d => `translate(${Math.random() * vis.width},${0})`)
        vis.step2description.transition().duration(800).attr('opacity', 0)
        vis.step3description.transition().duration(800).attr('opacity', 0)
        vis.step4description.transition().duration(300).attr('opacity', 0)
        vis.step5description.transition().duration(300).attr('opacity', 0)
        vis.step6description.transition().duration(300).attr('opacity', 0)
        vis.yAxis_countries.attr('opacity', 0)
        // show
        vis.step1description.transition().duration(800).attr('opacity', 1)
        return Object.assign(vis.svg.node());
    }
}