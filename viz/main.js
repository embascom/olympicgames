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

d3.csv('athlete_events_test.csv', dataPreprocessor).then(function(dataset) {
   // Add X axis
    var x = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d.Weight; })])
    .range([ 0, width]);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d.Height; })])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(dataset)
    .enter()
    .append("circle")
        .attr("cx", function (d) { return x(d.Weight); } )
        .attr("cy", function (d) { return y(d.Height); } )
        .attr("r", 1.5)
        .style("fill", "#69b3a2")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2 )
    .attr("y", height + 40)
    .text("Weight (kg)");

   // add y axis label (height in cm)

})



