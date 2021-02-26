const d3 = require('d3');
const dscc = require('@google/dscc');
const local = require('./localMessage.js');


// change this to 'true' for local development
// change this to 'false' before deploying
export const LOCAL = false;


// parse the style value
const styleVal = (message, styleId) => {
    if (typeof message.style[styleId].defaultValue === "object") {

      return message.style[styleId].value.color !== undefined
        ? message.style[styleId].value.color
        : message.style[styleId].defaultValue.color;
    }
    return message.style[styleId].value !== undefined
      ? message.style[styleId].value
      : message.style[styleId].defaultValue;
};
  

const drawViz = message => {
  
 // set the dimensions and margins of the graph
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

        var tblList = message.tables.DEFAULT;

        var data = tblList.map(row => {
        
                    
            return {
               
                x: row["dimension"][0],   
                y: row["dimension"][1],   
                group: row["dimension"][2],   
               
            }  
        });
  

  // Add X axis
  var x = d3.scaleLinear()
  .domain([5, 20])
  .range([ 0, width ]);
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
  .domain([5, 22])
  .range([ height, 0 ]);
  svg.append("g")
  .call(d3.axisLeft(y));

  // compute the density data
  var densityData = d3.contourDensity()
  .x(function(d) { return x(d.x); })   // x and y = column name in .csv input data
  .y(function(d) { return y(d.y); })
  .size([width, height])
  .bandwidth(20)    // smaller = more precision in lines = more lines
  (data)
        console.log(densityData);
  // Add the contour: several "path"
  svg
  .selectAll("path")
  .data(densityData)
  .enter()
  .append("path")
    .attr("d", d3.geoPath())
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-linejoin", "round")


};
// renders locally
if (LOCAL) {
  drawViz(local.message);
} else {
  dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});
}