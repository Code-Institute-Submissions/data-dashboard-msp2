queue()
    .defer(d3.csv, "data/monotremeDF.csv")
    .await(makeGraphs);


function makeGraphs(error, sightingsData) {

    //CREATE CROSSFILTER RECORD
    var ndx = crossfilter(sightingsData);

    var dateFormat = d3.timeParse("%Y-%m-%d");

    sightingsData.forEach(function(d) {
        d["eventDate"] = dateFormat(d["eventDate"]);
        d["decimalLongitude"] = +d["decimalLongitude"];
        d["decimalLatitude"] = +d["decimalLatitude"];
        d["month"] = +d["month"];
        d["year"] = +d["year"];
        d["individualCount"] = +d["individualCount"];
    });

    //console.log(sightingsData);

    //CREATE DIMENSIONS
    var dateDim = ndx.dimension(function(d) { return d["eventDate"] });
    var speciesDim = ndx.dimension(dc.pluck('vernacularName'));
    var stateDim = ndx.dimension(dc.pluck('stateProvince'));
    var monthDim = ndx.dimension(dc.pluck('month'));
    var yearDim = ndx.dimension(dc.pluck('year'));
    var allDim = ndx.dimension(function(d) { return d; });


    var minDate = dateDim.bottom(1)[0];
    var maxDate = dateDim.top(1)[0];

    console.log(maxDate);

    //CREATE GROUPS 
    var speciesGroup = speciesDim.group().reduceSum(function(d) {
        return +d.individualCount
    });

    var dateDim = ndx.dimension(function(d) { return d["eventDate"] });

    var sightingsStateGroup = stateDim.group().reduceSum(function(d) {
        return +d.individualCount
    });


    //Average Sightings per Month
    var sightingsmonthGroupPlatypus = monthDim.group().reduceSum(function(d) {
        if (d.vernacularName === 'Duck-billed Platypus') {
            return +d.individualCount;
        }
        else {
            return 0;
        }
    });

    var sightingsmonthGroupEchidna = monthDim.group().reduceSum(function(d) {
        if (d.vernacularName === 'Short-beaked Echidna') {
            return +d.individualCount;
        }
        else {
            return 0;
        }
    });

    //Average sightings per year
    var sightingsyearGroupPlatypus = yearDim.group().reduceSum(function(d) {
        if (d.vernacularName === 'Duck-billed Platypus') {
            return +d.individualCount;
        }
        else {
            return 0;
        }
    });

    var sightingsyearGroupEchidna = yearDim.group().reduceSum(function(d) {
        if (d.vernacularName === 'Short-beaked Echidna') {
            return +d.individualCount;
        }
        else {
            return 0;
        }
    });



    //DC.JS Charts
    var selectSpecies = dc.selectMenu("#selectSpecies");
    var stateChart = dc.rowChart("#sightings_per_state");
    monthChart = dc.barChart('#sightings_over_month');
    yearChart = dc.compositeChart('#sightings_over_year');

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
        .colors(['brown'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);



    monthChart
        .width(600)
        .height(500)
        .dimension(monthDim)
        .legend(dc.legend().x(100).y(15).itemHeight(13).gap(5))
        .group(sightingsmonthGroupPlatypus, 'Duck-billed Platypus')
        .stack(sightingsmonthGroupEchidna, 'Short-beaked Echidna')
        .ordinalColors(['blue', 'green'])
        .transitionDuration(500)
        .x(d3.scaleOrdinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel('Month')
        .yAxisLabel("Number of sightings")
        .renderHorizontalGridLines(true)
    //.yAxis().ticks(10);

 

                yearChart
                .width(600)
                .height(500)
                .x(d3.scaleLinear().domain([2000, 2018]))
                //.mouseZoomable(true)
                .xUnits(dc.units.integers)
                .yAxisLabel("Number of sightings")
                .xAxisLabel("Year")
                .elasticY(true)
                .legend(dc.legend().x(400).y(15).itemHeight(13).gap(5))
                .renderHorizontalGridLines(true)
                .renderVerticalGridLines(true)
                .compose([
                    dc.lineChart(yearChart)
                    .dimension(yearDim)
                    .colors('green')
                    .group(sightingsyearGroupEchidna, 'Short-beaked Echidna')
                    .renderArea(true),
                    dc.lineChart(yearChart)
                    .dimension(yearDim)
                    .colors('blue')
                    .group(sightingsyearGroupPlatypus, 'Duck-billed Platypus')
                    .renderArea(true)
                ]);



//Initialize Leaflet Map
var map = L.map('map');

//Data to be updated everytime crossfilter data is filtered (map and number counts of respective species)
var update = function() {
    //Draw Map of Australia
    map.setView([-29.2744, 133.7751], 4).scrollWheelZoom.disable();
    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 15,
            minZoom: 4,
        }).addTo(map);


    // Add heat map data
    var geoData = [];
    _.each(allDim.top(Infinity), function(d) {
        geoData.push([d["decimalLatitude"], d["decimalLongitude"], d["individualCount"]]);
    })
    var length = geoData.length

    var heat = L.heatLayer(geoData, {
        radius: 10,
        blur: 20,
        maxZoom: 1,
    }).addTo(map);

    // Add Data on Monotreme numbers to DOM
    for (i = 0; i < 2; i++) {
        var id = speciesGroup.all()[i].key;
        var numbers = speciesGroup.all()[i].value;
        document.getElementById(id).innerHTML = (numbers);

       
        }


};

update();

dcCharts = [selectSpecies, stateChart, monthChart, yearChart];

_.each(dcCharts, function(dcChart) {
    dcChart.on("filtered", function(chart, filter) {
        map.eachLayer(function(layer) {
            map.removeLayer(layer)
        });

        update();
    });
});

//RENDER CHARTS
dc.renderAll();

}
