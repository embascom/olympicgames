var margin = {top: 10, right: 30, bottom: 50, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#main")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("style", 'border: 1px solid #777')
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// read in data

function dataPreprocessor(row) {
    return {
        "ID": +row.ID,
        "Name": row.Name,
        "Sex": row.Sex,
        "Age": +row.Sex,
        "Height": +row.Height,
        "Weight": +row.Weight,
        "Team": row.Team,
        "NOC": row.NOC,
        "Games": row.Games,
        "Year": row.Year,
        "Season": row.Season,
        "City": row.City,
        "Sport": row.Sport,
        "Event": row.Event,
        "Medal":row.Medal
    };
}

rangeFilter = function(x1, x2) {

    d3.csv('athlete_events_test.csv', dataPreprocessor).then(function(dataset) {

    var newDS = dataset.filter(function(d) {
        return d.Year >= x1 && d.Year <= x2;
    });

    //console.log(newDS);
 
    updatePlot(newDS);

    })

 }

//slider
slider = function(min, max, name) {
    var range = [min, max]

    var w = 400
    var h = 300
    var margin = {top: 130,
                  bottom: 135,
                  left: 40,
                  right: 40}
  
    // dimensions of slider bar
    var width = w - margin.left - margin.right;
    var height = h - margin.top - margin.bottom;
    var padding = {t: 60, r: 40, b: 30, l: 40};
    var x = d3.scaleLinear()
    .domain(range)  
    .range([0, width]);

    // create svg and translated g
    var svg2 = d3.select('#slider')
    .attr('width', w)
    .attr('height', h)
    

    const g = svg2.append('g').attr('transform', `translate(${padding.l}, ${padding.t})`)

    var labelL = g.append('text')
    .attr('id', 'labelleft')
    .attr('x', 0)
    .attr('y', height + 15)

    var labelR = g.append('text')
        .attr('id', 'labelright')
        .attr('x', 0)
        .attr('y', height + 15)

        // define brush
    var brush = d3.brushX()
    .extent([[0,0], [width, height]])
    .on('brush', function() {
        var s = d3.event.selection;
        rangeFilter((x.invert(s[0]).toFixed(2)), x.invert(s[1]).toFixed(2));
        // update and move labels
        labelL.attr('x', s[0])
        .text((x.invert(s[0]).toFixed(2)))
        labelR.attr('x', s[1])
        .text((x.invert(s[1]).toFixed(2)))
        // move brush handles      
        handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + [ s[i], - height / 4] + ")"; });
        // update view
        // if the view should only be updated after brushing is over, 
        // move these two lines into the on('end') part below
        svg.node().value = s.map(function(d) {var temp = x.invert(d); return +temp.toFixed(2)});
        svg.node().dispatchEvent(new CustomEvent("input"));
    })

    // append brush to g
    var gBrush = g.append("g")
        .attr("class", "brush")
        .call(brush)

    // add brush handles (from https://bl.ocks.org/Fil/2d43867ba1f36a05459c7113c7f6f98a)
    var brushResizePath = function(d) {
        
        var e = +(d.type == "e"),
            x = e ? 1 : -1,
            y = height / 2;
        return "M" + (.5 * x) + "," + y + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6) + "V" + (2 * y - 6) +
        "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y) + "Z" + "M" + (2.5 * x) + "," + (y + 8) + "V" + (2 * y - 8) +
        "M" + (4.5 * x) + "," + (y + 8) + "V" + (2 * y - 8);
    }

    var handle = gBrush.selectAll(".handle--custom")
    .data([{type: "w"}, {type: "e"}])
    .enter().append("path")
    .attr("class", "handle--custom")
    .attr("stroke", "#000")
    .attr("fill", '#eee')
    .attr("cursor", "ew-resize")
    .attr("d", brushResizePath);
    
    // override default behaviour - clicking outside of the selected area 
    // will select a small piece there rather than deselecting everything
    // https://bl.ocks.org/mbostock/6498000
    gBrush.selectAll(".overlay")
    .each(function(d) { d.type = "selection"; })
    .on("mousedown touchstart", brushcentered)

    function brushcentered() {
        var dx = x(1) - x(0), // Use a fixed width when recentering.
        cx = d3.mouse(this)[0],
        x0 = cx - dx / 2,
        x1 = cx + dx / 2;
        
        d3.select(this.parentNode).call(brush.move, x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]);
        }

    // select entire range
    gBrush.call(brush.move, range.map(x))
        
    return svg.node()
   
}


var data;
var x;
var y;
d3.csv('athlete_events_test.csv', dataPreprocessor).then(function(dataset) {

    data = dataset

    
   // Add X axis
    x = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d.Weight; })])
    .range([ 0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // Add Y axis
    y = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d.Height; })])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2 )
    .attr("y", height + 40)
    .text("Weight (kg)");

   // add y axis label (height in cm)
    slider(d3.min(dataset, function(d) { return d.Year; }),
         d3.max(dataset, function(d) { return d.Year; }));

    updatePlot(dataset);    
})



function updatePlot(dataset) {
    var circles = svg.selectAll('circle')
    .data(dataset, function(d) {
        return d;
    })

    var circleEnter = circles.enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.Weight); } )
        .attr("cy", function (d) { return y(d.Height); } )
        .attr("r", 3)
        .style("fill", "#69b3a2")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
 
    
    circles.exit().remove(); 
}



