<<<<<<< HEAD
/* global d3version4, crossfilter, timeSeriesChart, barChart */
=======
/* global d3, crossfilter, timeSeriesChart, barChart */
>>>>>>> 61615dd7a4d42aa745760fdb960561f2d70f8503
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

<<<<<<< HEAD
d3version4.csv("data/mutations.csv",
  function (err, data) {
       if (err) throw err;

// d3version4.csv("data/Lekagul_slice.csv",
=======
d3.csv("data/mutations.csv",
  function (err, data) {
       if (err) throw err;

// d3.csv("data/Lekagul_slice.csv",
>>>>>>> 61615dd7a4d42aa745760fdb960561f2d70f8503
  // function (d) {
  //   // This function is applied to each row of the dataset
  //   d.Timestamp = dateFmt(d.Timestamp);
  //   return d;
  // },
  // function (err, data) {
  //   if (err) throw err;

<<<<<<< HEAD
  // data.sort(function(a, b) { return d3.ascending(a.chromosomes, b.chromosomes)});  

=======
>>>>>>> 61615dd7a4d42aa745760fdb960561f2d70f8503
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
<<<<<<< HEAD
       d3version4.select("#types")
        .datum(csData.types.all())
        .call(barChartType);

        d3version4.select("#chromosomes")
=======
       d3.select("#types")
        .datum(csData.types.all())
        .call(barChartType);

      d3.select("#chromosomes")
>>>>>>> 61615dd7a4d42aa745760fdb960561f2d70f8503
        .datum(csData.chromosomeNames.all())
        .call(barChartChromosome)
        .select(".x.axis") //Adjusting the tick labels after drawn
        .selectAll(".tick text")
<<<<<<< HEAD
        .text(function (d) {
          return "Chromosome "+d;
          // console.log(d);
        })
        .attr("transform", "translate(-8,5) rotate(-45)")
;
        ;
=======
        .attr("transform", "translate(-8,5) rotate(-45)");
>>>>>>> 61615dd7a4d42aa745760fdb960561f2d70f8503
        
    }

    update();


  }
);