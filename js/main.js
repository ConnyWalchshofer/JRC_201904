/* global d3, crossfilter, timeSeriesChart, barChart */
// Timestamp,car-id,car-type,gate-name
// id,type,chromosome,start,end,mutation

// 2015-05-01 00:43:28
// var dateFmt = d3.timeParse("%Y-%m-%d %H:%M:%S");

// var chartTimeline = timeSeriesChart()
//   .width(1000)
//   .x(function (d) { return d.key;})
//   .y(function (d) { return d.value;});
var barChartChromosome = barChart()
  .width(600)
  .x(function (d) { return d.key;})
  .y(function (d) { return d.value;});
var barChartType = barChart()
  .x(function (d) { return d.key;})
  .y(function (d) { return d.value;});

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

    // We create dimensions for each attribute we want to filter by
    // csData.dimTime = csData.dimension(function (d) { return d.Timestamp; });
    csData.dimType = csData.dimension(function (d) { return d["type"]; });
    csData.dimChromosomeNames = csData.dimension(function (d) { return d["chromosome"]; });

    // We bin each dimension
    // csData.timesByHour = csData.dimTime.group(d3.timeHour);
    csData.types = csData.dimType.group();
    csData.chromosomeNames = csData.dimChromosomeNames.group();


    // chartTimeline.onBrushed(function (selected) {
    //   csData.dimTime.filter(selected);
    //   update();
    // });

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
      // d3.select("#timeline")
      //   .datum(csData.timesByHour.all())
      //   .call(chartTimeline);

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