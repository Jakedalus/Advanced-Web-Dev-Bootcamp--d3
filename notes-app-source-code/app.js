var typing = false;

d3.select("form")
    .on('submit', function() {
      d3.event.preventDefault();
      const input = d3.select('input');
      const previewNote = d3.select('.preview');
      previewNote
          .classed('note', true)
          .classed('preview', false)
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
            .classed('preview', true)
            .text(d3.event.target.value); 
        typing = true;
      } else {
        d3.select(".preview").text(d3.event.target.value);
      }
      if(d3.select(".preview").text() === '') {
        typing = false;
        d3.select(".preview").remove();
      }
      
    });
    

d3.select('#remove-btn')
    .on('click', function() {
      d3.selectAll('.note').remove();
    });

d3.select('#lucky-btn')
    .on('click', function() {
      console.log(d3.selectAll('.note'));
      console.log(d3.selectAll('.note').nodes());
      d3.selectAll('.note').nodes().forEach(note => {
        console.log(note);    
        console.log(d3.select(note));    
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        const randomFontSize = Math.floor(Math.random()*50);
        console.log(randomColor);
        console.log(d3.select(note).style('background-color'));
        console.log(d3.select(note).style('font-size'));
        d3.select(note).style('background-color', randomColor + ' !important');
        d3.select(note).style('font-size', randomFontSize + ' !important');
      });
    });








