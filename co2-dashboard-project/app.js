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


		// var mapWidth = 700;
		// var mapHeight = 700;

		var map = d3.select('#map');
					// .attr('width', mapWidth)
					// .attr('height', mapHeight);

		// var chartWidth = 500;
		// var chartHeight = 500;

		var pie = d3.select('#pie');
					// .attr('width', chartWidth)
					// .attr('height', chartHeight);


		var bar = d3.select('#bar');
					// .attr('width', chartWidth)
					// .attr('height', chartHeight);
	});

