d3.queue()
	.defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
	.defer(d3.csv, './data/all_data.csv')
	.await((error, mapData, co2Data) => {
		if (error) throw error;

		var geoData = topojson.feature(mapData, mapData.objects.countries).features;

		console.log(mapData);
		console.log(co2Data);

		co2Data.forEach(row => {
			var countries = geoData.filter(d => d.id === row['Country Code']);
			countries.forEach(country => country.properties = row);
		});

		console.log(geoData);

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

		// var chartWidth = 500;
		// var chartHeight = 500;

		var pie = d3.select('#pie');
					// .attr('width', chartWidth)
					// .attr('height', chartHeight);


		var bar = d3.select('#bar');
					// .attr('width', chartWidth)
					// .attr('height', chartHeight);
	});

