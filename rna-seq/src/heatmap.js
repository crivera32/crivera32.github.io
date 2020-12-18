class Heatmap {
  constructor(svgid, offsetX, offsetY, svgWidth, svgHeight, colorScale, data, onClickFn=null) {
    //console.log(data);
    
    function getGeneFromID(id) {
      return id.split(":")[1];
    }

    var tooltip = d3.select('body')
              .append('div')
              .style('position', 'absolute')
              .style('padding', '0 10px')
              .style('background', 'white')
              .style('opacity', 0);


    var margin = 40;

    var uniqueCells = d3.map(data, function(d){return d.cell;}).keys();
    //var uniqueGenes = d3.map(data, function(d){return d.gene;}).keys();
    //var maxExpression = d3.max(data, function(d){return d.expression});


    //console.log('max exp:',maxExpression);

    //console.log('uniqueCells:', uniqueCells)
    //console.log('uniqueGenes:', uniqueGenes)

    this.data = data;

    var borderWidth = 0.2;
    var borderColor = 'black';

    var cellSet = [];
    var geneSet = ['Acta2', 'Saa3', 'Sftpa1', 'Ccl5'];

    for (var i = 0; i < 10; i++) {
      cellSet.push(uniqueCells[i]);
    }

    this._setCells = function(listOfCells) {
      cellSet = listOfCells;
      /*
      for (var i = 0; i < listOfCells.length; i++) {
        cellSet.push(listOfCells[i]);
      }*/
      this.updateHeatmap();
    }

    this._setGenes = function (listOfGenes) {
      geneSet = listOfGenes;
      this.updateHeatmap();
    }
    
    /*
    var colorScale = d3.scaleLinear()
        .domain([d3.min(data, function(d){return d.expression}), d3.max(data, function(d){return d.expression})])
        .range(['#eff3ff', '#08519c'])
        .interpolate(d3.interpolateHcl); //interpolateHsl interpolateHcl interpolateRgb

    var colorScale = d3.scaleSequential(d3.interpolateReds)
                      .domain([d3.min(data, function(d){return d.expression}), d3.max(data, function(d){return d.expression})]);
    */

    // Create the SVG canvas for the heatmap
    var svg = d3.select("body").append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("id", `HeatmapSVG${svgid}`);
    ///*
    // Reposition  
    $(`#HeatmapSVG${svgid}`).css({
      top: offsetY,
      left: offsetX,
      position:'absolute'
    });
    //*/
    // Border
    svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .style("stroke", borderColor)
      .style("stroke-width", borderWidth)
      .style("fill", 'none');


    this._addCell = function(cellName) {
      if (!cellSet.includes(cellName)) {
        cellSet.push(cellName);
        this.updateHeatmap();
      }
    }
    this._addGene = function(geneName) {
      if (!geneSet.includes(geneName)) {
        geneSet.push(geneName);
        this.updateHeatmap();
      }
    }

    var updateHeatmap = function () {
      svg.selectAll(`.heatmap${svgid}`).remove();

      var colWidth = (svgWidth - margin) / cellSet.length;
      var rowHeight = (svgHeight) / geneSet.length;

      for (var i = 0; i < geneSet.length; i++) {

        svg.selectAll('.heatmaprect')
        .data(data)
        .enter()
        .append('rect')
        .filter(function(d) { 
          return (cellSet.includes(d.cell));
        })
        .attr('x', function(d) {
          var col_idx = cellSet.indexOf(d.cell);
          var ret = margin + colWidth * col_idx;
          return ret;
        })
        .attr('y', function(d) {
          var row_idx = i;
          var ret = rowHeight * row_idx;
          return ret;
        })
        .attr('width', function(d) {
          return colWidth;
        })
        .attr('height', function(d) {
          return rowHeight;
        })
        .attr("fill", function (d) { return colorScale(d[geneSet[i]]); })
        .attr('stroke', borderColor)
        .attr('stroke-width', borderWidth)
        .attr('class', function(d){ return `heatmap${svgid}`})
        .attr('id', function(d) {return d3.select(this).attr('class')+` ${d.cell}:${geneSet[i]}`})
        .on("click", function(d) {
          var _id = d3.select(this).attr('id');
          var geneName = getGeneFromID(_id);

          var _class = d3.select(this).attr('class');
          console.log('id: ', _id);
          console.log('class: ', _class);
          console.log('data: ', d);

          if (onClickFn != null) {
            onClickFn(geneName);
          }

        })
        .on('mouseover', function(d) {
          var _id = d3.select(this).attr('id');
          var geneName = getGeneFromID(_id);

          var displayString = '<p style="font-size: 12;"><strong>'+`Expression: ${d[geneName]}`+'</strong><br>';
          displayString += `Cell: ${d.cell}<br>Gene: ${geneName}`
          displayString += '</p>'
          tooltip.html(displayString)
          .style('opacity', .9)
          .style('left', (d3.event.pageX +10) + 'px')
          .style('top', (d3.event.pageY +10) + 'px')
          .style('border', '1px solid black')
          .raise();
        })
        .on('mouseout', function(d) {
          tooltip.html('')
          .style('border', '')
          .style('opacity', 0)
        });
      }

      svg.selectAll('.geneText')
        .data(geneSet)
        .enter()
        .append('text').text(function(d) { return d;})
        .attr('class', `heatmap${svgid}`)
        .attr('font-size', '10px')
        .attr('y', function(d) { 
          var row_idx = geneSet.indexOf(d);
          var ret = rowHeight * row_idx + rowHeight*(0.66);
          //console.log(row_idx, ret);
          return ret;
        })
        .attr('x', margin*0.9)
        .attr('text-anchor', 'end')
        .on('click', function(d){
          if (d3.event.shiftKey) {
            geneSet.splice(geneSet.indexOf(d), 1);
            updateHeatmap();
          }
          else {
            console.log('TEXT:',d);
          }
        });

      /*
      svg.selectAll('.cellText')
        .data(cellSet)
        .enter()
        .append('text').text(function(d) { return d;})
        .attr('class', `heatmap${svgid}`)
        .attr('font-size', '10px')
        .attr('text-anchor', 'end')
        .attr('transform', function(d){
          var col_idx = cellSet.indexOf(d);
          var ret =  margin + colWidth * col_idx + colWidth/2;
          return `translate(${ret},${margin*0.9})rotate(45)`;
        })
        .on('click', function(d){
          if (d3.event.shiftKey) {
            cellSet.splice(cellSet.indexOf(d), 1);
            updateHeatmap();
          }
          else {
            console.log('TEXT:',d);
          }
        });*/
    }
    this.updateHeatmap = updateHeatmap;

    this.updateHeatmap();
  }

  setCells(listOfCells) {
    this._setCells(listOfCells);
  }
  setGenes(listOfGenes) {
    this._setGenes(listOfGenes);
  }

  addCell(name) {
    this._addCell(name);
  }
  addGene(name) {
    this._addGene(name);
  }

}