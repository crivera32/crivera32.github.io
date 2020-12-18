class Balloon {
    constructor(svgid, offsetX, offsetY, svgWidth, svgHeight, colorScale, data, onClickFn=null) {

        var geneSet = ["Klf7", "Arpc2", "Rpl7", "Ackr3", "Ogfrl1"]

        var cellSet = data.slice(0, 5).map(function (d) {
            return d.cell;
        });

        this._setCells = function (listOfCells) {
            cellSet = listOfCells;
            this.updateHeatmap();
        }

        this._setGenes = function (listOfGenes) {
            geneSet = listOfGenes;
            this.updateHeatmap();
        }

        this._addCell = function (cellName) {
            if (!cellSet.includes(cellName)) {
                cellSet.push(cellName);
                this.updateBalloonPlot();
            }
        }

        this._addGene = function (geneName) {
            if (!geneSet.includes(geneName)) {
                geneSet.push(geneName);
                this.updateBalloonPlot();
            }
        }

        var updateBalloonPlot = function () {

            var cellFilteredData = data.filter(function (d) {
                return cellSet.includes(d.cell)
            });

            var geneFilteredData = cellFilteredData.map(function (d) {
                return _.pick(d, geneSet);
            });

            var keys = Object.keys(geneFilteredData[0]);

            var balloonPlotData = [];
            var rowData = [];

            for (var i = 0; i < keys.length; i++) {
                for (var j = 0; j < geneFilteredData.length; j++) {
                    rowData.push(geneFilteredData[j][keys[i]]);
                }
                balloonPlotData.push(rowData);
                rowData = [];
            }

            var borderWidth = 0.2;
            var borderColor = 'black';

            d3.select(`#BalloonSVG${svgid}`).remove();

            var svg = d3.select("body").append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .attr("id", `BalloonSVG${svgid}`);

            // Reposition  
            $(`#BalloonSVG${svgid}`).css({
                top: offsetY,
                left: offsetX,
                position: 'absolute'
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

            // set the color scale used in the rows
            // var yColor = d3.scaleOrdinal(d3.schemeCategory10);

            // set a transition for interactions
            var transition = d3.transition()
                .duration(500)
                .ease(d3.easeLinear);

            // create the balloon plot
            /* Passing the function reference from main.js to function */
            var bplot = balloonplot(185, 110, onClickFn)
                .position(20, 25)               // set the top-left offset
                .transition(transition)         // enable transitions
                .colorScale('y', colorScale)        // set the row-wise colors
                .interactionOnElements(['circle', 'x', 'y'])   // enable interactions for mouseover/touch on circles and axes
                .valueTextFmt(function (v) { return Math.round(v * 100) / 100; })   // custom value formatter
                .data(balloonPlotData)                     // pass the data matrix
                // .xAxis(d3.axisTop, cellSet)     // enable the X axis and pass the tick labels
                .yAxis(d3.axisRight, geneSet)   // enable the Y axis and pass the tick labels
                .legend('bottom', 3);           // legend below the plot with 3 sample circles (requires bplot.update() below)

            // add it to the SVG canvas
            svg.append(bplot)
                .attr("class", "balloon_plot");
            bplot.init();   // necessary update for dynamic repositioning of the legend after it was rendered

        }

        this.updateBalloonPlot = updateBalloonPlot;

        this.updateBalloonPlot();
    }

    setCells(listOfCells) {
        this._setCells(listOfCells);
    }

    setGenes(listOfGenes) {
        this._setGenes(listOfGenes);
    }

    addCell(cellName) {
        this._addCell(cellName);
    }

    addGene(geneName) {
        this._addGene(geneName);
    }
}