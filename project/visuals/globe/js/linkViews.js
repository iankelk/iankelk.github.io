function linkViews(fakeNews){
    // This function changes the colors of the timeline to match the historical news chosen
    // It calls updateText to change the text description to match that fake news

    // Make all news from that country orange
    // Get all news from that country
    let countryNews = myGlobeVis.historyData.filter(d => d.name == fakeNews.name);

    // Reset the color of the timeline circles
    d3.selectAll(".circle")
        .attr("stroke", "none")
        .attr("fill", d => {
            if(countryNews.includes(d)){ // Make fake news for that same country also orange
                return "orange";
            }else{
                return "#0B0B45";
            }

        })

    // Change the circle of the selected fake news and make it orange
    d3.select("#news-" + fakeNews.id)
        .attr("fill", "orange")
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

function updateText(fakeNews){

    // Adds a description text based on the content of the fake news chosen
    myGlobeVis.description.html(`
                         <div style="width:60vw; max-height:28vh; border-radius: 5px; padding: 5px; margin: auto;">
                             <h4>${fakeNews.event} <span style="font-size: 0.7em"> - ${formatYear(fakeNews.year)}, ${fakeNews.name}</span> <h3>   
                             <p class="news-description">${fakeNews.news}</p>   
                         </div>`);

    myGlobeVis.newsimage.html(`
                    <img class="globe-image" src="visuals/globe/img/${fakeNews.image_code}" alt="${fakeNews.alt}" title="${fakeNews.img_credit}">
                    `
    );

}