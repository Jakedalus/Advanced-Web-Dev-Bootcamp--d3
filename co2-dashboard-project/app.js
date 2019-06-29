d3.queue()
	.defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
	.defer(d3.csv, './data/all_data.csv')
	.await((error, mapData, co2Data) => {
		if (error) throw error;

		var geoData = topojson.feature(mapData, mapData.objects.countries).features;

		console.log('mapData:', mapData);
		console.log('co2Data:', co2Data);

		var filteredData = co2Data.filter(d => +d.Year === 2011);

		console.log('filteredData:', filteredData);

		filteredData.forEach(row => {
			var countries = geoData.filter(d => d.id === row['Country Code']);
			countries.forEach(country => country.properties = row);
		});

		console.log('geoData:', geoData);

		var map = d3.select('#map');

		// console.log(map, map.style("width"));

		var mapWidth = +map.style("width").slice(0, map.style("width").length-2);
		var mapHeight = +map.style("height").slice(0, map.style("height").length-2);

		console.log(mapWidth, mapHeight);

		var projection = d3.geoEquirectangular()
								.scale(80)
								.translate([ mapWidth / 2, mapHeight / 2]);
		var path = d3.geoPath()	
						.projection(projection);


		map
			.selectAll('.country')
			.data(geoData)
			.enter()
			.append('path')
				.classed('country', true)
				.attr('d', path);

		setMapColor(2011);

		function setMapColor() {

			

			// console.log('Data filtered by year:', filteredData);
			console.log('Max Emissions:', d3.max(geoData, d => +d.properties.Emissions));
			console.log('Max Emissions Per Capita:', d3.max(geoData, d => +d.properties['Emissions Per Capita']));
			console.log('Max Emissions Per Capita:', geoData.filter(d => +d.properties['Emissions Per Capita'] === d3.max(geoData, d => +d.properties['Emissions Per Capita'])));

			console.log('Min Emissions Per Capita:', d3.min(geoData, d => +d.properties['Emissions Per Capita']));


			var emissionsScale = d3.scaleLinear()
							.domain([0, d3.max(geoData, d => +d.properties.Emissions)])
							.range(['white', '#bb0a1e']);

			var emissionsPerCapitaScale = d3.scaleLinear()
							.domain([0, d3.max(geoData, d => +d.properties['Emissions Per Capita']) ])
							.range(['orange','darkred']);

			d3.selectAll('.country')
					.transition()
					.duration(750)
					.ease(d3.easeBackIn)
					.attr('fill', d => {
						// console.log(d);
						// var data = d.properties.Emissions;
						var data = +d.properties['Emissions Per Capita'];

						console.log(d.properties.Country, data, emissionsPerCapitaScale(data));

						return data ? emissionsPerCapitaScale(data) : '#ccc';
						// return data ? emissionsScale(data) : '#ccc';	
					});
		}


		var pie = d3.select('#pie');
					// .attr('width', chartWidth)
					// .attr('height', chartHeight);


		var bar = d3.select('#bar');
					// .attr('width', chartWidth)
					// .attr('height', chartHeight);
	});

