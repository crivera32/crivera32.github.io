//
// Author: Christian Rivera
// 
// TODO: rename this class to "Timeline"
//

class OtherPlot {
  constructor(svgid, offsetX, offsetY, svgWidth, svgHeight, colorScale, allData, minExp, maxExp) {
    
    function getGeneFromID(id) {
      return id.split(":")[1];
    }

    var tooltip = d3.select('body')
              .append('div')
              .style('position', 'absolute')
              .style('padding', '0 10px')
              .style('background', 'white')
              .style('opacity', 0);


    var margin = 20;
    var maxRadius = 30;

    var legendSize = 200;

    var uniqueCells = d3.map(allData[0], function(d){return d.cell;}).keys();
    //var uniqueGenes = d3.map(data, function(d){return d.gene;}).keys();
    //var maxExpression = d3.max(data, function(d){return d.expression});


    //console.log('max exp:',maxExpression);

    //console.log('uniqueCells:', uniqueCells)
    //console.log('uniqueGenes:', uniqueGenes)

    //this.data = data;

    var borderWidth = 0.2;
    var borderColor = 'black';

    var cellSet = [];
    for (var i = 0; i < allData.length; i++) {
      cellSet.push([]);
    }
    var geneSet = [];//['Acta2', 'Saa3', 'Sftpa1', 'Ccl5'];

    //for (var i = 0; i < 10; i++) {
    //  cellSet.push(uniqueCells[i]);
    //}

    this._setCells = function(listOfCells, idx) {
      cellSet[idx] = listOfCells;
      this.updatePlot();
    }

    this._setGenes = function (listOfGenes) {
      geneSet = listOfGenes;
      this.updatePlot();
    }
    
    
    /*
    var colorScale = d3.scaleLinear()
        .domain([d3.min(data, function(d){return d.expression}), d3.max(data, function(d){return d.expression})])
        .range(['#eff3ff', '#08519c'])
        .interpolate(d3.interpolateHcl); //interpolateHsl interpolateHcl interpolateRgb

    var colorScale = d3.scaleSequential(d3.interpolateReds)
                      .domain([d3.min(data, function(d){return d.expression}), d3.max(data, function(d){return d.expression})]);
    */

    var sizeScale = d3.scaleSqrt()
      .domain([minExp, maxExp])
      .range([0, maxRadius]);

    // Create the SVG canvas
    var svg = d3.select("body").append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("id", `otherPlot${svgid}`);
    ///*
    // Reposition  
    $(`#otherPlot${svgid}`).css({
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

    var fade50 = 0.1;
    var fade100 = 0.2;

    // Show guides for presence percentage
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", margin)
      .attr("x2", svgWidth-legendSize)
      .attr("y2", margin)
      .style("stroke", borderColor)
      .style("stroke-width", 2)
      .style('opacity', fade100);
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", margin+(svgHeight-margin*2)/4)
      .attr("x2", svgWidth-legendSize)
      .attr("y2", margin+(svgHeight-margin*2)/4)
      .style("stroke", borderColor)
      .style("stroke-width", 1)
      .style('opacity', fade50);
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", svgHeight/2)
      .attr("x2", svgWidth-legendSize)
      .attr("y2", svgHeight/2)
      .style("stroke", borderColor)
      .style("stroke-width", 2);
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", svgHeight-margin-(svgHeight-margin*2)/4)
      .attr("x2", svgWidth-legendSize)
      .attr("y2", svgHeight-margin-(svgHeight-margin*2)/4)
      .style("stroke", borderColor)
      .style("stroke-width", 1)
      .style('opacity', fade50);
    svg.append("line")
      .attr("x1", 0)
      .attr("y1", svgHeight-margin)
      .attr("x2", svgWidth-legendSize)
      .attr("y2", svgHeight-margin)
      .style("stroke", borderColor)
      .style("stroke-width", 2)
      .style('opacity', fade100);

     svg.append('line')
        .attr('x1', svgWidth-legendSize)
        .attr('y1', 0)
        .attr('x2', svgWidth-legendSize)
        .attr('y2', svgHeight)
        .style('stroke', 'black')
        .style('stroke-width', 2);

    svg.append('text').text('(selected data)')
        .attr('font-size', '10px')
        .attr('y', margin-12)
        .attr('x', svgWidth - legendSize + 4)
        .attr('text-anchor', 'start')
        .on('click', function(){ });
    svg.append('text').text('100% presence')
        .attr('font-size', '10px')
        .attr('y', margin)
        .attr('x', svgWidth - legendSize + 4)
        .attr('text-anchor', 'start')
        .on('click', function(){ });
    svg.append('text').text('50% presence')
        .attr('font-size', '10px')
        .attr('y', margin+(svgHeight-margin*2)/4)
        .attr('x', svgWidth - legendSize + 4)
        .attr('text-anchor', 'start')
        .on('click', function(){ });
    svg.append('text').text('0% presence')
        .attr('font-size', '10px')
        .attr('y', svgHeight/2)
        .attr('x', svgWidth - legendSize + 4)
        .attr('text-anchor', 'start')
        .on('click', function(){ });
    svg.append('text').text('50% presence')
        .attr('font-size', '10px')
        .attr('y', svgHeight-margin-(svgHeight-margin*2)/4)
        .attr('x', svgWidth - legendSize + 4)
        .attr('text-anchor', 'start')
        .on('click', function(){ });
    svg.append('text').text('100% presence')
        .attr('font-size', '10px')
        .attr('y', svgHeight-margin)
        .attr('x', svgWidth - legendSize + 4)
        .attr('text-anchor', 'start')
        .on('click', function(){ });
    svg.append('text').text('(all data)')
        .attr('font-size', '10px')
        .attr('y', svgHeight-margin+12)
        .attr('x', svgWidth - legendSize + 4)
        .attr('text-anchor', 'start')
        .on('click', function(){ });


    // Show legend for circle size
    var legendRadius = sizeScale(maxExp);
    var highCircle = svgHeight/2;
    var lowCircle = 7*svgHeight/8;
    var x_position = svgWidth-(legendSize/2);
    svg.append('circle')
      .attr('cx', x_position)
      .attr('cy', highCircle)
      .attr('r', sizeScale(maxExp))
      .attr('fill', 'blue')
      .style('opacity', 0.3);
    svg.append('circle')
      .attr('cx', x_position)
      .attr('cy', highCircle)
      .attr('r', sizeScale(maxExp/2))
      .attr('fill', 'blue')
      .style('opacity', 0.6);
    svg.append('line')
        .attr('x1', x_position + legendRadius)
        .attr('y1', highCircle)
        .attr('x2', x_position)
        .attr('y2', lowCircle)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('opacity', 0.5);
    svg.append('line')
        .attr('x1', x_position - legendRadius)
        .attr('y1', highCircle)
        .attr('x2', x_position)
        .attr('y2', lowCircle)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('opacity', 0.5);
    svg.append('text').text(`${maxExp} expression`)
        .attr('font-size', '10px')
        .attr('y', highCircle)
        .attr('x', x_position+legendRadius+4)
        .attr('text-anchor', 'start')
        .on('click', function(){ });
    svg.append('text').text(`${minExp} expression`)
        .attr('font-size', '10px')
        .attr('y', lowCircle)
        .attr('x', x_position+legendRadius/2)
        .attr('text-anchor', 'start')
        .on('click', function(){ });

    svg.append('text').text('mean expression')
        .attr('font-size', '10px')
        .attr('x', x_position+legendRadius)
        .attr('y', highCircle-legendRadius)
        .attr('text-anchor', 'start')
        .on('click', function(){ });
    svg.append('line')
        .attr('x1', x_position+legendRadius)
        .attr('y1', highCircle-legendRadius)
        .attr('x2', x_position)
        .attr('y2', highCircle)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('opacity', 0.5);
    svg.append('text').text('deviation')
        .attr('font-size', '10px')
        .attr('x', x_position)
        .attr('y', highCircle-legendRadius*1.5)
        .attr('text-anchor', 'start')
        .on('click', function(){ });
    svg.append('line')
        .attr('x1', x_position)
        .attr('y1', highCircle-legendRadius*1.5)
        .attr('x2', x_position)
        .attr('y2', highCircle-sizeScale(maxExp/2)-(sizeScale(maxExp)-sizeScale(maxExp/2))/2)
        .style('stroke', 'black')
        .style('stroke-width', 1)
        .style('opacity', 0.5);

    this._addCell = function(cellName, idx) {
      if (!cellSet[idx].includes(cellName)) {
        cellSet[idx].push(cellName);
        this.updatePlot();
      }
    }
    this._addGene = function(geneName) {
      if (!geneSet.includes(geneName)) {
        geneSet.push(geneName);
        this.updatePlot();
      }
    }


    var updatePlot = function () {

      svg.selectAll('.toRemove').remove();

      var num_genes = geneSet.length;
      var divisionSize = (svgWidth - legendSize - margin) / num_genes;
      var timepoints = allData.length;
      var geneMargin = (divisionSize-margin*2) / timepoints;

      //console.log(divisionSize, geneMargin);

      for (var i = 0; i < num_genes; i++) {
        var geneName = geneSet[i];

        var textXPosition = margin + (divisionSize)*i + geneMargin*(timepoints-1)/2;

        svg.append('text').text(geneName)
          .attr('class', 'toRemove')
          .attr('font-size', '10px')
          .attr('y', svgHeight - 5)
          .attr('x', textXPosition)
          .attr('text-anchor', 'middle')
          .on('click', function(){ });

        for (var j = 0; j < timepoints; j++) {
          var xPosition = margin + (divisionSize)*i + geneMargin*j;

          var genePresencePercent = d3.sum(
            allData[j].map(function(d) {
              if (d[geneName] > 0) {
                return 1;
              }
              else {
                return 0;
              }
            })
          );
          

          genePresencePercent = genePresencePercent / allData[j].length;

          //console.log(geneName, genePresencePercent);

          var avgExpression = d3.mean(allData[j], function(d){ return d[geneName]; });
          var expDeviation = d3.deviation(allData[j], function(d){ return d[geneName]; });
          var maxExpression = d3.max(allData[j], function(d){ return d[geneName]; });

          if (i == 0) {
            //console.log(j, 't: ', avgExpression, allData[j].length);
          }

          //console.log(avgExpression, expDeviation, maxExpression);

          svg.append('circle')
            .attr('cx', xPosition)
            .attr('cy', svgHeight/2 + ((svgHeight/2)-margin)*genePresencePercent)
            .attr('r', sizeScale(expDeviation)+sizeScale(avgExpression))
            .attr('fill', 'blue')
            .style('opacity', 0.3)
            .attr('class','toRemove')
            .attr('id',`dev${i}${j}:${avgExpression.toFixed(4)}:${expDeviation.toFixed(4)}:${(genePresencePercent*100).toFixed(2)}`)
            .on('mouseover', function() {
              var id = d3.select(this).attr('id');

              var displayString = '<p style="font-size: 12;">'+`Mean Expression: ${id.split(":")[1]}`;
              displayString += '<br>'+`Standard Deviation: ${id.split(":")[2]}`;
              displayString += '<br>'+`Presence in sample: ${id.split(":")[3]}%`;
              displayString += '</p>';
              tooltip.html(displayString)
              .style('opacity', .9)
              .style('left', (d3.event.pageX +10) + 'px')
              .style('top', (d3.event.pageY -100) + 'px')
              .style('border', '1px solid black')
              .raise();
            })
            .on('mouseout', function() {
              tooltip.html('')
              .style('border', '')
              .style('opacity', 0)
            });
          svg.append('circle')
            .attr('cx', xPosition)
            .attr('cy', svgHeight/2 + ((svgHeight/2)-margin)*genePresencePercent)
            .attr('r', sizeScale(avgExpression))
            .attr('fill', 'blue')
            .style('opacity', 0.6)
            .attr('class','toRemove')
            .attr('id',`avg${i}${j}:${avgExpression.toFixed(4)}:${expDeviation.toFixed(4)}:${(genePresencePercent*100).toFixed(2)}`)
            .on('mouseover', function() {
              var id = d3.select(this).attr('id');

              var displayString = '<p style="font-size: 12;">'+`Mean Expression: ${id.split(":")[1]}`;
              displayString += '<br>'+`Standard Deviation: ${id.split(":")[2]}`;
              displayString += '<br>'+`Presence in sample: ${id.split(":")[3]}%`;
              displayString += '</p>';
              tooltip.html(displayString)
              .style('opacity', .9)
              .style('left', (d3.event.pageX +10) + 'px')
              .style('top', (d3.event.pageY -100) + 'px')
              .style('border', '1px solid black')
              .raise();
            })
            .on('mouseout', function() {
              tooltip.html('')
              .style('border', '')
              .style('opacity', 0)
            });
          svg.append('line')
            .attr('x1', xPosition)
            .attr('y1', svgHeight/2 + ((svgHeight/2)-margin)*genePresencePercent)
            .attr('x2', xPosition)
            .attr('y2', svgHeight/2)
            .style('stroke', 'black')
            .style('stroke-width', 1)
            .attr('class','toRemove');

          if (cellSet[j].length > 0) {
            var selectedData = allData[j].filter(function(d) { return cellSet[j].includes(d.cell); });


            var avgExpressionSelected = 0;
            var expDeviationSelected = 0;
            var maxExpressionSelected = 0;
            var genePresencePercentSelected = 0;
            var genePresenceCountSelected = 0;

            if (selectedData.length > 0) {

              genePresenceCountSelected = d3.sum(
                selectedData.map(function(d) {
                  if (d[geneName] > 0) {
                    return 1;
                  }
                  else {
                    return 0;
                  }
                })
              );

              genePresencePercentSelected = genePresenceCountSelected / selectedData.length;

              avgExpressionSelected = d3.mean(selectedData, function(d){ return d[geneName]; });
              expDeviationSelected = d3.deviation(selectedData, function(d){ return d[geneName]; });
              maxExpressionSelected = d3.max(selectedData, function(d){ return d[geneName]; });

              if (i == 0) {
                //console.log(j, 's:', avgExpressionSelected, selectedData.length);
              }
            }
            //console.log(selectedData);
            //console.log(genePresenceCountSelected, selectedData.length, genePresencePercentSelected);

            //console.log(avgExpressionSelected, expDeviationSelected, maxExpressionSelected);

            svg.append('circle')
              .attr('cx', xPosition)
              .attr('cy', svgHeight/2 - ((svgHeight/2)-margin)*genePresencePercentSelected)
              .attr('r', sizeScale(expDeviationSelected)+sizeScale(avgExpressionSelected))
              .attr('fill', 'red')
              .style('opacity', 0.3)
              .attr('class','toRemove');
              /*
              .attr('id',`_avg${i}${j}:${avgExpressionSelected.toFixed(4)}:${expDeviationSelected.toFixed(4)}:${(genePresencePercentSelected*100).toFixed(2)}`)
              .on('mouseover', function() {
                var id = d3.select(this).attr('id');

                var displayString = '<p style="font-size: 12;">'+`Mean Expression: ${id.split(":")[1]}`;
                displayString += '<br>'+`Standard Deviation: ${id.split(":")[2]}`;
                displayString += '<br>'+`Presence in sample: ${id.split(":")[3]}%`;
                displayString += '</p>';
                tooltip.html(displayString)
                .style('opacity', .9)
                .style('left', (d3.event.pageX +10) + 'px')
                .style('top', (d3.event.pageY +10) + 'px')
                .style('border', '1px solid black')
                .raise();
              })
              .on('mouseout', function() {
                tooltip.html('')
                .style('border', '')
                .style('opacity', 0)
              });*/
            svg.append('circle')
              .attr('cx', xPosition)
              .attr('cy', svgHeight/2 - ((svgHeight/2)-margin)*genePresencePercentSelected)
              .attr('r', sizeScale(avgExpressionSelected))
              .attr('fill', 'red')
              .style('opacity', 0.6)
              .attr('class','toRemove');
              /*
              .attr('id',`_avg${i}${j}:${avgExpressionSelected.toFixed(4)}:${expDeviationSelected.toFixed(4)}:${(genePresencePercentSelected*100).toFixed(2)}`)
              .on('mouseover', function() {
                var id = d3.select(this).attr('id');

                var displayString = '<p style="font-size: 12;">'+`Mean Expression: ${id.split(":")[1]}`;
                displayString += '<br>'+`Standard Deviation: ${id.split(":")[2]}`;
                displayString += '<br>'+`Presence in sample: ${id.split(":")[3]}%`;
                displayString += '</p>';
                tooltip.html(displayString)
                .style('opacity', .9)
                .style('left', (d3.event.pageX +10) + 'px')
                .style('top', (d3.event.pageY +10) + 'px')
                .style('border', '1px solid black')
                .raise();
              })
              .on('mouseout', function() {
                tooltip.html('')
                .style('border', '')
                .style('opacity', 0)
              });*/
            svg.append('line')
              .attr('x1', xPosition)
              .attr('y1', svgHeight/2 - ((svgHeight/2)-margin)*genePresencePercentSelected)
              .attr('x2', xPosition)
              .attr('y2', svgHeight/2)
              .style('stroke', 'black')
              .style('stroke-width', 1)
              .attr('class','toRemove');
          }

        }
      }
    }

    
    this.updatePlot = updatePlot;

    this.updatePlot();
    
  }

  setCells(listOfCells, idx) {
    this._setCells(listOfCells, idx);
  }
  setGenes(listOfGenes) {
    this._setGenes(listOfGenes);
  }

  addCell(name, idx) {
    this._addCell(name, idx);
  }
  addGene(name) {
    this._addGene(name);
  }

}