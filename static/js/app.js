// assign variable to grab data from api endpoint
let url = "/api/repeaters";

// function to built table on site load
function buildTable() {

     // function to build individual table rows and cells
     d3.json(url).then(function (response) {
          let tbody = d3.select('tbody');
          tbody.html("");
          response.forEach((item) => {
               let row = tbody.append("tr");
               let cell1 = row.append("td")
               cell1.text(item.call_sign);
               let cell2 = row.append("td")
               cell2.text(item.location)
               let cell3 = row.append("td")
               cell3.text(item.frequency)
               let cell4 = row.append("td")
               cell4.text(item.county)
               let cell5 = row.append("td")
               cell5.text(item.usage)
          })
     })
}

// renders table on site load
buildTable();

// function to build Plotly bar chart
function buildGraph() {

     d3.json(url).then(function (response) {

          // reducer to calculate total # of repeaters by county as well as their usage (open or closed)
          let oCount = response.reduce(function (n, response) { return n + (response.county == "Orange") }, 0)
          let oOpen = response.reduce(function (n, response) { return n + (response.county == "Orange" && response.usage == "OPEN") }, 0)
          let oClosed = response.reduce(function (n, response) { return n + (response.county == "Orange" && response.usage == "CLOSED") }, 0)
          let oPrivate = response.reduce(function (n, response) { return n + (response.county == "Orange" && response.usage == "PRIVATE") }, 0)

          let laCount = response.reduce(function (n, response) { return n + (response.county == "Los Angeles") }, 0)
          let laOpen = response.reduce(function (n, response) { return n + (response.county == "Los Angeles" && response.usage == "OPEN") }, 0)
          let laClosed = response.reduce(function (n, response) { return n + (response.county == "Los Angeles" && response.usage == "CLOSED") }, 0)
          let laPrivate = response.reduce(function (n, response) { return n + (response.county == "Los Angeles" && response.usage == "PRIVATE") }, 0)

          let rCount = response.reduce(function (n, response) { return n + (response.county == "Riverside") }, 0)
          let rOpen = response.reduce(function (n, response) { return n + (response.county == "Riverside" && response.usage == "OPEN") }, 0)
          let rClosed = response.reduce(function (n, response) { return n + (response.county == "Riverside" && response.usage == "CLOSED") }, 0)
          let rPrivate = response.reduce(function (n, response) { return n + (response.county == "Riverside" && response.usage == "PRIVATE") }, 0)

          let vCount = response.reduce(function (n, response) { return n + (response.county == "Ventura") }, 0)
          let vOpen = response.reduce(function (n, response) { return n + (response.county == "Ventura" && response.usage == "OPEN") }, 0)
          let vClosed = response.reduce(function (n, response) { return n + (response.county == "Ventura" && response.usage == "CLOSED") }, 0)
          let vPrivate = response.reduce(function (n, response) { return n + (response.county == "Ventura" && response.usage == "PRIVATE") }, 0)

          let sbCount = response.reduce(function (n, response) { return n + (response.county == "San Bernardino") }, 0)
          let sbOpen = response.reduce(function (n, response) { return n + (response.county == "San Bernardino" && response.usage == "OPEN") }, 0)
          let sbClosed = response.reduce(function (n, response) { return n + (response.county == "San Bernardino" && response.usage == "CLOSED") }, 0)
          let sbPrivate = response.reduce(function (n, response) { return n + (response.county == "San Bernardino" && response.usage == "PRIVATE") }, 0)

          let sdCount = response.reduce(function (n, response) { return n + (response.county == "San Diego") }, 0)
          let sdOpen = response.reduce(function (n, response) { return n + (response.county == "San Diego" && response.usage == "OPEN") }, 0)
          let sdClosed = response.reduce(function (n, response) { return n + (response.county == "San Diego" && response.usage == "CLOSED") }, 0)
          let sdPrivate = response.reduce(function (n, response) { return n + (response.county == "San Diego" && response.usage == "PRIVATE") }, 0)

          // Plotly trace for total # of repeaters for each county
          let trace1 = {
               x: ['Los Angeles', 'Orange', 'Riverside', 'San Bernardino', 'Venutra', 'San Diego'],
               y: [laCount, oCount, rCount, sbCount, vCount, sdCount],
               name: "Total Repeaters",
               type: 'bar',
               marker: {
                    color: 'orange'
               }
          }

          // Plotly trace for total # of open repeaters
          let trace2 = {
               x: ['Los Angeles', 'Orange', 'Riverside', 'San Bernardino', 'Venutra', 'San Diego'],
               y: [laOpen, oOpen, rOpen, sbOpen, vOpen, sdOpen],
               name: "Open Repeaters",
               type: 'bar',
               marker: {
                    color: 'green'
               }
          }

          // Plotly trace for total # of closed repeaters
          let trace3 = {
               x: ['Los Angeles', 'Orange', 'Riverside', 'San Bernardino', 'Venutra', 'San Diego'],
               y: [laClosed, oClosed, rClosed, sbClosed, vClosed, sdClosed],
               name: "Closed Repeaters",
               type: 'bar',
               marker: {
                    color: 'red'
               }
          }

          // Plotly trace for total # of private repeaters
          let trace4 = {
               x: ['Los Angeles', 'Orange', 'Riverside', 'San Bernardino', 'Venutra', 'San Diego'],
               y: [laPrivate, oPrivate, rPrivate, sbPrivate, vPrivate, sdPrivate],
               name: "Private Repeaters",
               type: 'bar',
               marker: {
                    color: 'grey'
               }
          }

          let layout = {
               title: {
                    text: "Repeaters By County & Status"
               }
          }

          // array for trace values
          let data = [trace1, trace2, trace3, trace4];

          // renders Plotly graph
          Plotly.newPlot('graph', data, layout)

     })
}

