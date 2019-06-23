var minYear = d3.min(birthData, d => d.year);
var maxYear = d3.max(birthData, d => d.year);
var width = 600;
var height = 600;

var months = Array.from(new Set(birthData.map(d => d.month)));

var monthColorScale = d3.scaleOrdinal()
						.domain(months)
						.range(d3.schemeCategory20);

var quarters = ['First', 'Second', 'Third', 'Fourth'];
var quarterColorScale = d3.scaleOrdinal()
							.domain(quarters)
							.range(d3.schemeCategory10);

var monthToQuarter = {
	'January': 'First',
	'February': 'First',
	'March': 'First',
	'April': 'Second',
	'May': 'Second',
	'June': 'Second',
	'July': 'Third',
	'August': 'Third',
	'September': 'Third',
	'October': 'Fourth',
	'November': 'Fourth',
	'December': 'Fourth',
};

d3.select('svg')
	.attr('width', width)
	.attr('height', height)
 .append('g')
	.attr('transform', `translate(${width/2}, ${height/2})`)
	.classed('chart', true)
	.classed('outerPie', true);

d3.select('svg')
	.attr('width', width)
	.attr('height', height)
 .append('g')
	.attr('transform', `translate(${width/2}, ${height/2})`)
	.classed('chart', true)
	.classed('innerPie', true);

d3.select('input')
	.property('min', minYear)
	.property('max', maxYear)
	.property('value', minYear)
	.on('input', function() {
		makeMonthGraph(+d3.event.target.value);
		makeQuarterGraph(+d3.event.target.value);
	});

makeMonthGraph(minYear);
makeQuarterGraph(minYear);

function makeMonthGraph(year) {
	var yearData = birthData.filter(d => d.year === year);
	
	console.log(yearData);
	
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
	
	var update = d3.select('.outerPie')
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

function makeQuarterGraph(year) {
	var yearData = birthData.filter(d => d.year === year);
	
	console.log(yearData);
	
	var quarterData = [
		{
			quarter: 'First',
			births: 0
		}, 
		{
			quarter: 'Second',
			births: 0
		}, 
		{
			quarter: 'Third',
			births: 0
		}, 
		{
			quarter: 'Fourth',
			births: 0
		}
	];
	
	yearData.forEach(d => {
		if(monthToQuarter[d.month] === 'First') {
			quarterData[0]['births'] += d.births;
		} else if(monthToQuarter[d.month] === 'Second') {
			quarterData[1]['births'] += d.births;
		} else if(monthToQuarter[d.month] === 'Third') {
			quarterData[2]['births'] += d.births;
		} else if(monthToQuarter[d.month] === 'Fourth') {
			quarterData[3]['births'] += d.births;
		} 
	});
	
	console.log(quarterData);
	
	var arcs = d3.pie()
				.value(d => d.births)
				.sort((a, b) => {
					if (quarters.indexOf(a.quarter) < quarters.indexOf(b.quarter)) return -1;
					else return 1;
				})
				(quarterData);
	
	console.log(arcs);
	
	var path = d3.arc()
				.outerRadius((width / 4) - 10)
				.innerRadius(0);
	
	var update = d3.select('.innerPie')
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
			.attr('fill', d => quarterColorScale(d.data.quarter))
			.attr('stroke', 'black')
			.attr('d', path);
}