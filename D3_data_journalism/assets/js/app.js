// @TODO: YOUR CODE HERE!


let svgWidth = 800;
let svgHeight = 600;

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
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Initial params

let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";

// this function updates the x scale when axis label is clicked
function xScale(healthData, chosenXAxis) {

    let xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * .8,
            d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}

//this function will update the xaxis when the label is clicked
function renderXAxis(newXScale, xAxis) {
    let bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// this function updates the y scale when axis label is clicked.

function yScale(healthData, chosenYAxis) {

    let yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * .3,
            d3.max(healthData, d => d[chosenYAxis]) * 2
        ])
        .range([height, 0]);
    return yLinearScale;
}

function renderYAxis(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", dx => newXScale(dx[chosenXAxis]))
        .attr("cy", dy => newYScale(dy[chosenYAxis]));
    return circlesGroup;
}

d3.csv("assets/data/data.csv").then(function(healthData, err) {

    if (err) throw err;

    //parse the data
    healthData.forEach(function(data) {
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

    let xLinearScale = xScale(healthData, chosenXAxis);

    let yLinearScale = yScale(healthData, chosenYAxis);
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // append x axis

    let xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis

    let yAxis = chartGroup.append("g")
        .call(leftAxis);


    //append initial circles

    let circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", dx => xLinearScale(dx[chosenXAxis]))
        .attr("cy", dy => yLinearScale(dy[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("opacity", ".5");

    // create group for 3 xaxis labels
    let labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width /2},${height + 20})`);

    let povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

    let ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .attr("inactive", true)
        .text("Age (Median)");

    let incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .attr("inactive", true)
        .text("Household Income (Median");

    // create group for 3 yaxis labels
    let healthcareLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .classed("active", true)
        .text("Lacks Healthcare (%)");

    let smokesLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90")
        .attr("y", 0 - margin.left)
        .attr("x", -20 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .classed("inactive", true)
        .text("Smokes (%)");

    let obeseLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90")
        .attr("y", 0 - margin.left)
        .attr("x", -40 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obese")
        .classed("inactive", true)
        .text("Obese (%)");

    // x axis event listener

    labelsGroup.selectAll("text")
        .on("click", function() {
            // get value of selection
            let value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {

                chosenXAxis = value;

                xLinearScale = xScale(healthData, chosenXAxis);

                xAxis = renderXAxis(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "age") {
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                } else if (chosenXAxis === "income") {
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
            }
        })

})