buildGraph();

// variables for marker colors from Leaflet-Markers-Colors
let redIcon = new L.Icon({
     iconUrl: 'static/img/marker-icon-2x-red.png',
     shadowUrl: 'static/img/marker-shadow.png',
     iconSize: [25, 41],
     iconAnchor: [12, 41],
     popupAnchor: [1, -34],
     shadowSize: [41, 41]
});

let greenIcon = new L.Icon({
     iconUrl: 'static/img/marker-icon-2x-green.png',
     shadowUrl: 'static/img/marker-shadow.png',
     iconSize: [25, 41],
     iconAnchor: [12, 41],
     popupAnchor: [1, -34],
     shadowSize: [41, 41]
});

let blackIcon = new L.Icon({
     iconUrl: 'static/img/marker-icon-2x-black.png',
     shadowUrl: 'static/img/marker-shadow.png',
     iconSize: [25, 41],
     iconAnchor: [12, 41],
     popupAnchor: [1, -34],
     shadowSize: [41, 41]
});

// function to build transmitter map on site load
function buildMap() {

     // function to build transmitter map
     d3.json(url).then(function (response) {

          let redMarkers = [];
          let greenMarkers = [];
          let blackMarkers = [];

          // for loop to pull out coordinates and generate popup with added info when clicked
          for (let i = 0; i < response.length; i++) {

               // added random number variable to offset lat/lng for locations with multiple transmitters
               x = Math.floor(Math.random() * .002) + .008

               // variable to set link within anchor tag of each marker               
               let infoLink = "https://www.hamqth.com/" + response[i].call_sign

               // if/else logic to determine marker color based on current usage status
               if (response[i].usage === "OPEN") {
                    greenMarkers.push(
                         L.marker([(response[i].latitude + x), (response[i].longitude - x)], { icon: greenIcon })
                              .bindPopup("<h4><a href='" + infoLink + "'>" + response[i].call_sign + " / " + response[i].frequency + " MHz" + "</a></h4><hr><h6>" + response[i].location + " (" + response[i].usage + ")" + "</h6>")
                    )

               } else if (response[i].usage === "CLOSED") {
                    redMarkers.push(
                         L.marker([(response[i].latitude - x), (response[i].longitude + x)], { icon: redIcon })
                              .bindPopup("<h4><a href='" + infoLink + "'>" + response[i].call_sign + " / " + response[i].frequency + " MHz" + "</a></h4><hr><h6>" + response[i].location + " (" + response[i].usage + ")" + "</h6>")
                    )

                    // applies black markers to transmitters marked "PRIVATE"
               } else {
                    blackMarkers.push(
                         L.marker([(response[i].latitude - x), (response[i].longitude - x)], { icon: blackIcon })
                              .bindPopup("<h4><a href='" + infoLink + "'>" + response[i].call_sign + " / " + response[i].frequency + " MHz" + "</a></h4><hr><h6>" + response[i].location + " (" + response[i].usage + ")" + "</h6>")
                    )
               }
          }

          // add base layer to map
          let mainMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
               attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
               maxZoom: 18,
               id: "mapbox.streets",
               accessToken: API_KEY
          });

          let darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
               attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
               maxZoom: 18,
               id: "mapbox.dark",
               accessToken: API_KEY
          });

          let openX = L.layerGroup(greenMarkers);
          let closedX = L.layerGroup(redMarkers);
          let privateX = L.layerGroup(blackMarkers);

          let baseMap = {
               "Main Map": mainMap,
               "Dark Map": darkMap
          };

          let overlayMaps = {
               "Open Repeaters": openX,
               "Closed Repeaters": closedX,
               "Private Repeaters": privateX
          };

          // render map to html map div
          let myMap = L.map("map", {
               center: [34.0522, -118.2437],
               zoom: 8,
               minZoom: 7,
               layers: [mainMap, openX, closedX, privateX]
          });

          L.control.layers(baseMap, overlayMaps, {
               collapsed: false
          }).addTo(myMap)
     })
}

buildMap();

// function to search table by city
function citySearch() {
     var input, filter, table, tr, td, i, txtValue;
     input = document.getElementById("cityLookup")
     filter = input.value.toUpperCase();
     table = document.getElementById("mainTable")
     tr = table.getElementsByTagName("tr");
     for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[1];
          if (td) {
               txtValue = td.textContent || td.innerText;
               if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
               } else {
                    tr[i].style.display = "none";
               }
          }
     }
}

// function to search by county
function countySearch() {
     var input, filter, table, tr, td, i, txtValue;
     input = document.getElementById("countyLookup")
     filter = input.value.toUpperCase();
     table = document.getElementById("mainTable")
     tr = table.getElementsByTagName("tr");
     for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[3];
          if (td) {
               txtValue = td.textContent || td.innerText;
               if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
               } else {
                    tr[i].style.display = "none";
               }
          }
     }
}

// function to search by status/usage
function statusSearch() {
     var input, filter, table, tr, td, i, txtValue;
     input = document.getElementById("statusLookup")
     filter = input.value.toUpperCase();
     table = document.getElementById("mainTable")
     tr = table.getElementsByTagName("tr");
     for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[4];
          if (td) {
               txtValue = td.textContent || td.innerText;
               if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
               } else {
                    tr[i].style.display = "none";
               }
          }
     }
}