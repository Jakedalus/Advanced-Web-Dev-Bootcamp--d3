d3.select('form')
  .on('submit', function() {
    d3.event.preventDefault();
    const inputField = d3.select('input');
    const input = inputField.property('value');
    console.log("Submitting...");
    console.log(input);
    const data = analyzeInput(input);
    console.log(data);
    
    d3.select('#letters')
      .style('list-style', 'none')
    .selectAll('span')
    .data(data)
    .enter()
    .append('span')
      .text(d => `${d.char}` )
    .classed('letter', true)
    .style('height', d => ((d.count / input.length) * 400) + 'px')  
  });

function analyzeInput(str) {
  const freq = {};
//  str = str.replace(/\s/g, '');
  const arr = str.split("");
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