function jsTest() {
     var url = "/api/repeaters";
     d3.json(url).then(function(response) {
          console.log(response);          
     })
}

jsTest();