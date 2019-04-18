queue()
    .defer(d3.csv, 'data/monotremeDF.csv')
    .await(makeGraphs);


function makeGraphs(error, sightingsData) {

    //CREATE CROSSFILTER RECORD
    var ndx = crossfilter(sightingsData);

    var dateFormat = d3.timeParse('%Y-%m-%d');

    sightingsData.forEach(function(datapoint) {
        datapoint['eventDate'] = dateFormat(datapoint['eventDate']);
        datapoint['decimalLongitude'] = +datapoint['decimalLongitude'];
        datapoint['decimalLatitude'] = +datapoint['decimalLatitude'];
        datapoint['month'] = +datapoint['month'];
        datapoint['year'] = +datapoint['year'];
        datapoint['individualCount'] = +datapoint['individualCount'];
    });


    //CREATE DIMENSIONS
    var speciesDim = ndx.dimension(dc.pluck('vernacularName'));
    var stateDim = ndx.dimension(dc.pluck('stateProvince'));
    var monthDim = ndx.dimension(dc.pluck('month'));
    var yearDim = ndx.dimension(dc.pluck('year'));
    var allDim = ndx.dimension(function(datapoint) { return datapoint; });


    //CREATE GROUPS 
    var speciesGroup = speciesDim.group().reduceSum(function(datapoint) {
        return +datapoint.individualCount
    });


    var sightingsStateGroup = stateDim.group().reduceSum(function(datapoint) {
        return +datapoint.individualCount
    });


    //Average Sightings per Month
    var sightingsmonthGroupPlatypus = monthDim.group().reduceSum(function(datapoint) {
        if (datapoint.vernacularName === 'Duck-billed Platypus') {
            return +datapoint.individualCount;
        }
        else {
            return 0;
        }
    });

    var sightingsmonthGroupEchidna = monthDim.group().reduceSum(function(datapoint) {
        if (datapoint.vernacularName === 'Short-beaked Echidna') {
            return +datapoint.individualCount;
        }
        else {
            return 0;
        }
    });

    //Average sightings per year
    var sightingsyearGroupPlatypus = yearDim.group().reduceSum(function(datapoint) {
        if (datapoint.vernacularName === 'Duck-billed Platypus') {
            return +datapoint.individualCount;
        }
        else {
            return 0;
        }
    });

    var sightingsyearGroupEchidna = yearDim.group().reduceSum(function(datapoint) {
        if (datapoint.vernacularName === 'Short-beaked Echidna') {
            return +datapoint.individualCount;
        }
        else {
            return 0;
        }
    });



    //DC.JS Charts
    var selectSpecies = dc.selectMenu('#selectSpecies');
    var stateChart = dc.rowChart('#sightings_per_state');
    var monthChart = dc.barChart('#sightings_over_month');
    var yearChart = dc.compositeChart('#sightings_over_year');

    //CHART PROPERTIES
    var contentWidth = document.getElementById('width').offsetWidth;
    var height = 500;
    
    if (contentWidth < 960) {
        width = (0.9*contentWidth);
        height = width;
    }
    else if (contentWidth => 960) {
        width = 0.5 * contentWidth;
    }

    selectSpecies
        .dimension(speciesDim)
        .group(speciesGroup)
        .controlsUseVisibility(true);

    stateChart
        .width(width)
        .height(height)
        .margins({top: 0, right: 60, bottom: 20, left: 5})
        .dimension(stateDim)
        .group(sightingsStateGroup)
        .colors(['brown'])
        .elasticX(true)
        .labelOffsetY(10)
        .xAxis().ticks(4);



    monthChart
        .width(width)
        .height(height)
        .dimension(monthDim)
        .legend(dc.legend().x(width/4).y(15).itemHeight(13).gap(5))
        .group(sightingsmonthGroupPlatypus, 'Duck-billed Platypus')
        .stack(sightingsmonthGroupEchidna, 'Short-beaked Echidna')
        .ordinalColors(['blue', 'green'])
        .transitionDuration(500)
        .x(d3.scaleOrdinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel('Month')
        .yAxisLabel('Number of sightings')
        .renderHorizontalGridLines(true);



    yearChart
        .width(width)
        .height(height)
        .x(d3.scaleLinear().domain([2000, 2018]))
        .xUnits(dc.units.integers)
        .yAxisLabel('Number of sightings')
        .xAxisLabel('Year')
        .elasticY(true)
        .legend(dc.legend().x(width/1.6).y(15).itemHeight(13).gap(5))
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
        if (contentWidth < 992) {
            var zoom = 3;
        }
        else if (contentWidth > (992)) {
            zoom = 4;
        }


        //Draw Map of Australia
        map.setView([-29.2744, 133.7751], zoom).scrollWheelZoom.disable();
        mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 15,
                minZoom: zoom,
            }).addTo(map);


        // Add heat map data
        var geoData = [];
        _.each(allDim.top(Infinity), function(datapoint) {
            geoData.push([datapoint['decimalLatitude'], datapoint['decimalLongitude'], datapoint['individualCount']]);
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
        dcChart.on('filtered', function(chart, filter) {
            map.eachLayer(function(layer) {
                map.removeLayer(layer)
            });

            update();
        });
    });



    //RENDER CHARTS
    dc.renderAll();

}
