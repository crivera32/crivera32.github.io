var tooltip = d3.select("body")
                .append("div")
                .attr("class","tooltip")
                .style("opacity","0")
                .style("position","absolute")

var filenames = ['day0','day1','day2','day3','day8','hour6'];
var tsneFilenames = ['day0_tsne','day1_tsne','day2_tsne','day3_tsne','day8_tsne','hour6_tsne'];
var allData = [];

var topCountGenes = [];

var loaded = [];
for (var i = 0; i < filenames.length; i++) {
    loaded.push(false);
}

// Get window size
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var upperMargin = 30;
var viewportMargin = 10;

var viewportWidth = (windowWidth - viewportMargin*(filenames.length+2)) / filenames.length;
var viewportHeight = (windowHeight - upperMargin - viewportMargin*5) / 4;

$('#cloud').css({
    top: upperMargin+(viewportHeight+viewportMargin)*1,
    left: viewportMargin,
    position:'absolute'
});

$('#demo').css({
    top: upperMargin+(viewportHeight+viewportMargin)*1,
    left: viewportMargin + (3*(viewportWidth+viewportMargin)),
    position:'absolute'
});


var clusterArray = [];
var heatmapArray = [];
for (var i = 0; i < filenames.length; i++) {
    heatmapArray.push(null);
}
var otherPlot;

var geneList = [];
var cellList = [];

var allMaxExp = [];
var allMinExp = [];

// Change some CSS
$('#selectGene').css({
    top: 5,
    left: 5,
    'margin-left':0,
    'margin-top':0,
    position:'absolute'
});

/*
$('#selectCell').css({
    top: 5,
    left: 400,
    'margin-left':0,
    'margin-top':0,
    position:'absolute'
});*/

$('.selection').css("visibility", "hidden");
$('#myTitle').text('Loading, please wait...');

// Load the data
for (var file_idx = 0; file_idx < filenames.length; file_idx++) {
    loadData(file_idx, filenames[file_idx], tsneFilenames[file_idx]);
}

// set up the dropdowns
geneDropdown('ddlGenes', geneList);
//cellDropdown('ddlCells', cellList);

