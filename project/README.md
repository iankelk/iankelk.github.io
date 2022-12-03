# Fantastic Facts and How to Fake Them

**Team Members**: Benjamin Levy, Rachel Moon, Pat Sukhum, Kevin Ji Whan Yoon

* URL to website: https://patsukhum.github.io/Marvel/
* URL to video: https://www.youtube.com/watch?v=_5D8RrOzJQ0

## Project Structure
- `css/`: contains library CSS files as well as our custom `styles.css`.
- `img/`: contains icons, background or auxiliary images used in presentation slides.
- `js/`
    - `libraries/`: downloaded library JavaScript files.
- `visuals/`:
  - `bubbles/`: files for the "bubbles" visualization.
    - `data/`: cleaned data for COVID-19 misinformation split by categories.
    - `img/`: help icon.
    - `js/`
      - `main.js`: loads the data and the visualization.
      - `bubbleVis.js`: bubble visualization graph for COVID-19 misinformation over time.
  - `chumBox`: files for the "chum box" visualization.
      - `img/`: images for the "ads".
      - `js/`
        - `main.js`: defines the data and sets the event listener to display it.
  - `forceDirect`: files for the "Disinformation 6" Twitter Interactions visualization.
    - `data/`: cleaned data for the "Disinformation 6" Twitter interactions.
    - `img/`: profile pictures of Twitter uses and help icon.
    - `js/`
      - `main.js`: loads the data and the visualization.
      - `forceVis.js`: force-directed visualization of Twitter Interactions by the "Disinformation 6".
      - `cola-min.js`: constraint-based layout library file.
  - `globe`: files for historical fake news visualization.
    - `data/`:
      - `historyfake.tsv`: manually generated dataset of historical fake news.
    - `img/`: images used in the visualization.
    - `js/`
      - `main.js`: loads the data and the visualization.
      - `globeVis.js`: interactive Globe visualization for fake news per country.
      - `timelineVis.js`: interactive Timeline of fake news.
      - `linkViews.js`: helper function to connect timeline selections with globe.
      - `textVis.js`: 
    



- `data/`:
    - `raw/`: contains raw data collected
    - `clean/`: contains cleaned data used for our visualization
    - `scripts/`: all data collecting/cleaning Python/Jupyter Notebook scripts
- `js/`
    - `libraries/`: downloaded library JavaScript files, such as bootstrap, jQuery, D3, etc.
    - `char-stats-vis.js`: character wiki stats visualization
    - `cookiechart-vis.js`: cookie chart (genre bubble) visualization
    - `dynamics.js`: for handling visualization dynamics with scrolling
    - `linechart-vis.js`: line chart visualization
    - `main.js`: main JavaScript file for loading data and all visualizations
    - `map-carousel.js`: map poster carousel functions
    - `map-vis.js`: map visualization
    - `matrix-vis.js`: character power matrix visualization
    - `network-vis.js`: character network visualization
    - `plot-flow-vis.js`: plot tree chart visualization
    - `title-vis.js`: for title page visualization
    - `utils.js`: for general reusable functions

- `img/`: contains images for characters,backgrounds,etc.
- `index.html`: main html file for our website.