d3.queue()
	.defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
	.defer(d3.csv, './data/all_data.csv')
	.await((error, mapData, co2Data) => {
		if (error) throw error;


		// LOAD AND PROCESS DATA

		

		console.log('mapData:', mapData);
		console.log('co2Data:', co2Data);

		var geoData = topojson.feature(mapData, mapData.objects.countries).features;

		co2Data.forEach(row => {
			var countries = geoData.filter(d => d.id === row['Country Code']);
			countries.forEach(country => {
				// console.log('row:', row);
				if (country.properties.data) {
					country.properties.data.push({
						year: row.Year,
						emisssions: row.Emissions,
						emisssionsPerCapita: row['Emissions Per Capita']
					}); 
				} else {
					country.properties.data = [{
						year: row.Year,
						emisssions: row.Emissions,
						emisssionsPerCapita: row['Emissions Per Capita']
					}];
					country.properties.country = row.Country;
					country.properties.continent = row.Continent;
					country.properties.countryCode = row['Country Code'];
					country.properties.region = row.Region;
				}
					
			});
		});

		console.log('geoData:', geoData);

		

		// YEAR INPUT SLIDER

		d3.select('#year-input')
			.property('min', d3.min(co2Data, d => +d.Year))
			.property('max', d3.max(co2Data, d => +d.Year))
			.property('value', d3.max(co2Data, d => +d.Year))
			.on('change', function() {
				console.log('Setting year to: ', +d3.event.target.value);

				d3.select('#current-year')
					.text(+d3.event.target.value);

				setMapColor(+d3.event.target.value);
			});



		// MAP

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

		d3.select('#current-year')
					.text(2011);


		// function setFilteredData(year) {
		// 	var geoData = topojson.feature(mapData, mapData.objects.countries).features;
		// 	var filteredCO2Data = co2Data.filter(d => +d.Year === year);

		// 	console.log('filteredCO2Data:', filteredCO2Data);

		// 	filteredCO2Data.forEach(row => {
		// 		var countries = geoData.filter(d => d.id === row['Country Code']);
		// 		countries.forEach(country => country.properties = row);
		// 	});

		// 	console.log('geoData:', geoData);

		// 	return geoData;

		// }

		function setMapColor(year) {

			console.log('Year:', year);

			var filteredCO2Data = co2Data.filter(d => +d.Year === year);

			console.log('filteredCO2Data:', filteredCO2Data);

			// console.log('Data filtered by year:', filteredData);
			console.log('Max Emissions:', d3.max(filteredCO2Data, d => +d.Emissions));
			console.log('Max Emissions Per Capita:', d3.max(filteredCO2Data, d => +d['Emissions Per Capita']));
			console.log('Max Emissions Per Capita:', filteredCO2Data.filter(d => +d['Emissions Per Capita'] === d3.max(filteredCO2Data, d => +d['Emissions Per Capita'])));

			console.log('Min Emissions Per Capita:', d3.min(filteredCO2Data, d => +d['Emissions Per Capita']));


			var emissionsScale = d3.scaleLinear()
							.domain([0, d3.max(filteredCO2Data, d => +d.Emissions)])
							.range(['white', '#bb0a1e']);

			var emissionsPerCapitaScale = d3.scaleLinear()
							.domain([0, d3.max(filteredCO2Data, d => +d['Emissions Per Capita']) ])
							.range(['orange','darkred']);

			console.log(d3.selectAll('.country'));

			d3.selectAll('.country')
					.transition()
					.duration(750)
					.ease(d3.easeBackIn)
					.attr('fill', d => {
						console.log('setting country color:', d.properties.country);
						console.log(d);
						var data = null;
						if(Object.entries(d.properties).length !== 0 && d.properties.constructor === Object) {
							data = d.properties.data.filter(d => +d.year === year)[0];

							console.log('data:', data);

							if (data) console.log(d.properties.country, data.emisssionsPerCapita, emissionsPerCapitaScale(data.emisssionsPerCapita));

							return data ? emissionsPerCapitaScale(data.emisssionsPerCapita) : '#ccc';
						}

						return '#ccc';

						

						// return data ? emissionsPerCapitaScale(data) : '#ccc';
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

