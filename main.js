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


// div for hover feature
var div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

function dataPreprocessor(row) {
    return {
        "ID": +row.ID,
        "Name": row.Name,
        "Sex": row.Sex,
        "Height": +row.Height,
        "Weight": +row.Weight,
        "Team": row.Team,
        "Year": row.Year,
        "Sport": row.Sport
    };
}

//used for updating scatter plot with year brush
rangeFilter = function(x1, x2) {

    d3.csv('athlete_events_2010_2016.csv', dataPreprocessor).then(function(dataset) {

    var newDS = dataset.filter(function(d) {
        return d.Year >= x1 && d.Year <= x2;
    });
 
    updatePlot(newDS);

    })

 }

 filterCountry = function(selectedOption) {

    d3.csv('athlete_events_2010_2016.csv', dataPreprocessor).then(function(dataset) {

        var newDS = dataset.filter(function(d) {
            return d.Team == selectedOption;
        });

        if (selectedOption == 'All') {
            newDS = dataset;
        }
     
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

    var title = g.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .text('Select Year Range: ')

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
//set up plot
d3.csv('athlete_events_2010_2016.csv', dataPreprocessor).then(function(dataset) {

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

    d3.select('svg').append('text')
    .text('Height (cm)')
    .attr('class', 'axis-label')
    .attr('transform', 'translate('+[20, height / 3 * 2]+')rotate(270)');


    svg.append("g")
    .call(d3.axisLeft(y))
    
   

    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2 )
    .attr("y", height + 40)
    .text("Weight (kg)");

    
    var allGroup = d3.map(dataset, function(d){return(d.Team)}).values()

    
    // add the options to the button
    var dropdown = d3.select("#dropdown")
  
    dropdown.selectAll('select')
    .data(allGroup)
    .enter()
    .append('option')
    .text(function (d) { return d.Team; }) // text showed in the menu
    .attr("value", function (d) { return d.Team; }) // corresponding value returned by the button
   // add y axis label (height in cm)
  

    slider(d3.min(dataset, function(d) { return d.Year; }),
         d3.max(dataset, function(d) { return d.Year; }));


    // full dataset for starting point 
    updatePlot(dataset);    
})

filterGender = function(value) {

    d3.csv('athlete_events_2010_2016.csv', dataPreprocessor).then(function(dataset) {

        //console.log(value)
        var newDS;
        if (value == 'both') {
            newDS = dataset
        } else {
            var letter;
            if (value == 'male') {
                letter = 'M'
            } else if (value == 'female') {
                letter = 'F'
            } 

            newDS = dataset.filter(function(d) {
                return d.Sex == letter;
            });
        }
     
        updatePlot(newDS);
    
        })

}

var radio = d3.selectAll('input');

radio.on('change', function(d) {
    filterGender(this.value);
})

// When the button is changed, run the updateChart function
d3.select("#dropdown").on("change", function(d) {
    filterCountry(this.value)
    //.updatePlot(selectedOption)
})

//**USE THIS FUNCTION WHEN CONNECTING OTHER FILTERS**
// param: filtered dataset
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
          "translate(" + margin.left + "," + margin.top + ")")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                    .duration('30')
                    .attr("r", 5);
            //Makes div appear
            div.transition()
                .duration(100)
                .style("opacity", 1);

             // display text on hover   
             div.html(d.Name)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");;

       }).on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('30')
                .attr("r", 3);

            //makes div disappear
            div.transition()
                .duration('30')
                .style("opacity", 0);       
   });
 
    circles.exit().remove(); 
}



