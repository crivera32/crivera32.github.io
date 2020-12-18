class Cluster {
  constructor(svgid, offsetX, offsetY, svgWidth, svgHeight, colorScale, cloudScale, data, selectFn=null) {

    var borderWidth = 0.2;
    var borderColor = 'black';
    var dotSize = 1;

    var clusterMargin = 20;

    var x = d3.scaleLinear().range([svgWidth-clusterMargin, clusterMargin]);
    var y = d3.scaleLinear().range([clusterMargin, svgHeight-20]);
    
    x.domain(d3.extent(data, function(d) { return (d.tsne[0]); }));
    y.domain(d3.extent(data, function(d) { return (d.tsne[1]); }));

    //=======================//
    // Set up the SVG canvas //
    //=======================//

    // Create the SVG canvas
    var svg = d3.select("body").append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("id", `ClusterSVG${svgid}`);

    // Reposition  
    $(`#ClusterSVG${svgid}`).css({
      top: offsetY,
      left: offsetX,
      position:'absolute'
    });

    // Border
    svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .style("stroke", borderColor)
      .style("stroke-width", borderWidth)
      .style("fill", 'none');

    var selectedGeneName = "";

    this._updateView = function(selectedGene) {
      //==================//
      // Draw the cluster //
      //==================//

      selectedGeneName = selectedGene;
      circles.style('fill', function(d) { return colorScale(d[selectedGeneName]); } );

    }

    // When no gene is selected, all dots show black
   var circles = svg.selectAll("dot")
    .data(data)
    .enter().append("circle")
    .attr("class","dot")
    .attr("r", dotSize)
    .attr("cx", function(d) { return x(d.tsne[0]); })
    .attr("cy", function(d) { return y(d.tsne[1]); })
    .style('fill', 'black');
    //this._updateView("Sftpc");

    function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    function highlight() {

      if (d3.event.selection != null) {

          // revert circles to initial style
          circles.attr("class", "dot");
          circles.style('fill', function(d) { return colorScale(d[selectedGeneName]); } );

          var brush_coords = d3.brushSelection(this);

          // style brushed circles
          circles.filter(function (){

                     var cx = d3.select(this).attr("cx"),
                         cy = d3.select(this).attr("cy");

                     return isBrushed(brush_coords, cx, cy);
                 })
                 .attr("class", `dot brushed${svgid}`)
                 .style("fill","#f03b20");
            
            
        }
        var cloud = document.getElementById("cloud");
        cloud.querySelectorAll('*').forEach(n => n.remove());

        var triangle = document.getElementById("demo");
        triangle.querySelectorAll('*').forEach(n => n.remove());
        
    } 

    function selected(){

      if (!d3.event.selection) return;

      d3.select(this).call(brush.move, null);
      var brushed =  d3.selectAll(`.brushed${svgid}`).data();

      var cloudData = {}

      for(var i  = 1; i< brushed.length;i++){
        var keys = Object.keys(brushed[i])
        for(var j = 1; j<keys.length;j++){
          if(cloudData.hasOwnProperty(keys[j])){
            cloudData[keys[j]] += brushed[i][keys[j]]
          }
          else{
            cloudData[keys[j]] = brushed[i][keys[j]];
          }
        }

      }
      delete cloudData["geneExpressionArray"];
      delete cloudData["tsne"];
      // console.log(cloudData);


      var meanExpressionSelected = d3.mean(brushed,function(d){ return d[selectedGeneName]; });
      var deviationSelected = d3.deviation(brushed, function(d) {return d[selectedGeneName]; });

      var meanPopulation = d3.mean(data,function(d){ return d[selectedGeneName]; });
      var deviationPopulation = d3.deviation(data, function(d){ return d[selectedGeneName]; });

      var deviationcircle = d3.select(".demo")
                              .append("svg")
                              .attr("width", (windowWidth-viewportMargin)/2 +"px")
                              .attr("height", viewportHeight+"px")
       
      if (brushed.length > 0) {

        // ////selected population mean and deviation
        // deviationcircle.append("circle")
        //                 .attr("r", (meanExpressionSelected) * 20)
        //                 .attr("cx", 60 + "px")
        //                 .attr("cy", 60 + "px")
        //                 .attr("fill", "black")

        // deviationcircle.append("circle")
        //                   .attr("r", (deviationSelected) * 20)
        //                   .attr("cx", 60 + "px")
        //                   .attr("cy", 60 + "px")
        //                   .attr("fill", "red")
          
        // deviationcircle.append("circle")
        //                   .attr("r", 10+"px")
        //                   .attr("cx", 60 + "px")
        //                   .attr("cy", 60 + "px")
        //                   .attr("fill", "white")

        //   //// complete population mean and deviation
        //   deviationcircle.append("circle")
        //                   .attr("r", (meanPopulation) * 20)
        //                   .attr("cx", 200 + "px")
        //                   .attr("cy", 60 + "px")
        //                   .attr("fill", "black")
  
        //     deviationcircle.append("circle")
        //                   .attr("r", (deviationPopulation) * 20)
        //                   .attr("cx", 200 + "px")
        //                   .attr("cy",60 + "px")
        //                   .attr("fill", "red")
            
        //     deviationcircle.append("circle")
        //                   .attr("r", 10+"px")
        //                   .attr("cx", 200 + "px")
        //                   .attr("cy", 60 + "px")
        //                   .attr("fill", "white")

// //selected population mean and deviation
var color = "black"
var triangleSize = 50

var triangle = d3.symbol()
            .type(d3.symbolTriangle)
            .size(triangleSize)

deviationcircle.append("path")
          .attr("d", triangle)
          .attr("stroke", color)
          .attr("fill", color)
          .attr("transform", function(d) { return "translate(" + svgWidth *2/3 + "," + svgHeight*2/3 + ")"; });

var color = "blue"
var triangleSizeExpression = (deviationSelected + meanExpressionSelected) * 10000 ;
// var triangleSizeExpression = (deviationSelected + meanExpressionSelected) * 2000;


var triangleExpression = d3.symbol()
          .type(d3.symbolTriangle)
          .size(triangleSizeExpression)


deviationcircle.append("path")
          .attr("d", triangleExpression)
          .attr("stroke", color)
          .attr("fill", color)
          .attr("opacity", "0.2")
          .attr("transform", function(d) { return "translate(" + svgWidth * 2/3 + "," + svgHeight *2/3 + ")"; })
          .on("mouseover", function(){
            d3.select(this).attr("opacity","1.0")
            tooltip.transition()
                        .delay(200)
                        .style("opacity","1.0")
                tooltip.html("<p>Selected Standard Deviation:" + round(deviationSelected,2) +"</p>")
                .style("left", (d3.event.pageX + 10) + "px")     
                .style("top", (d3.event.pageY - 28)+ "px");
          })
          .on("mouseout", function(){
            d3.select(this).attr("opacity","0.2")
            d3.select(".tooltip").style("opacity","0")
          })

  var color = "red"
  var triangleSizeExpression = (meanExpressionSelected ) * 10000;


  var triangleExpression = d3.symbol()
            .type(d3.symbolTriangle)
            .size(triangleSizeExpression)


  deviationcircle.append("path")
            .attr("d", triangleExpression)
            .attr("stroke", color)
            .attr("fill", color)
            .attr("opacity", "0.5")
            .attr("transform", function(d) { return "translate(" + svgWidth*2/3 + "," + svgHeight*2/3 + ")"; })
            .on("mouseover", function(){
              d3.select(this).attr("opacity","1.0")
              tooltip.transition()
                        .delay(200)
                        .style("opacity","1.0")
                tooltip.html("<p>Selected Mean:" + round(meanExpressionSelected,2) +"</p>")
                .style("left", (d3.event.pageX + 10) + "px")     
                .style("top", (d3.event.pageY - 28)+ "px");
            })
            .on("mouseout", function(){
              d3.select(this).attr("opacity","0.5")
              d3.select(".tooltip").style("opacity","0")
            })

//complete population mean and deviation
var color = "black"
var triangleSizeP = 50

var triangleP = d3.symbol()
            .type(d3.symbolTriangle)
            .size(triangleSizeP)

deviationcircle.append("path")
          .attr("d", triangleP)
          .attr("stroke", color)
          .attr("fill", color)
          .attr("transform", function(d) { return "translate(" + svgWidth*4/3  + "," + svgHeight*2/3  + ")"; });

var color = "blue"
var triangleSizeExpressionP = (deviationPopulation + meanPopulation ) * 10000 ;


var triangleExpressionP = d3.symbol()
          .type(d3.symbolTriangle)
          .size(triangleSizeExpressionP)


deviationcircle.append("path")
          .attr("d", triangleExpressionP)
          .attr("stroke", color)
          .attr("fill", color)
          .attr("opacity", "0.2")
          .attr("transform", function(d) { return "translate(" + svgWidth*4/3  + "," + svgHeight*2/3  + ")"; })
          .on("mouseover", function(){
            d3.select(this).attr("opacity","1.0")
            tooltip.transition()
                        .delay(200)
                        .style("opacity","1.0")
                tooltip.html("<p>Standard Deviation:" + round(deviationPopulation,2) +"</p>")
                .style("left", (d3.event.pageX + 10) + "px")     
                .style("top", (d3.event.pageY - 28)+ "px");
          })
          .on("mouseout", function(){
            d3.select(this).attr("opacity","0.2")
            d3.select(".tooltip").style("opacity","0")
          });

var color = "red"
var triangleSizeExpressionP = (meanPopulation) * 10000;


var triangleExpressionP = d3.symbol()
            .type(d3.symbolTriangle)
            .size(triangleSizeExpressionP)


deviationcircle.append("path")
            .attr("d", triangleExpressionP)
            .attr("stroke", color)
            .attr("fill", color)
            .attr("opacity", "0.5")
            .attr("transform", function(d) { return "translate(" + svgWidth*4/3 + "," + svgHeight*2/3 + ")"; })
            .on("mouseover", function(d){
              d3.select(this).attr("opacity","1.0");
              tooltip.transition()
                        .delay(200)
                        .style("opacity","1.0")
                tooltip.html("<p>Mean:" + round(meanPopulation,2) +"</p>")
                .style("left", (d3.event.pageX + 10) + "px")     
                .style("top", (d3.event.pageY - 28)+ "px");

            })
            .on("mouseout", function(){
              d3.select(this).attr("opacity","0.5");
              d3.select(".tooltip").style("opacity","0")
            })

//legend Mean

var color = "red"
var meanLegend = 150

var meanLegend = d3.symbol()
            .type(d3.symbolTriangle)
            .size(meanLegend)

deviationcircle.append("path")
  .attr("d", meanLegend)
  .attr("stroke", color)
  .attr("fill", color)
  .attr("opacity", "0.5")
  .attr("transform", function(d) { return "translate(" + 400 + "," + 100 + ")"; })

deviationcircle.append("g").append("text")
  .attr("x",420).attr("y",105).text("Mean").style("fill", "red")

//Legend Standard Deviation

var color = "blue"
var sdLegend = 200

var sdLegend = d3.symbol()
            .type(d3.symbolTriangle)
            .size(sdLegend)

deviationcircle.append("path")
  .attr("d", sdLegend)
  .attr("stroke", color)
  .attr("fill", color)
  .attr("opacity", "0.2")
  .attr("transform", function(d) { return "translate(" + 400 + "," + 125 + ")"; })

deviationcircle.append("g").append("text")
  .attr("x",420).attr("y",130).text("S. D.").style("fill", "blue")

//triangle label
deviationcircle.append("g").append("text")
  .attr("x",svgWidth*2/3 - 70).attr("y",svgHeight*2/3 + 50).text("Selected Population").style("fill", "black")

deviationcircle.append("g").append("text")
  .attr("x",svgWidth*4/3 - 70).attr("y",svgHeight*2/3 + 50).text("Complete Population").style("fill", "black")

//word cloud
var layout = d3.layout.cloud()
    .size([(windowWidth-viewportMargin)/2, viewportHeight])
    .words((Object.keys(cloudData)).map(function(d) {
      return {text: d, size: 100 * cloudData[d]};
    }))
    .padding(5)
    .rotate(function() { return 0; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw);

layout.start();

function draw(words) {
  d3.select(".cloud").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .attr("text-anchor", "middle")
      .style("fill",function(d){ return cloudScale(d.size) })
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
      
}
      selectFn(brushed, svgid);
        } else {
        //do something;
      }
      
      /*
      console.log(meanPopulation - deviationPopulation);
      console.log('population mean: ', meanPopulation*10);
      console.log('selection mean: ', meanExpressionSelected*10);
      */
      selectFn(brushed, svgid);
    }

    function isBrushed(brush_coords, cx, cy) {

      var x0 = brush_coords[0][0],
          x1 = brush_coords[1][0],
          y0 = brush_coords[0][1],
          y1 = brush_coords[1][1];

      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    var brush = d3.brush()
                  .on("brush", highlight)
                  .on("end", selected); 

    svg.append("g")
    .call(brush);

  }

  updateView(selectedGene) {
    this._updateView(selectedGene);
  }
}


