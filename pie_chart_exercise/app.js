var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year);
var width = 600;
var height = 600;

var months = Array.from(new Set(birthData.map(d => d.month)));

var monthColorScale = d3.scaleOrdinal()
						.domain(months)
						.range(d3.schemeCategory20);

d3.select('svg')
	.attr('width', width)
	.attr('height', height)
 .append('g')
	.attr('transform', `translate(${width/2}, ${height/2})`)
	.classed('chart', true);

d3.select('input')
	.property('min', minYear)
	.property('max', maxYear)
	.property('value', minYear)
	.on('input', function() {
		makeMonthGraph(+d3.event.target.value);
	});

makeMonthGraph(minYear);

function makeMonthGraph(year) {
	var yearData = birthData.filter(d => d.year === year);
	
	
	var arcs = d3.pie()
				.value(d => d.births)
				.sort((a, b) => {
					if (months.indexOf(a.month) < months.indexOf(b.month)) return -1;
					else return 1;
				})
				(yearData);
	
	var path = d3.arc()
				.outerRadius((width / 2) - 10)
				.innerRadius(width / 4);
	
	var update = d3.select('.chart')
					.selectAll('.arc')
					.data(arcs);
	
	update
		.exit()
		.remove();
	
	update
		.enter()
		.append('path')
			.classed('arc', true)
		.merge(update)
			.attr('fill', d => monthColorScale(d.data.month))
			.attr('stroke', 'black')
			.attr('d', path);
}