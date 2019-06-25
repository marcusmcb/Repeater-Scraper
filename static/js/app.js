function jsTest() {
     var url = "/api/repeaters";
     d3.json(url).then(function(response) {
          console.log(response);          
     })
}
     var myMap = L.map("map", {
          center: [36.7783, 119.4179],
          zoom: 13
     });

     L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
          attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.streets",
          accessToken: API_KEY
     }).addTo(myMap);

     var url = "/api/repeaters";

     d3.json(url, function (response) {

          console.log(response);
          console.log("Hello World")

          var heatArray = [];

          for (var i = 0; i < response.length; i++) {
               var location = response[i].location;
               let lat = response[i].latitude;
               let lng = response[i].longitude;

               if (location) {
                    heatArray.push([lat, lng]);
               }
          }

          var heat = L.heatLayer(heatArray, {
               radius: 20,
               blur: 35
          }).addTo(myMap);
          // console.log(heatArray);

     });
     d3.json(url, function(response2) {

       // Create a new marker cluster group
       var markers = L.markerClusterGroup();

       // Loop through data
       for (var i = 0; i < response2.length; i++) {

         // Set the data location property to a variable
         var location2 = response2[i].location;

         // Check for location property
         if (location2) {

           // Add a new marker to the cluster group and bind a pop-up
           markers.addLayer(L.marker([location2.coordinates[1], location2.coordinates[0]])
             .bindPopup(response2[i].descriptor));
         }

       }

       // Add our marker cluster layer to the map
       myMap.addLayer(markers);

     });

jsTest()