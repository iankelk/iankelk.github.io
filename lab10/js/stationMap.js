
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */
class StationMap {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, displayData, mbtaData, mapCenter) {
		this.parentElement = parentElement;
		this.displayData = displayData;
		this.mbtaData = mbtaData;
		this.mapCenter = mapCenter;
		this.initVis();
	}

	/*
	 *  Initialize station map
	 */
	initVis () {
		let vis = this;

		vis.map = L.map(vis.parentElement).setView(vis.mapCenter, 13);

		// The images are in the directory "/img":
		L.Icon.Default.imagePath = 'img/';

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(vis.map);

		// Defining an icon class with general options
		let LeafIcon = L.Icon.extend({
			options: {
				shadowUrl: 'img/marker-shadow.png',
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [0, -28]
			}
		});

		vis.redMarker = new LeafIcon({ iconUrl:  'img/marker-red.png' });
		vis.blueMarker = new LeafIcon({ iconUrl:  'img/marker-blue.png' });
		vis.greenMarker = new LeafIcon({ iconUrl:  'img/marker-green.png' });
		vis.yellowMarker = new LeafIcon({ iconUrl:  'img/marker-yellow.png' });

		// Add empty layer groups for the markers / map objects
		vis.stations = L.layerGroup().addTo(vis.map);

		vis.wrangleData();
	}

	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		// No data wrangling/filtering needed

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		console.log(this.displayData)

		vis.displayData.forEach((d,i) => {
			vis.marker = L.marker([d.lat, d.long],{icon: styleMarker(d)})
				.addTo(vis.map)
				.bindPopup(d.name + "<br> Capacity: " + d.capacity + "<br> Available Bikes: " +
					d.numBikesAvailable + "<br> Available Docks: " + d.numDocksAvailable +
					"<br> E-Bikes Available: " + d.numEbikesAvailable +
					"<br> Disabled Bikes: " + d.numBikesDisabled +
					"<br> Disabled Docks: " + d.numDocksDisabled )
			vis.stations.addLayer(vis.marker)
		})

		// Add MBTA lines
		L.geoJson(vis.mbtaData, {
			style: styleLines,
			weight: 6,
			fillOpacity: 0.5
		}).addTo(vis.map)

		function styleMarker(d) {
			if (d.numBikesAvailable === 0 && d.numDocksAvailable === 0 ) {
				return vis.redMarker;
			}
			else if (d.numBikesAvailable === 0 || d.numDocksAvailable === 0 ) {
				return vis.yellowMarker;
			}
			else if (d.numEbikesAvailable !== 0) {
				return vis.greenMarker;
			}
			else {
				return vis.blueMarker;
			}
		}
		function styleLines(feature) {
			switch(feature.properties.LINE){
				case 'GREEN': return {color: "green"};
				case 'RED': return {color: "red"};
				case 'BLUE': return {color: "blue"};
				case 'SILVER': return {color: "grey"};
				case 'ORANGE': return {color: "orange"};
			}
		}
	}
}

