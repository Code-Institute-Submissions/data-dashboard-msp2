queue()
    .defer(d3.csv, "/data/monotremeDF.csv")
    .await(makeGraphs);


function makeGraphs(error, sightingsData) {

    //CREATE CROSSFILTER RECORD
    var ndx = crossfilter(sightingsData);

    sightingsData.forEach(function(d) {
        d["decimalLongitude"] = +d["decimalLongitude"];
        d["decimalLatitude"] = +d["decimalLatitude"];
        d["month"] = +d["month"];
        d["year"] = +d["year"];
        d["individualCount"] = +d["individualCount"];
    });

    //CREATE DIMENSIONS
    var speciesDim = ndx.dimension(dc.pluck('vernacularName'));
    var stateDim = ndx.dimension(dc.pluck('stateProvince'));
    var monthDim = ndx.dimension(dc.pluck('month'));
    var yearDim = ndx.dimension(dc.pluck('year'));
    var allDim = ndx.dimension(function(d) { return d; });


    //CREATE GROUPS 
    var speciesGroup = speciesDim.group();
    var sightingsStateGroup = stateDim.group()

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

    console.log(sightingsyearGroupEchidna.all())

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
        .colors(['#f5f5f5'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);

    /*    monthChart
            .width(600)
            .height(500)
            .x(d3.scaleLinear().domain([1,12]))
            .xUnits(dc.units.integers)
            .yAxisLabel("Month")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            .compose([
                dc.barChart(monthChart)
                .dimension(yearDim)
                .colors('green')
                .group(sightingsmonthGroupEchidna, 'Short-beaked Echidna'),
                dc.barChart(monthChart)
                .dimension(monthDim)
                .colors('blue')
                .group(sightingsmonthGroupPlatypus, 'Duck-billed Platypus')

            ]);*/

    monthChart
        .width(600)
        .height(500)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(monthDim)
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .group(sightingsmonthGroupPlatypus, 'Duck-billed Platypus')
        .stack(sightingsmonthGroupEchidna, 'Short-beaked Echidna')
        .ordinalColors(['blue', 'green'])
        .transitionDuration(500)
        .x(d3.scaleOrdinal())
        .xUnits(dc.units.ordinal)
        .elasticY(false)
        .xAxisLabel('Month')
        .yAxis().ticks(10);


    yearChart
        .width(600)
        .height(500)
        .x(d3.scaleLinear().domain([2000, 2018]))
        .xUnits(dc.units.integers)
        .yAxisLabel("Year")
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(yearChart)
            .dimension(yearDim)
            .colors('green')
            .group(sightingsyearGroupEchidna, 'Short-beaked Echidna'),

            dc.lineChart(yearChart)
            .dimension(yearDim)
            .colors('blue')
            .group(sightingsyearGroupPlatypus, 'Duck-billed Platypus')


        ]);

    console.log(speciesGroup.all());
    // Add Data on Monotreme numbers to DOM


    var nspecies = selectSpecies.data().length

    //Initialize Leaflet Map
    var map = L.map('map');

    //Data to be updated everytime crossfilter data is filtered (map and number counts of respective species)
    var update = function() {
        //Draw Map of Australia
        map.setView([-29.2744, 133.7751], 4);
        mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 15,
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
        for (i = 0; i < nspecies; i++) {
            var id = speciesGroup.all()[i].key;
            var numbers = speciesGroup.all()[i].value;
            document.getElementById(id).innerHTML = (id + ': ' + numbers);
            console.log(sightingsyearGroupPlatypus)
            console.log(selectSpecies.data());
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
