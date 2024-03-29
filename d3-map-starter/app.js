d3.queue()
	.defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
	.defer(d3.csv, './country_data.csv', function(row) {
		return {
			country: row.country,
			countryCode: row.countryCode,
			population: +row.population,
			medianAge: +row.medianAge,
			fertilityRate: +row.fertilityRate,
			populationDensity: +row.population / +row.landArea
		}
	})
	.await(function(error, mapData, populationData) {
		if (error) throw error;

		var geoData = topojson.feature(mapData, mapData.objects.countries).features;


		populationData.forEach(row => {
			var countries = geoData.filter(d => d.id === row.countryCode);
			countries.forEach(country => country.properties = row);
		});

		console.log(geoData);

		var width = 700;
		var height = 500;

		var projection = d3.geoEquirectangular()
												.scale(110)
												.translate([width / 2, height / 2.4]);
		// var projection = d3.geoAzimuthalEqualArea();

		var path = d3.geoPath()	
									.projection(projection);



		d3.select('svg')
				.attr('width', width)
				.attr('height', height)
			.selectAll('.country')
			.data(geoData)
			.enter()
			.append('path')
				.classed('country', true)
				.attr('d', path);


		var select = d3.select('select');

		select
			.on('change', d => setColor(d3.event.target.value));

		setColor(select.property('value'));


		function setColor(val) {

			console.log(val);

			var colorRange = {
				population: ['white', 'purple'],
				populationDensity: ['white', 'red'],
				medianAge: ['white', 'blue'],
				fertilityRate: ['white', 'orange']
			};

			var scale = d3.scaleLinear()
										.domain([0, d3.max(populationData, d => d[val])])
										.range(colorRange[val]);

			d3.selectAll('.country')
					.transition()
					.duration(750)
					.ease(d3.easeBackIn)
					.attr('fill', d => {
						var data = d.properties[val];

						return data ? scale(data) : '#ccc';
					});

		}

	});














