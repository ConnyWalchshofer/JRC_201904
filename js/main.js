/* global d3, crossfilter, timeSeriesChart, barChart */
// id,type,chromosome,start,end,mutation


var barChartChromosome = barChart()
  .width(600)
  .x(function (d) { return d.key;})
  .y(function (d) { return d.value;});
var barChartType = barChart()
  .x(function (d) { return d.key;})
  .y(function (d) { return d.value;});

// //call the fetch function
//   fetch('https://dcc.icgc.org/api/v1/projects/GBM-US/mutations?field=id,mutation,type,chromosome,start,end&size=100&order=desc')
//   .then(res => res.json())//response type
//   .then(data => console.log(data)); //log the data;

d3.csv("data/mutations.csv",
  function (err, data) {
       if (err) throw err;

// d3.csv("data/Lekagul_slice.csv",
  // function (d) {
  //   // This function is applied to each row of the dataset
  //   d.Timestamp = dateFmt(d.Timestamp);
  //   return d;
  // },
  // function (err, data) {
  //   if (err) throw err;

    var csData = crossfilter(data);

    // Create dimensions for each attribute to filter by
    csData.dimType = csData.dimension(function (d) { return d["type"]; });
    csData.dimChromosomeNames = csData.dimension(function (d) { return d["chromosome"]; });

    // Bin each dimension
    csData.types = csData.dimType.group();
    csData.chromosomeNames = csData.dimChromosomeNames.group();

    barChartType.onMouseOver(function (d) {
      csData.dimType.filter(d.key);
      update();
    }).onMouseOut(function () {
      // Clear the filter
      csData.dimType.filterAll();
      update();
    });

    barChartChromosome.onMouseOver(function (d) {
      csData.dimChromosomeNames.filter(d.key);
      update();
    }).onMouseOut(function () {
      // Clear the filter
      csData.dimChromosomeNames.filterAll();
      update();
    });

    function update() {
       d3.select("#types")
        .datum(csData.types.all())
        .call(barChartType);

      d3.select("#chromosomes")
        .datum(csData.chromosomeNames.all())
        .call(barChartChromosome)
        .select(".x.axis") //Adjusting the tick labels after drawn
        .selectAll(".tick text")
        .attr("transform", "translate(-8,5) rotate(-45)");
        
    }

    update();


  }
);