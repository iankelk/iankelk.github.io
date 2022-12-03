# Fantastic Facts and How to Fake Them

## Introduction
What is fake news? Where do they come from? What is their goal?
How can you guard against them? 
This visualization project aims to answer all these questions in  a fun, impactful way,
telling a story through data.

**Team Members**: Ian Kelk, Ronan Fonseca

* URL to website: https://iankelk.github.io/project/
* URL to video: https://www.youtube.com/watch?v=V8gTSvInKDA

## Project Structure
- `index.html`: html file for the project
- `css/`: contains library CSS files as well as our custom `styles.css` and `aos-delays.css` containing
custom animation durations for the AOS library.
- `img/`: contains icons, background or auxiliary images used in presentation slides.
- `js/`
    - `libraries/`: downloaded library JavaScript files.
- `visuals/`: files for each individual visualization.
  - `bubbles/`: files for the "bubbles" visualization.
    - `data/`: cleaned data for COVID-19 misinformation split by categories.
    - `img/`: help icon.
    - `js/`
      - `main.js`: loads the data and the visualization.
      - `bubbleVis.js`: bubble visualization graph for COVID-19 misinformation over time.
  - `chumBox/`: files for the "chum box" visualization.
      - `img/`: images for the "ads".
      - `js/`
        - `main.js`: defines the data and sets the event listener to display it.
  - `forceDirect/`: files for the "Disinformation 6" Twitter Interactions visualization.
    - `data/`: cleaned data for the "Disinformation 6" Twitter interactions.
    - `img/`: profile pictures of Twitter uses and help icon.
    - `js/`
      - `main.js`: loads the data and the visualization.
      - `forceVis.js`: force-directed visualization of Twitter Interactions by the "Disinformation 6".
      - `cola-min.js`: constraint-based layout library file.
  - `globe/`: files for historical fake news visualization.
    - `data/`:
      - `historyfake.tsv`: manually generated dataset of historical fake news.
    - `img/`: images used in the visualization.
    - `js/`
      - `main.js`: loads the data and the visualization.
      - `globeVis.js`: interactive Globe visualization for fake news per country.
      - `timelineVis.js`: interactive Timeline of fake news.
      - `linkViews.js`: connects timeline and globe selections, displaying corresponding image and text.
  - `hotspot/`: files for the online news article visualization.
  - `img/`: contains the newspaper article screenshot.
  - `js/`
    - `main.js`: loads the data and the visualization.
    - `hoverVis.js`: "hotspot" interactive visualization with fake news educational content.
  - `story/`: files for the "misinformation across the globe" visualization
    - `data/`: cleaned COVID-19 misinformation data aggregated by country, and geoJSON data.
    - `js/`
      - `main.js`: loads the data and the visualization.
      - `story.js`: visualization for COVID-19 fake news misinformation by individuals and countries.
  - `tweetTimeline/`: files for the Deaths vs Tweets COVID-19 Timeline visualization
    - `data/`: contains cleaned JSON data, for tweets by the Disinformation 6, and Covid-19 deaths per day
    - `img/`: help icons.
    - `js/`
      - `main.js`: loads the data and the visualization.
      - `stackedAreaChart.js`: stacked area chart visualization showing tweet counts of the Disinformation 6 over time.
      - `timeline.js`: interactive COVID-19 deaths timeline.
  - `wordcloud/`: files for the Disinformation 6 word cloud visualization.
    - `data/`: cleaned data for the 150 most used words by the Disinformation 6 on tweets.
    - `js/`
      - `main.js`: loads the data and the visualization.
      - `wordcloud.js`: interactive word cloud visualization.
      - `d3.layout.cloud.js`: library for word clouds.

data_description.pdf contains a description of the datasets used and the adaptations used for each visualization.

## Libraries Used
  - [fullPage](https://alvarotrigo.com/fullPage/): used to join the visualizations into one scrollable web page.
  - [AOS - Animate On Scroll](https://michalsnik.github.io/aos/): used to create animations for text as the user scrolls.
  - [noUiSlider](https://refreshless.com/nouislider/): JavaScript library for range sliders.
  - [d3.cloud](https://github.com/jasondavies/d3-cloud): JavaScript library for creating word clouds.
  - [cola](https://marvl.infotech.monash.edu/webcola/): JavaScript library with implementation for Force-Directed graphs.
  