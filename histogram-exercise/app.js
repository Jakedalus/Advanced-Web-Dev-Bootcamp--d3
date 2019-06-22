var width = 600;
var height = 600;
var barPadding = 1;
var padding = 20;

var extremePovertyRateData = regionData.map(d => d.extremePovertyRate).filter(d => d !== null);;

var minRate = d3.min(extremePovertyRateData);
var maxRate = d3.max(extremePovertyRateData);


var xScale = d3.scaleLinear()
        .domain([minRate, maxRate])
        .rangeRound([padding, width - padding]);;

var histogram = d3.histogram()
          .domain(xScale.domain())
          .thresholds(xScale.ticks());

var bins = histogram(extremePovertyRateData);

console.log(extremePovertyRateData, minRate, maxRate, bins);

var yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)]) 
        .range([height, 0]);

var bars = d3.select('svg')
        .attr('width', width)
        .attr('height', height)
      .selectAll('.bar')
      .data(bins)
      .enter()
      .append('g')
        .classed('bar', true);

console.log(bars);

bars  
  .append('rect')
    .attr('x', (d, i) => {
//      console.log(d, i);
      return xScale(d.x0)
    })
    .attr('y', d => yScale(d.length))
    .attr('height', d => height - yScale(d.length))
    .attr('width', d => xScale(d.x1) - xScale(d.x0) - barPadding)
    .attr('fill', '#9c27b0');

















