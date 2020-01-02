// @TODO: YOUR CODE HERE!
// Designate width and height of scatter plot
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;
  
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var circRadius;
  function crGet() {
    if (width <= 530) {
      circRadius = 5;
    }
    else {
      circRadius = 10;
    }
  }
  crGet();

// Import our CSV data with d3's .csv import method.
d3.csv("assets/data/data.csv").then(function(data) {
    // Visualize the data
    visualize(data);
  });

// Use visualize function of data with d3 
function visualize(theData) {
  //Each axis representing data 
  var curX = "poverty";
  var curY = "healthcare";

  //set up min and max values x and y, to save empty variables and avoid repetitions.
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  //Function to set up tooltip rules 
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([50, -70])
    .html(function(d) {

        var theX;
        //Obtain State name.
        var theState = "<div>"+ d.state + "</div>";
        // y value's key and value.
        var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
         //When x is poverty
         if (curX === "poverty") {
            //Showing the percentage of value X formatted
            theX = "<div>" + curX + ": " + d[curX] + "%</div>";
        }
        else {
            //
            theX = "<div>" + curX + ": " + parseFloat(d[curX]).toLocaleString("en") + "</div>";
        }
        //Display our return
        return theState + theX + theY;
    });
    // Call toolTip function.
  svg.call(toolTip);
    
    //Functions to avoid repetitions
    function xMinMax() {
      // min get smallest value from chosen column 
      xMin = d3.min(theData, function(d) {
        return parseFloat(d[curX]) * 0.95;
      });
      //max get largest value from chosen column
      xMax = d3.max(theData, function(d) {
        return parseFloat(d[curX]) * 1.15;
      }); 
    }
    //Function that change min and max for y
    function yMinMax() {
        yMin = d3.min(theData, function(d) {
            return parseFloat(d[curY]) * 0.95;
          });  

        yMax = d3.max(theData, function(d) {
            return parseFloat(d[curY]) * 1.15;
          });
        }  
        //Changing the classes/appearance of label text when clicked
  function labelChange(axis, clickedText) {
    // Switch from active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  } 

  // For sactter plot let get the min and max values of x and y.
  xMinMax();
  yMinMax();

  // create scales.Including margin  and word areas.
  // Place the circles in an area starting after the margin and word area.
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])

    // Placing height range
    .range([height - margin - labelArea, margin]);

  // Creating the axes
  
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Function tickCount to get x and y tick counts.
 
  function tickCount() {
    if (width <= 600) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  // Appending the axes in group elements to include borders and ticks.
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Now let's make a grouping for our dots and their labels.
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // Appending circles for each row of data (state)
  theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // rule hovering
    .on("mouseover", function(d) {
      // Tooltip
      toolTip.show(d, this);
      // Highlighting the border of state circle
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // grabbing the state abbreviations from our data/placing then in the center of dots
  theCircles
    .append("text")

    // Text abbreviation
    .text(function(d) {
      return d.abbr;
    })
    // Place text with scales
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {

      // We add a portion of radius to height when the size of the text is the radius and place it in the middle of circle.
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // rule hovering
    .on("mouseover", function(d) {
      // Show tooltip
      toolTip.show(d);
      // Highlight the border of state circle
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });
    
}

