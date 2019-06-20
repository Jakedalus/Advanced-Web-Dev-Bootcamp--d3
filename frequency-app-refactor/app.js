var width = 800;
var height = 200;
var barPadding = 10;

d3.select('#reset')
  .on('click', function() {
    d3.selectAll(".letter")
      .remove();
  
    d3.select('#phrase')
      .text(``);
  
    d3.select('#count')
      .text(``);
});

d3.select('form')
  .on('submit', function() {
    d3.event.preventDefault();
    const inputField = d3.select('input');
    const input = inputField.property('value');
    console.log("Submitting...");
    console.log(input);
    const data = analyzeInput(input);
    console.log(data);
  
    var numBars = data.length;
    
    var barWidth = (width / numBars) - barPadding;
    console.log(numBars, barWidth);
    
    const letters = d3.select('#letters')
              .attr('width', width)
              .attr('height', height)
              .selectAll('.letter')
              .data(data, d => d.char);
    letters
      .classed('new', false)
      .exit()
      .remove();
  
    var lettersEnter = letters
      .enter()
      .append('g')
//        .text(d => `${d.char}` )
        .classed('letter', true)
        .classed('new', true);
  
    lettersEnter.append('rect');
    lettersEnter.append('text');
  
    
    lettersEnter.merge(letters)
      .select('rect')
        .attr('width', barWidth)
        .attr('height', d => d.count * 20)
        .attr('y', d => height - (d.count * 20) )
        .attr('x', (d,i) => (barWidth + barPadding) * i);
  
    lettersEnter.merge(letters)
      .select('text')
        .attr('y', d => height - (d.count * 20) - 10 )
        .attr('x', (d,i) => (barWidth + barPadding) * i + barWidth / 2)
        .attr('text-anchor', 'middle')
        .text(d => d.char);
  
    d3.select('#phrase')
      .text(`Analysis of ${input}`);
  
    d3.select('#count')
      .text(`New characters: ${letters.enter().nodes().length}`);
  
    inputField.property('value', '');
  });

function analyzeInput(str) {
  const freq = {};
//  str = str.replace(/\s/g, '');
  const arr = str.split("").sort();
  console.log(arr);
  for (c of arr) {
    if (freq.hasOwnProperty(c)) {
      freq[c]++;
    } else {
      freq[c] = 1;
    }
  }
  const data = [];
  for (o in freq) {
    data.push({
      char: o,
      count: freq[o]
    });
  }
  return data;
}