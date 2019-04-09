# MONOTREME SIGHTINGS ACROSS AUSTRALIA

## Overview
 
### What is this website for?
 
This is a website for people to learn about the distribution of the two species of Monotremes, the Duck-billed Platypus and the Short-beaked Echidna 
across Australia, based on submitted sightings to the Atlas of Living Australia from 2000 to 2018.
 
### What does it do?
 
This website utilizes interactive charts to showcase the amount of sightings of monotremes across states, months (January - December) and years (2000-2018),
as well as a map showing density of sightings across Australia. People can select specific species, states, months and years to suit their needs. 
 
### How does it work
 
This website uses **Javascript** and is styled with **CSS** using **Bootstrap** and the associated css files for the JS libraries. The code for the charts and 
map is located in charts.js, that uses libraries 'DC' , D3, Crossfilter, Queue, Leaflet, Leaflet-heat and underscore. A contact email was linked through EmailJS

## User Eperience Design
The website facilitates easy exploration of sightings of two different species of monotreme, using 18 years worth of sightings data. This can for example
be used by tourists (planning on) visiting Australia, researchers researching either species or someone simply wanting to know more about the distribution
of Monotremes in Australia. 

A researcher:

- Looking to see differences in seasonality between northern and southern occurances of Platypus
- Exploring a decline or incline in sightings across years, eg. for specific states
- Exploring the possible influence of climate change on the seasonality of sightings across the years

A tourist:
- Wanting to see the sightings of just the last year for a specific state, in hope to find a Platypus or Echidna themselves
- Making an itenary based on where and when these animals are sighted the most, in hopes of sighting ones themselves.


## Features
 
### Existing Features
- Single page layout
  - Three charts and one map
- Information section on how to use the page
  - Footer with further contact and copyright details, and link to Atlas of Living Australia
- Photo's showing the respective species the website is about
- Links page to other sites with information about Monotremes.


### Features Left to Implement
- None

## Tech Used

### Some the tech used includes:
- **HTML**, **CSS** and **Javascript**
  - Base languages used to create website
- [Bootstrap](http://getbootstrap.com/)
    - We use **Bootstrap** to give our project a simple, responsive layout
- [DC.JS](https://dc-js.github.io/dc.js/)
    - We use **DC.JS** to allow interactive exploration of the dataset.
- [JQuery](https://jquery.com)
    - Use **JQuery** for boostrap and displaying modal
- [D3.JS](https://d3js.org/)
    - We use **D3.JS** to allow interactive exploration of the dataset
- [Crossfilter](http://square.github.io/crossfilter/)
    - We use **Crossfilter** for multidimensional filtering of the data
- [Leaflet](https://leafletjs.com/)
    - We use **Leaflet** and the leaflet-heat plugin to make an interactive map
- [EmailJS](email.js.com)
    - We use EmailJS to link up the modal contact form to an actual e-mail address
- [JQuery](https://jquery.com/)
    - JQuery was used in support of EmailJS.

## Testing
- All code used on the site has been tested to ensure everything is working as expected
  - Functioning of the charts and map were tested by using several combinations of years, months and states, using either one of the species or both. The numbers
    displayed on the charts were checked with the numbers displayed below the photos of the species. The map distributions were checked using by selectings specific 
    states and seeing if the map only displayed data on the selected state(s).
- Site viewed and tested in the following browsers:
  - Google Chrome
  - Safari
  - Firefox
  - Opera

## Deployment

### Deployment through Cloud9
1. Create a blank workspace in your Cloud9 dashboard.
2. Get all data from github using 'https://github.com/Daanivd/data-dashboard-msp2' command in the C9 CLI
3. Open up data-dashboard/index.html and click 'Run'. Click on the link for the running app, click 'open app' to view the website.

### Deployment through GitHub
Open <https://daanivd.github.io/data-dashboard-msp2> in your browser of preference.

## Contributing
 


## Credits

### Media
- The photos used on this website are by [Daniel van Duinkerken](danielvandphoto.com)
- The Atlas of Living Australia Logo was pulled off of <https://www.ala.org.au/>

### Information/Data
- The information/data used to create this site was from a number of sources
    - Wikipedia webpage on [Monotremes](https://en.wikipedia.org/wiki/Monotreme) for information
    - Data was obtained through the [Atlas of Living Australia](https://downloads.ala.org.au). The 'Mammal' dataset was downloaded and filtered for the years 
        2000-2018 using the program 'R'.

### Additional sources
[Bootstrap Theme](https://bootswatch.com/3/superhero/)

[DC.JS examples](https://dc-js.github.io/dc.js/examples/)

[Leaflet-DC](http://adilmoujahid.com/posts/2016/08/interactive-data-visualization-geospatial-d3-dc-leaflet-python/)

[Close Modal after submit](https://stackoverflow.com/questions/29754902/close-bootstrap-modal-after-submit)

[Add x/y labels to rowChart](https://www.intothevoid.io/data-visualization/row-chart-axis-labels-dc-js/)

[How to make dc-js-charts responsive](https://stackoverflow.com/questions/22292369/how-to-make-the-dc-js-charts-responsive)