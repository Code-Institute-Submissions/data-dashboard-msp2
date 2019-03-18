queue()
  .defer(d3.csv, "/data/monotremeDF.csv")
  .await(makeGraphs);

/*
d3.csv("/data/monotremeDF.csv").then(function(data) {
    console.log(data)
});*/


function makeGraphs(error, sightingsData) {
    
    //CREATE CROSSFILTER RECORD
 
    

    var ndx = crossfilter(sightingsData);

//CREATE DIMENSIONS
    var speciesDim = ndx.dimension(dc.pluck('vernacularName'));
    var stateDim = ndx.dimension(dc.pluck('stateProvince'));

    //CREATE GROUPS 
    var speciesGroup = speciesDim.group();
    var sightingsStateGroup = stateDim.group()

    //DC.JS Charts
    var selectSpecies = dc.selectMenu("#selectSpecies");
    var stateChart = dc.rowChart("#sightings_per_state");


    //CHART PROPERTIES
    selectSpecies
        .dimension(speciesDim)
        .group(speciesGroup)
        .controlsUseVisibility(true);

    stateChart
        .width(600)
        .height(555)
        .dimension(stateDim)
        .group(sightingsStateGroup)
        .colors(['#f5f5f5'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);



    //RENDER CHARTS
    dc.renderAll(); 
   
}


