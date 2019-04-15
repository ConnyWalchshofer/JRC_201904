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

function barChart() {

  var margin = {
          top: 20,
          right: 20,
          bottom: 30,
          left: 40
      },
      width = 400,
      height = 400,
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom,
      xValue = function(d) {
          return d[0];
      },
      yValue = function(d) {
          return d[1];
      },
      xScale = d3version4.scaleBand().padding(0.1),
      yScale = d3version4.scaleLinear(),
      onMouseOver = function() {},
      onMouseOut = function() {};

  function chart(selection) {
      selection.each(function(data) {

          // Select the svg element, if it exists.
          var svg = d3version4.select(this).selectAll("svg").data([data]);

          // Otherwise, create the skeletal chart.
          var svgEnter = svg.enter().append("svg");
          var gEnter = svgEnter.append("g");
          gEnter.append("g").attr("class", "x axis");
          gEnter.append("g").attr("class", "y axis");

          innerWidth = width - margin.left - margin.right,
              innerHeight = height - margin.top - margin.bottom,

              // Update the outer dimensions.
              svg.merge(svgEnter).attr("width", width)
              .attr("height", height);

          // Update the inner dimensions.
          var g = svg.merge(svgEnter).select("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          xScale.rangeRound([0, innerWidth])
              .domain(data.map(xValue));
          yScale.rangeRound([innerHeight, 0])
              .domain([0, d3version4.max(data, yValue)]);

          g.select(".x.axis")
              .attr("transform", "translate(0," + innerHeight + ")")
              .call(d3version4.axisBottom(xScale));

          g.select(".y.axis")
              .call(d3version4.axisLeft(yScale).ticks(10))
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", "0.71em")
              .attr("text-anchor", "end")
          // .text("Frequency");

          var bars = g.selectAll(".bar")
              .data(function(d) {
                  return d;
              });

          bars.enter().append("rect")
              .attr("class", "bar")
              .merge(bars)
              .attr("x", X)
              .attr("y", Y)
              .attr("width", xScale.bandwidth())
              .attr("height", function(d) {
                  return innerHeight - Y(d);
              })
              .on("mouseover", onMouseOver)
              .on("mouseout", onMouseOut);

          bars.exit().remove();
      });


  }

  // The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
      return xScale(xValue(d));
  }

  // The y-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
      return yScale(yValue(d));
  }

  chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
  };

  chart.width = function(_) {
      if (!arguments.length) return width;
      width = _;
      return chart;
  };

  chart.height = function(_) {
      if (!arguments.length) return height;
      height = _;
      return chart;
  };

  chart.x = function(_) {
      if (!arguments.length) return xValue;
      xValue = _;
      return chart;
  };

  chart.y = function(_) {
      if (!arguments.length) return yValue;
      yValue = _;
      return chart;
  };

  chart.onMouseOver = function(_) {
      if (!arguments.length) return onMouseOver;
      onMouseOver = _;
      return chart;
  };

  chart.onMouseOut = function(_) {
      if (!arguments.length) return onMouseOut;
      onMouseOut = _;
      return chart;
  };


  return chart;
}

var barChartChromosome = d3version4.barChart()
  .width(600)
  .x(function(d) {
      return d.key;
  })
  .y(function(d) {
      return d.value;
  });
var barChartType = d3version4.barChart()
  .x(function(d) {
      return d.key;
  })
  .y(function(d) {
      return d.value;
  });

// d3version4.csv("data/mutations.csv", function(err, data) {
//   console.log(data);
// });

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