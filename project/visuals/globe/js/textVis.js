function updateText(fakeNews){

    // Adds a description text based on the content of the fake news chosen
    myGlobeVis.description.html(`
                         <div style="width:60vw; max-height:28vh; border-radius: 5px; padding: 5px; margin: auto;">
                             <h4>${fakeNews.event} <span style="font-size: 0.7em"> - ${formatYear(fakeNews.year)}, ${fakeNews.name}</span> <h3>   
                             <p class="news-description">${fakeNews.news}</p>   
                         </div>`);

    myGlobeVis.newsimage.html(`
                    <img src="visuals/globe/img/${fakeNews.image_code}" alt="${fakeNews.alt}" title="${fakeNews.img_credit}">
                    `
    );

}