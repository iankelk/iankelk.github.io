// Init global variables
let myAreaChartVis;
let myTimeLineVis;
let selectedTweetCategory =  document.getElementById('tweet-category').value;

// Load data using promises
let promises = [
	d3.json("data/covid_vs_tweets.json", (row, i) => {
		row.map((d, i) => ({id: i + 1, ...d}))
	})
];

Promise.all(promises)
	.then(function (data) {
		initMainPage(data);
	})
	.catch(function (err) {
		console.log(err);
	});

// initMainPage
function initMainPage(dataArray) {
	let data = dataArray[0];
	console.log(selectedTweetCategory)
	console.log(data)

	// Init areachart and timeline
	myAreaChartVis = new StackedAreaChart(document.getElementById('stacked-area-chart'), data.tweets);
	//myTimeLineVis = new Timeline(document.getElementById('timeline'), data.covid);
}

// Selector listener
function changeTweetCategory() {
	selectedTweetCategory =  document.getElementById('tweet-category').value;
	myAreaChartVis.wrangleData();
	//myTimeLineVis.wrangleData();
}
// Proper case function adapted from here: https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();});
};

// var string="The water content is considered acceptable for this voltage class. Dielectric Breakdown Voltage is unacceptable for transformers > 288 KV. Power factors, Interfacial Tension and Neutralization Number are acceptable for continued use in-service.";
function splitLongString(N, longString) {
	let app = longString.split(' '),
		arrayApp = [],
		stringApp = "";
	app.forEach(function (sentence, index) {
		stringApp += sentence + ' ';

		if ((index + 1) % N === 0) {
			arrayApp.push(stringApp);
			stringApp = '';
		} else if (app.length === index + 1 && stringApp !== '') {
			arrayApp.push(stringApp);
			stringApp = '';
		}
	});
	return arrayApp.join("<br />");
}

function brushed(event) {
	if (event.selection === null) {
		myAreaChartVis.x.domain(d3.extent(myAreaChartVis.data, d=> d3.isoParse(d.date)));
		myAreaChartVis.wrangleData(300);
		return;
	}
	// TO-DO: React to 'brushed' event
	// Get the extent of the current brush
	let selectionRange = d3.brushSelection(d3.select(".brush").node());

	// Convert the extent into the corresponding domain values
	let selectionDomain = selectionRange.map(timeline.xScale.invert);
	myAreaChartVis.x.domain(selectionDomain)
	myAreaChartVis.wrangleData();
}
