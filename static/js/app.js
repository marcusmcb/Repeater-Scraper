function jsTest() {
     var url = "/api/repeaters";
     d3.json(url).then(function (response) {
          console.log(response[0].latitude);

          var myMap = L.map("map", {
               center: [34.0522, -118.2437],
               zoom: 9
          });

          L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
               attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
               maxZoom: 18,
               id: "mapbox.streets",
               accessToken: API_KEY
          }).addTo(myMap);

          for (var i = 0; i < response.length; i++) {
               L.marker([response[i].latitude, response[i].longitude])
                    .addTo(myMap)
          }
     })
}

jsTest();