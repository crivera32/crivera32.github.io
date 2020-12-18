To add the balloon plots to your code following steps need to be taken:
1. Copy the script references to the index.html file
    <script src="../d3/d3-balloon.js"></script>
    <script src="balloon.js"></script>
2. Add the Balloon Plot calling code to main.js file. The calling function is similar to the Heatmap function.
    new Balloon(idx, xPosition, upperMargin + (viewportHeight + viewportMargin), viewportWidth, viewportHeight, colorScale, dataArray, onClickFn = selectGeneInCluster);