var width = 500;
var height = 500;
var padding = 50;

var data = regionData.filter(mustHaveKeys);

function mustHaveKeys(obj) {
  var keys = [
    'subscribersPer100',
    'adultLiteracyRate',
    'urbanPopulationRate',
    'medianAge'
  ];
  
  for (var i = 0; i < keys.length; i++) {
    if (obj[keys] === null) return false;
  }
  
  return true;
}

//cellular sub rate
var yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.subscribersPer100))
        .range([height - padding, padding]);

//literacy rate
var xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.adultLiteracyRate))
        .range([padding, width - padding]);

var xAxis = d3.axisBottom(xScale)
        .tickSize(-height + (2 * padding))
        .tickSizeOuter(0);

var yAxis = d3.axisLeft(yScale)
        .tickSize(-width + (2 * padding))
        .tickSizeOuter(0);  

//extremePovertyRate
var colorScale = d3.scaleLinear()
          .domain(d3.extent(data, d => d.urbanPopulationRate))
          .range(['lightgreen', 'darkblue']);

//urbanPopulationRate
var radiusScale = d3.scaleLinear()
          .domain(d3.extent(data, d => d.medianAge))
          .range([5, 30]);

var svg = d3.select('svg')
      .attr('width', width)
      .attr('height', height);



svg
 .selectAll('circle')
 .data(regionData)
 .enter()
 .append('circle')
  .attr('cx', d => xScale(d.adultLiteracyRate))
  .attr('cy', d => yScale(d.subscribersPer100))
  .attr('r', d => radiusScale(d.medianAge))
  .attr('fill', d => colorScale(d.urbanPopulationRate))
  .attr('stroke', '#fff');

svg
  .append('g')
  .attr('transform', `translate(0, ${height - padding})`)
  .call(xAxis);

svg
  .append('g')
  .attr('transform', `translate(${padding}, 0)`)
  .call(yAxis);

//x-axis label
svg
  .append('text')
    .attr('x', width / 2)
    .attr('y', height - padding)
    .attr('dy', '1.5em')
    .style('text-anchor', 'middle')
    .text('Cellular Subscribers Per 100');

//title
svg
  .append('text')
    .attr('x', width / 2)
    .attr('y', padding)
    .style('text-anchor', 'middle')
    .style('font-size', '1.1em')
    .text('Cellular Subscribes vs. Adult Literacy Rate by Country');

//y-axis label
svg
  .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', padding)
    .attr('dy', '-1.1em')
    .style('text-anchor', 'middle')
    .text('Adult Literacy Rate, Aged 15 and Up');





