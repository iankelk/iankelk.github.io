function linkViews(fakeNews){
    // This function changes the colors of the timeline to match the historical news chosen
    // It calls updateText to change the text description to match that fake news

    // Make all news from that country a darker red

    // Get all news from that country
    let countryNews = myGlobeVis.historyData.filter(d => d.name == fakeNews.name);

    // Reset the color of the timeline circles
    d3.selectAll(".circle")
        .attr("stroke", "none")
        .attr("fill", d => {
            if(countryNews.includes(d)){ // Make fake news for that same country also red
                return "red";
            }else{
                return "#0B0B45";
            }

        })


    // Change the circle of the selected fake news and make it red
    d3.select("#news-" + fakeNews.id)
        .attr("fill", "red")
        .transition()
        .duration(200)
        .attr("r", "20") // Make circle increase in size then decrease to "pop out"
        .attr("stroke-width", "5")
        .attr("stroke", "maroon")
        .transition()
        .duration(200)
        .attr("stroke-width", "5")
        .attr("stroke", "maroon")
        .attr("r", "8");

    updateText(fakeNews);
}