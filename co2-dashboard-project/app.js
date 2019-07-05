d3.queue()
	.defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
	.defer(d3.csv, './data/all_data.csv', function(row) {
		return {
			continent: row.Continent,
			country: row.Country,
			countryCode: row['Country Code'],
			emissions: +row.Emissions,
			emissionsPerCapita: +row['Emissions Per Capita'],
			region: row.Region,
			year: +row.Year
		}
	})
	.await((error, mapData, co2Data) => {
		if (error) throw error;


		// LOAD AND PROCESS DATA

		

		console.log('mapData:', mapData);
		console.log('co2Data:', co2Data);

		var geoData = topojson.feature(mapData, mapData.objects.countries).features;

		co2Data.forEach(row => {
			var countries = geoData.filter(d => d.id === row.countryCode);
			countries.forEach(country => {
				// console.log('row:', row);
				if (country.properties.data) {
					country.properties.data.push({
						year: row.year,
						emissions: row.emissions,
						emissionsPerCapita: row.emissionsPerCapita
					}); 
				} else {
					country.properties.data = [{
						year: row.year,
						emissions: row.emissions,
						emissionsPerCapita: row.emissionsPerCapita
					}];
					country.properties.country = row.country;
					country.properties.continent = row.continent;
					country.properties.countryCode = row.countryCode;
					country.properties.region = row.region;
				}
					
			});
		});

		console.log('geoData:', geoData);

		

	







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

		map
			.append("text")
	      .attr("x", mapWidth / 2)
	      .attr("y", "1em")
	      .attr("font-size", "1.5em")
	      .style("text-anchor", "middle")
	      .classed("map-title", true);

		d3.select('#current-year')
					.text(2011);

		setMapColor(2011, 'emissions-total');
		drawPieChart(2011, 'emissions-total');

		let currentCountry = {};

		d3.selectAll('.country')
			.on('mousemove touchmove', showTooltip)
      .on('mouseout touchend', hideTooltip)
			.on('click', function(d) {
				console.log('Data:', d);
				console.log(d3.event.target);	
				currentCountry = d;
				var emissionsType = d3.select(':checked').property('value');
				drawBarGraph(d, emissionsType);
			});


		// YEAR INPUT SLIDER

		d3.select('#year-input')
			.property('min', d3.min(co2Data, d => d.year))
			.property('max', d3.max(co2Data, d => d.year))
			.property('value', d3.max(co2Data, d => d.year))
			.on('change', function() {
				console.log('Setting year to: ', +d3.event.target.value);

				d3.select('#current-year')
					.text(+d3.event.target.value);

				var emissionsType = d3.select(':checked').property('value');

				

				console.log(emissionsType);


				setMapColor(+d3.event.target.value, emissionsType);
				drawPieChart(+d3.event.target.value, emissionsType);
				drawBarGraph(currentCountry, emissionsType)
			});


		// BAR GRAPH
		// drawBarGraph();


		// EMISSIONS/EMISSIONS PER CAPITA RADIO BUTTONS

		d3.select('radiogroup')
			.on('change', function() {
				console.log(d3.event.target.value);

				var year = +d3.select('#year-input').property('value');

				console.log(year);

				setMapColor(year, d3.event.target.value);
				drawPieChart(year, d3.event.target.value);
				if(Object.entries(currentCountry).length !== 0 && currentCountry.constructor === Object) drawBarGraph(currentCountry, d3.event.target.value);
			});


    // HELPER FUNCTIONS

		function setMapColor(year, emissionsType) {

			console.log('Year:', year);
			console.log('emissionsType:', emissionsType);

			var filteredCO2Data = co2Data.filter(d => d.year === year);

			console.log('filteredCO2Data:', filteredCO2Data);

			// console.log('Data filtered by year:', filteredData);
			console.log('Max Emissions:', d3.max(filteredCO2Data, d => d.emissions));
			console.log('Max Emissions Per Capita:', d3.max(filteredCO2Data, d => d.emissionsPerCapita));
			console.log('Max Emissions Per Capita:', filteredCO2Data.filter(d => d.emissionsPerCapita === d3.max(filteredCO2Data, d => d.emissionsPerCapita)));

			console.log('Min Emissions Per Capita:', d3.min(filteredCO2Data, d => d.emissionsPerCapita));


			var emissionsScale = d3.scaleLinear()
							.domain([0, d3.max(filteredCO2Data, d => d.emissions)])
							.range(['white', '#c0392b']);

			var emissionsPerCapitaScale = d3.scaleLinear()
							.domain([0, d3.max(filteredCO2Data, d => d.emissionsPerCapita) ])
							.range(['white','#c0392b']);

			console.log(d3.selectAll('.country'));

			d3.selectAll('.country')
					.transition()
					.duration(750)
					.ease(d3.easeBackIn)
					.attr('fill', d => {
						// console.log('setting country color:', d.properties.country);
						// console.log(d);
						var data = null;
						if(Object.entries(d.properties).length !== 0 && d.properties.constructor === Object) {
							data = d.properties.data.filter(d => +d.year === year)[0];

							// console.log('data:', data);
							// console.log('emissionsType:', emissionsType);

							// if (data) console.log(d.properties.country, data.emissionsPerCapita, emissionsPerCapitaScale(data.emissionsPerCapita));
							if (data) {
								if (emissionsType === 'emissions-total') {
									return emissionsScale(data.emissions);
								} else if (emissionsType === 'emissions-per-capita') {
									return emissionsPerCapitaScale(data.emissionsPerCapita);
								}
							} 
							
						}

						return '#ccc';

						

						// return data ? emissionsPerCapitaScale(data) : '#ccc';
						// return data ? emissionsScale(data) : '#ccc';	
					});

			d3.select('.map-title')
					.text("Carbon dioxide " + graphTitle(emissionsType) + ", " + year);

			function graphTitle(str) {
			  return str.replace(/[A-Z]/g, c => " " + c.toLowerCase());
			}

		}

		function drawPieChart(year, emissionsType) {
			var filteredCO2Data = co2Data.filter(d => d.year === year);

			var continentScale = d3.scaleOrdinal()
							.domain(['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'])
							.range(['blue', 'green', 'orange', 'red', 'purple']);


			var arcs = d3.pie()
				.value(d => emissionsType === 'emissions-total' ? d.emissions : d.emissionsPerCapita)
				.sort(function(a, b) {
					// console.log('a:', a);
					// console.log('b:', b);
					if (a.continent < b.continent) return -1;
					else if(a.continent > b.continent) return 1;
					// else return emissionsType === 'emissions-total' ? a.emissions - b.emissions : a.emissionsPerCapita - b.emissionsPerCapita;
				})
				(filteredCO2Data);


			console.log('arcs', arcs);

			console.log('arcs with no angle:', arcs.filter(a => a.startAngle === null));
			console.log('arcs.startAngle:', arcs.map(a => a.startAngle));

							

			console.log('pie.style:', d3.select('#pie').style('width'));

			var chartWidth = +d3.select('#pie').style("width").slice(0, d3.select('#pie').style("width").length-2);
			var chartHeight = +d3.select('#pie').style("height").slice(0, d3.select('#pie').style("height").length-2);

			console.log(chartWidth, chartHeight);

			

			var path = d3.arc()
						.outerRadius((chartWidth / 4) - 10)
						.innerRadius(0);

			var pie = d3.select('#pie')
				.attr('width', chartWidth)
  			.attr('height', chartHeight)
				.append('g')
					.attr('transform', `translate(${chartWidth / 2}, ${chartHeight / 2}) `)
				.selectAll('.arc')
				.data(arcs);

			console.log('path:', path);
			console.log('pie2:', pie);
						
			pie	
				.exit()
				.remove();
			
			pie
				.enter()
				.append('path')
					.classed('arc', true)
					.on('mousemove touchmove', showTooltip)
      		.on('mouseout touchend', hideTooltip)
				.merge(pie)		
					.attr('fill', d => continentScale(d.data.continent))
					.attr('stroke', 'white')
					.attr('stroke-width', '.2px')
					.attr('d', path);

		}


		function drawBarGraph(country, emissionsType) {

			var year = +d3.select('#year-input').property('value');


			var data = country.properties.data.sort((a,b) => a.year - b.year);

			console.log('data:', data);
			console.log('emissionsType:', emissionsType);


			var chartWidth = +d3.select('#bar').style("width").slice(0, d3.select('#bar').style("width").length-2);
			// var chartWidth = 500;
			var chartHeight = +d3.select('#bar').style("height").slice(0, d3.select('#bar').style("height").length-2);
			var padding = {
				top: 30,
				right: 30,
				bottom: 30,
				left: 110
			};

			console.log('co2Data:', co2Data);

			var minYear = d3.min(data, d => d.year);
			var maxYear = d3.max(data, d => d.year);
			var maxEmissions = d3.max(co2Data, d => d.emissions);
			var maxEmissionsPerCaptia = d3.max(co2Data, d => d.emissionsPerCapita);

			var numBars = data.length;
			var barPadding = 2;
			var barWidth = ((chartWidth - padding.left) / numBars) - barPadding;

			var yScale = d3.scaleLinear()
			        .domain([0, emissionsType === 'emissions-total' ? maxEmissions : maxEmissionsPerCaptia])
			        .range([chartHeight - padding.bottom, padding.top]);

			var xScale = d3.scaleLinear()
                     .domain(d3.extent(data, d => d.year))
                     .range([padding.left, chartWidth - padding.right]);



			console.log(`
				minYear: ${minYear}
				maxYear: ${maxYear}
				maxEmissions: ${maxEmissions}
				maxEmissionsPerCaptia: ${maxEmissionsPerCaptia}
				yScale: ${yScale}
				xScale: ${xScale}
			`);

			var bar = d3.select('#bar');


	    bar.append('g')
        .attr('transform', 'translate(0, ' + (chartHeight - padding.bottom) + ')')
        .classed('x-axis', true);

	    bar.append('g')
	        .attr('transform', 'translate(' + (padding.left - 0) + ',0)')
	        .classed('y-axis', true);

	    d3.select('.x-axis')
	          .call(d3.axisBottom(xScale).tickFormat(d3.format('.0f')));

	    d3.select('.y-axis')
	        .call(d3.axisLeft(yScale));

			var update = bar
			    .attr('width', chartWidth)
			    .attr('height', chartHeight)
			  .selectAll('rect')
			  .data(data);


			update
				.exit()
				.remove();


			update
			  .enter()
		  	.append('rect')
		  		.on('mousemove touchmove', showTooltip)
      		.on('mouseout touchend', hideTooltip)
		  		.attr('width', barWidth)
			    .attr('height', d => {
			    	if (emissionsType === 'emissions-total') {
			    		return chartHeight - yScale(d.emissions) - 20;
			    	} else if (emissionsType === 'emissions-per-capita') {
			    		return chartHeight - yScale(d.emissionsPerCapita) - 20
			    	}
			    })
			    .attr('y', d => {
			    	if (emissionsType === 'emissions-total') {
			    		return yScale(d.emissions) - 10;
			    	} else if (emissionsType === 'emissions-per-capita') {
			    		return yScale(d.emissionsPerCapita) - 10
			    	}
			    	
			    })
			    .attr('x', (d,i) => xScale(d.year))
			    .attr('fill', 'purple')
			    .attr('fill', d => {
				    	if (d.year === year) {
				    		return 'blue';
				    	} else {
				    		return 'purple';
				    	}
				   })
        .merge(update)
        	.transition()
          .duration(500)
          .delay((d, i) => i * 5)
	          .attr('width', barWidth)
				    .attr('height', d => {
				    	if (emissionsType === 'emissions-total') {
				    		return chartHeight - yScale(d.emissions) - 20;
				    	} else if (emissionsType === 'emissions-per-capita') {
				    		return chartHeight - yScale(d.emissionsPerCapita) - 20
				    	}
				    })
				    .attr('y', d => {
				    	if (emissionsType === 'emissions-total') {
				    		return yScale(d.emissions) - 10;
				    	} else if (emissionsType === 'emissions-per-capita') {
				    		return yScale(d.emissionsPerCapita) - 10
				    	}
				    	
				    })
				    .attr('x', (d,i) => xScale(d.year))
				    .attr('fill', d => {
				    	if (d.year === year) {
				    		return 'blue';
				    	} else {
				    		return 'purple';
				    	}
				    });
			    

			bar.append('text')
        .attr('x', chartWidth / 2)
        .attr('y', "1em")
        .attr("font-size", "1.5em")
        .attr('text-anchor', 'middle')
        .classed('title', true);

      bar.append('text')
	        .text('CO2 Emissions, metric tons')
	        .attr('transform', 'rotate(-90)')
	        .attr('x', - chartHeight / 2)
	        .attr('dy', '1em')
	        .attr('text-anchor', 'middle')
	        .classed("y-axis-label", true);

	    d3.select('.title')
          .text(emissionsType === 'emissions-total' ? `CO2 Emissions, ${country.properties.country}` : `CO2 Emissions Per Capita, ${country.properties.country}`);

		}

		function showTooltip(d) {
      var tooltip = d3.select('#tooltip');

      // console.log('showTooltip, d:', d);
      // console.log('d.hasOwnProperty("geometry"):', d.hasOwnProperty('geometry'));
      // console.log('tooltip:', tooltip);

      var year = +d3.select('#year-input').property('value');

      var countryData = {};

      var html = ``;

      if (d.hasOwnProperty('geometry')) {
      	// console.log('Hovering over map!!');
      	countryData = {
      		country: d.properties.country,
      		continent: d.properties.continent,
      		region: d.properties.region,
      		...d.properties.data.filter(d => +d.year === +year)[0]
      	};
      	// console.log(d.properties.data, year);
      	// console.log(d.properties.data.filter(d => d.year === year));
      	html = `
             <p>Country: ${countryData.country}</p>
             <p>Continent: ${countryData.continent}</p>
             <p>Region: ${countryData.region}</p>
             <p>Emissions: ${countryData.emissions}</p>
             <p>Emissions Per Capita: ${countryData.emissionsPerCapita}</p>
         `;
      } else if (d.hasOwnProperty('startAngle')) {
      	countryData = {
      		country: d.data.country,
      		continent: d.data.continent,
      		region: d.data.region,
      		emissionsPerCapita: d.data.emissionsPerCapita,
      		emissions: d.data.emissions
      	};
      	html = `
             <p>Country: ${countryData.country}</p>
             <p>Continent: ${countryData.continent}</p>
             <p>Region: ${countryData.region}</p>
             <p>Emissions: ${countryData.emissions}</p>
             <p>Emissions Per Capita: ${countryData.emissionsPerCapita}</p>
         `;
      } else if (d.hasOwnProperty('emissions')) {
      	countryData = d;
      	html = `
             <p>Emissions: ${countryData.emissions}</p>
             <p>Emissions Per Capita: ${countryData.emissionsPerCapita}</p>
         `;
      }

      

      // console.log(`${year}: ${countryData}`, countryData);


      tooltip
          .style('opacity', 1)
          .style('left', ( d3.event.pageX - tooltip.node().offsetWidth / 2 ) + 'px' )
          .style('top', ( d3.event.pageY - tooltip.node().offsetHeight - 10 ) + 'px')
          .html(html)
    }

    function hideTooltip(d) {
      d3.select('#tooltip')
          .style('opacity', 0);
    }


	});














