// @TODO: YOUR CODE HERE!


let svgWidth = 960;
let svgHeight = 500;

let margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

let svg = d3
.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

let chartGroup = svg.append("g")
.attr("transform",`translate(${margin.left},${margin.top})`);

//Initial params

let chosenXAxis = "poverty";

// this function updates the x scale when axis label is clicked
function xScale(healthData, chosenXAxis) {

    let xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * .8,
    d3.max(healthData, d => d[chosenXAxis]) *1.2])
    .range([0, width]);
    return xLinearScale;
}

//this function will update the xaxis when the label is clicked
function renderAxes(newXScale, xAxis){
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

  d3.csv("assets/data/data.csv").then(function (healthData, err) {

    if (err) throw err;

    //parse the data
    healthData.forEach(function(data){
        //turn strings to int
        data.poverty = +data.poverty;
        // data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        // data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        // data.incomeMoe = +data.incomeMoe;
        // data.healthcare = +data.healthcare;
        // data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        // data.obesity = +data.obesity;
        // data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        // data.smokes = +data.smokes;
        // data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;

    });

    
});

