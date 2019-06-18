var typing = false;

d3.select("#new-note")
    .on('submit', function() {
      d3.event.preventDefault();
      const input = d3.select('input');
      const typingNote = d3.select('.typing');
      typingNote
          .classed('note', true)
          .classed('typing', false)
          .text(input.property('value'));
      input.property('value', '');
      typing = false;
    });

d3.select('#new-note input')
    .on('input', function() {
//      console.log(d3.event.target.value);
      if(!typing) {
        d3.select("#notes")
          .append('p')
            .classed('note', true)
            .classed('typing', true)
            .text(d3.event.target.value); 
        typing = true;
      } else {
        d3.select(".typing").text(d3.event.target.value);
      }
      
    });
    