// variables for marker colors
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

function jsTest() {

     // api endpoint to grab JSON data
     let url = "/api/repeaters";

     // function to build transmitter map
     d3.json(url).then(function (response) {
          console.log(response[0].latitude);

          // render map to html map div
          let myMap = L.map("map", {
               center: [34.0522, -118.2437],
               zoom: 8,
               minZoom: 7
          });

          L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
               attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
               maxZoom: 18,
               id: "mapbox.streets",
               accessToken: API_KEY
          }).addTo(myMap);

          // for loop to pull out coordinates and generate popup with added info when clicked
          for (let i = 0; i < response.length; i++) {

               // if/else logic to determine marker color based on current usage status
               if (response[i].usage === "OPEN") {
                    L.marker([response[i].latitude, response[i].longitude], { icon: greenIcon })
                         .bindPopup("<h4>" + response[i].call_sign + " / " + response[i].frequency + "</h4><hr><h6>" + response[i].location + " (" + response[i].usage + ")" + "</h6>")
                         .addTo(myMap)
               } else {
                    L.marker([response[i].latitude, response[i].longitude], { icon: redIcon })
                         .bindPopup("<h4>" + response[i].call_sign + " / " + response[i].frequency + "</h4><hr><h6>" + response[i].location + " (" + response[i].usage + ")" + "</h6>")
                         .addTo(myMap)
               }
          }
     })
}

jsTest();