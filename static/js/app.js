function jsTest() {

     // api endpoint to grab JSON data
     var url = "/api/repeaters";

     // function to build transmitter map
     d3.json(url).then(function (response) {
          console.log(response[0].latitude);

          // render map to html map div
          var myMap = L.map("map", {
               center: [34.0522, -118.2437],
               zoom: 8
          });

          L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
               attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
               maxZoom: 18,
               id: "mapbox.streets",
               accessToken: API_KEY
          }).addTo(myMap);

          // for loop to pull out coordinates and generate popup with added info when clicked
          for (var i = 0; i < response.length; i++) {
               L.marker([response[i].latitude, response[i].longitude])
                    .bindPopup("<h4>" + response[i].call_sign + " / " + response[i].frequency + "</h4><hr><h6>" + response[i].location + " (" + response[i].usage + ")" + "</h6>")
                    .addTo(myMap)
          }
     })
}

jsTest();