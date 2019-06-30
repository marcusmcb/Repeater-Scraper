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

     // api endpoint to grab JSON data
     let url = "/api/repeaters";

     // function to build transmitter map
     d3.json(url).then(function (response) {

          // set empty array to hold leaflet markers for each repeater's usage type
          let redMarkers = [];
          let greenMarkers = [];
          let blackMarkers = [];

          // for loop to pull out coordinates and generate popup with added info when clicked
          for (let i = 0; i < response.length; i++) {

               // added random number variable to offset lat/lng for locations with multiple transmitters
               x = Math.floor(Math.random() * .002) + .008

               // variable to set link within anchor tag of each marker               
               let infoLink = "https://www.hamqth.com/" + response[i].call_sign

               // if/else logic to determine marker color based on current usage status and push to the corresponding leaflet layer
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

          // add dark layer to amp
          let darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
               attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
               maxZoom: 18,
               id: "mapbox.dark",
               accessToken: API_KEY
          });

          // assigns marker arrays to leaflet layers
          let openX = L.layerGroup(greenMarkers);
          let closedX = L.layerGroup(redMarkers);
          let privateX = L.layerGroup(blackMarkers);

          // sets up basemap options
          let baseMap = {
               "Main Map": mainMap,
               "Dark Map": darkMap
          };

          // sets up layer options
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

          // set up layer controls for leaflet map
          L.control.layers(baseMap, overlayMaps, {
               collapsed: false
          }).addTo(myMap)
     })
}

// function to built table on site load
function buildTable() {

     // set variable to grab JSON data from api endpoint
     let url = "/api/repeaters";

     // function to build individual table rows and cells
     d3.json(url).then(function (response) {
          console.log(response);
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

// renders map on site load
buildMap();