function loadData(idx, data_filename, tsne_filename){
    //var dataPath = "../data/normalized/" + data_filename + ".csv"; // Mean-centered normalization based on standard deviation.
    var dataPath = "../data/minmax/" + data_filename + ".csv"; // Normalized based on min/max range (all values between 0.0 and 1.0).
    var tsnePath = "../data/tsne/" + tsne_filename + ".csv";

    d3.csv(dataPath).then(function(data) {

        var dataArray = [];
        var geneExpressionArray = [];

        for(var i = 0; i < data.length; i++){
            var keys = Object.keys(data[i]);
            var cellName = data[i][keys[0]];
            var entry = {cell:cellName};
            if (!cellList.includes(cellName)) {
                cellList.push(cellName);
            }
            var geneArray = [];

            for(var j = 1; j < keys.length; j++){
                var expVal = parseFloat(data[i][keys[j]])
                entry[keys[j]] = expVal;
                geneArray.push(expVal);
                if (i==1) {
                    if (!geneList.includes(keys[j])) {
                        geneList.push(keys[j]);
                    }
                }
            }
            entry.geneExpressionArray = geneArray;
            geneExpressionArray.push(geneArray); // This is for TSNE

            dataArray.push(entry);
        }

        allData.push(dataArray);

        //=====================================//
        // Get color scale for gene expression //
        //=====================================//
        var maxExpression = d3.max(dataArray, function(d) {
          return d3.max(d.geneExpressionArray);
        });
        var minExpression = d3.min(dataArray, function(d) {
          return d3.min(d.geneExpressionArray);
        });


        var meanExpression = d3.mean(dataArray, function(d){
            return d3.mean(d.geneExpressionArray)
        });

        var colorScale = d3.scaleSequential(d3.interpolateViridis).domain([minExpression, maxExpression]);
        //var colorScale = d3.scaleLinear()
        //    .domain([minExpression,minExpression+(maxExpression-minExpression)/2,maxExpression])
        //    .range(['#2c7fb8', '#7fcdbb', '#ffffd9'])
        //    .interpolate(d3.interpolateHcl); //interpolateHsl interpolateHcl interpolateRgb

        var cloudScale = d3.scaleSequential(d3.interpolateViridis).domain([minExpression * 200,maxExpression * 200]);
        
        allMinExp.push(minExpression);
        allMaxExp.push(maxExpression);

        var nzArray = geneList.map(function(geneName) {
            var count = d3.sum(dataArray, function(d) {
                if (d[geneName] > 0) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            return {name: geneName, count: count};
        });
        //console.log(nzArray);
        var sorted50 = nzArray.sort((a,b) => b.count-a.count).slice(0,50);
        //console.log(sorted50);

        for (var _i = 0; _i < 50; _i++) {
            var name = sorted50[_i].name;
            //console.log(name, sorted50[_i]);
            if (!topCountGenes.includes(name)) {
                topCountGenes.push(name);
            }
        }

        var minNonZero = d3.min(nzArray, function(d){return d.count;});
        var meanNonZero = d3.mean(nzArray, function(d){return d.count;});
        var maxNonZero = d3.max(nzArray, function(d){return d.count;});

        //====================//
        // Get TSNE positions //
        //====================//
        
        /*
        var opt = {}
        opt.epsilon = 10; // epsilon is learning rate (10 = default)
        opt.perplexity = 30; // roughly how many neighbors each point influences (30 = default)
        opt.dim = 2; // dimensionality of the embedding (2 = default)
        var tsne = new tsnejs.tSNE(opt); // create a tSNE instance
        tsne.initDataDist(geneExpressionArray);
        for(var k = 0; k < 500; k++) {
          tsne.step(); // every time you call this, solution gets better
        }
        var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot
        
        for (var i = 0; i < dataArray.length; i++) {
            dataArray[i].tsne = Y[i];
        }
        */

        //console.log(dataArray);

        d3.csv(tsnePath).then(function(data_tsne) {
            for (var i = 0; i < dataArray.length; i++) {
                dataArray[i].tsne = [ parseFloat(data_tsne[i].tSNE_1), parseFloat(data_tsne[i].tSNE_2) ];
            }
            console.log(dataArray);

            //================//
            // Create Cluster //
            //================//
            var xPosition = viewportMargin + (idx*(viewportWidth+viewportMargin))
            //console.log(idx, xPosition);

            clusterArray.push(new Cluster(idx, xPosition, upperMargin, viewportWidth, viewportHeight, colorScale, cloudScale, dataArray, selectFn=selectedCells));

            var hm = new Heatmap(idx, xPosition, upperMargin+(viewportHeight+viewportMargin)*1, viewportWidth, viewportHeight, colorScale, dataArray, onClickFn=selectGeneInCluster);
            hm.setGenes(topCountGenes.slice(0,8));
            heatmapArray[idx] = hm;

            // Check to see if loading is finished
            loaded[idx] = true;
            if (!loaded.includes(false)) {
                $('#myTitle').remove();
                $('.selection').css("visibility", "visible");

                //console.log(topCountGenes);
                otherPlot = new OtherPlot(0, viewportMargin, upperMargin+(viewportHeight+viewportMargin)*2, (viewportWidth+viewportMargin)*allData.length-viewportMargin, viewportHeight, colorScale, allData, d3.min(allMinExp), d3.max(allMaxExp));
                //otherPlot.setGenes(geneList.slice(0, 4));
                var myGeneList = topCountGenes.slice(0,2);
                myGeneList.push(topCountGenes[30]);
                myGeneList.push(topCountGenes[44]);
                myGeneList.push(topCountGenes[48]);
                //otherPlot.setGenes(myGeneList);

                $("#heatmapLegend").css("left", ((viewportWidth + viewportMargin) * 2) + viewportMargin);

                legend({
                    color: colorScale,
                    width: ((viewportWidth + viewportMargin) * 4) - viewportMargin,
                    id: "heatmapLegend"
                });
            }
            
        });
        
    });
}

function selectGeneInCluster(geneName) {
    for (var i = 0; i < clusterArray.length; i++) {
        clusterArray[i].updateView(geneName);
    }
}

function selectedCells(cells, _idx){
    if (cells.length < 11) {
        heatmapArray[_idx].setCells(cells.map(function(d){return d.cell;}));
    }
    else {
        heatmapArray[_idx].setCells(cells.slice(0,10).map(function(d){return d.cell;}));
    }

    for (var i = 0; i < filenames.length; i++) {
        $(`#HeatmapSVG${i}`).css({
            top: upperMargin+(viewportHeight+viewportMargin)*2,
        });
    }
    $(`#otherPlot${0}`).css({
        top: upperMargin+(viewportHeight+viewportMargin)*3,
    });

    otherPlot.setCells(cells.map(function(d){return d.cell;}), _idx);
}
/*
function cellDropdown(id, array){
    $( "#"+id ).autocomplete({
        source: array,
        select: function( event, ui ) {
            //c1.updateView(ui.item.value);
            for (var i = 0; i < heatmapArray.length; i++) {
                heatmapArray[i].addCell(ui.item.value);
            }
        }
    });
}*/

function geneDropdown(id, array){
    $( "#"+id ).autocomplete({
        source: array,
        select: function( event, ui ) {
            //c1.updateView(ui.item.value);
            for (var i = 0; i < heatmapArray.length; i++) {
                heatmapArray[i].addGene(ui.item.value);
            }
            otherPlot.addGene(ui.item.value);
        }
    });
}
