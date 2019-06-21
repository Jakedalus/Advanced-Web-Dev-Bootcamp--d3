var width = 500;
var height = 500;
var padding = 30;

//cellular sub rate
var yScale = d3.scaleLinear()
        .domain(d3.extent(regionData, d => d.subscribersPer100))
        .range([height - padding, padding]);

//literacy rate
var xScale = d3.scaleLinear()
        .domain(d3.extent(regionData, d => d.adultLiteracyRate))
        .range([padding, width - padding]);

var xAxis = d3.axisBottom(xScale)
        .tickSize(-height + (2 * padding))
        .tickSizeOuter(0);

var yAxis = d3.axisLeft(yScale)
        .tickSize(-width + (2 * padding))
        .tickSizeOuter(0);  

//extremePovertyRate
var colorScale = d3.scaleLinear()
          .domain(d3.extent(regionData, d => d.extremePovertyRate))
          .range(['lightgreen', 'darkred']);

//urbanPopulationRate
var radiusScale = d3.scaleLinear()
          .domain(d3.extent(regionData, d => d.urbanPopulationRate))
          .range([2, 40]);

d3.select('svg')
  .append('g')
  .attr('transform', `translate(0, ${height - padding})`)
  .call(xAxis);

d3.select('svg')
  .append('g')
  .attr('transform', `translate(${padding}, 0)`)
  .call(yAxis);

d3.select('svg')
  .attr('width', width)
  .attr('height', height)
 .selectAll('circle')
 .data(regionData)
 .enter()
 .append('circle')
  .attr('cx', d => xScale(d.adultLiteracyRate))
  .attr('cy', d => yScale(d.subscribersPer100))
  .attr('fill', d => colorScale(d.extremePovertyRate))
  .attr('r', d => radiusScale(d.urbanPopulationRate));

//x-axis label
d3.select('svg')
  .append('text')
    .attr('x', width / 2)
    .attr('y', height - padding)
    .attr('dy', '1.5em')
    .style('text-anchor', 'middle')
    .text('Cell Phone Subscribers Per 100');

//title
d3.select('svg')
  .append('text')
    .attr('x', width / 2)
    .attr('y', padding)
    .style('text-anchor', 'middle')
    .style('font-size', '1.1em')
    .text('Data on Cell Phone Subscribes vs. Adult Literacy Rate by Country');

//y-axis label
d3.select('svg')
  .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', padding)
    .attr('dy', '-1.1em')
    .style('text-anchor', 'middle')
    .text('Adult Literacy Rate');





