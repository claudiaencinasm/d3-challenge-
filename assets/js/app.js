// @TODO: YOUR CODE HERE!
// Set up our chart size
var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 50,
  bottom: 60,
  left: 50,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  //append an SVG group 
var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from file
d3.csv("/assets/data/data.csv").then(function(stateData) {

// Format the data
    stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    data.healthcare = +data.healthcare;
});

// Create scaling functions   
    var xLinearScale = d3.scaleLinear()
        .domain([8.1, d3.max(stateData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([2, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

// Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);  

// Append axis to the chart group
    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chart.append("g")
        .call(leftAxis);

//Append circles
    var circlesGroup = chart.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("opacity", ".5")
        .attr("stroke", "white");    

//Append text circles
        chart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .selectAll("tspan")
        .data(stateData)
        .enter()
        .append("tspan")
        .attr("x", function(data) {
            return xLinearScale(data.poverty);
        })
        .attr("y", function(data) {
            return yLinearScale(data.healthcare -.02);
        })
        .text(function(data) {
            return data.abbr
        });

// Initalize Tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
    });   

// tooltip in the chart
    chart.call(toolTip);   
    
// Add an onmouseover event to display a tooltip   
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })

    // Add an on mouseout    
    .on("mouseout", function(data) {
        toolTip.hide(data);
    });

    // Create axes labels  
    chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obese (%)");

  chart.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");

    
});

