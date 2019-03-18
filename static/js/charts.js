queue()
  .defer(d3.csv, "data/monotremeDF.csv")
  .await(makeGraphs);

function makeGraphs(error, sightingsData) {
}