d3.csv('./data/all_data.csv', function(error, data) {
	if (error) throw error;

	console.log(data);


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