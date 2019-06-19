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
    
    const letters = d3.select('#letters')
              .selectAll('.letter')
              .data(data, d => d.char);
    letters
      .classed('new', false)
      .exit()
      .remove();
  
    letters
      .enter()
      .append('div')
        .text(d => `${d.char}` )
        .classed('letter', true)
        .classed('new', true)
      .merge(letters)
        .style('height', d => ((d.count / input.length) * 400) + 'px');
  
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