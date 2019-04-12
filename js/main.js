/* global d3version4, crossfilter, timeSeriesChart, barChart */
// id,type,chromosome,start,end,mutation
function httpGet(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}

function toMutationArray(json) {
  // console.log(json.hits);
  // let arr = [];
  // arr.push(["id","type","chromosome","start","end","mutation"])
  // let hitsLength = json.hits.length;
  // for (let i = 0; i < hitsLength; i++) {
  //   let entry = json.hits[i];
  //   // console.log(entry);
  //   arr.push([entry.id, entry.type, entry.chromosome, entry.start, entry.end, entry.mutation]);
  // }
  // console.log(arr);
  // return arr;
  return json.hits;
}

var barChartChromosome = barChart()
  .width(600)
  .x(function(d) {
      return d.key;
  })
  .y(function(d) {
      return d.value;
  });
var barChartType = barChart()
  .x(function(d) {
      return d.key;
  })
  .y(function(d) {
      return d.value;
  });

d3version4.csv("data/mutations.csv", function(err, data) {
  console.log(data);
});

data = toMutationArray(JSON.parse(httpGet("https://dcc.icgc.org/api/v1/projects/GBM-US/mutations?field=id,mutation,type,chromosome,start,end&size=100&order=desc")));

var csData = crossfilter(data);

// Create dimensions for each attribute to filter by
csData.dimType = csData.dimension(function(d) {
  return d["type"];
});
csData.dimChromosomeNames = csData.dimension(function(d) {
  return d["chromosome"];
});

// Bin each dimension
csData.types = csData.dimType.group();
csData.chromosomeNames = csData.dimChromosomeNames.group();

barChartType.onMouseOver(function(d) {
  csData.dimType.filter(d.key);
  update();
}).onMouseOut(function() {
  // Clear the filter
  csData.dimType.filterAll();
  update();
});

barChartChromosome.onMouseOver(function(d) {
  csData.dimChromosomeNames.filter(d.key);
  update();
}).onMouseOut(function() {
  // Clear the filter
  csData.dimChromosomeNames.filterAll();
  update();
});

function update() {
  d3version4.select("#types")
      .datum(csData.types.all())
      .call(barChartType);

  d3version4.select("#chromosomes")
      .datum(csData.chromosomeNames.all())
      .call(barChartChromosome)
      .select(".x.axis") //Adjusting the tick labels after drawn
      .selectAll(".tick text")
      .text(function(d) {
          return "Chromosome " + d;
          // console.log(d);
      })
      .attr("transform", "translate(-8,5) rotate(-45)");;

}

update();