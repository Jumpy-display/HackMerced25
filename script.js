document.addEventListener('DOMContentLoaded', function () {
    // Global variables
    var map, groceryLayer;
    
    // 1 mile in meters (~1609.34 meters)
    var radiusMeters = 1609.34;
    
    // Default center (Merced, CA)
    var defaultLat = 37.3022;
    var defaultLon = -120.4820;
    
    // Initialize the map
    map = L.map('map').setView([defaultLat, defaultLon], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);
    
    // Layer group for markers
    groceryLayer = L.layerGroup().addTo(map);
    
    // Function to fetch grocery stores from Overpass API and update the map and table.
    function fetchAndDisplayStores(lat, lon) {
      // Clear existing markers and table rows.
      groceryLayer.clearLayers();
      document.querySelector("#stores-table tbody").innerHTML = "";
      
      var givenPoint = L.latLng(lat, lon);
      
      // Add a red marker for the given point.
      L.circleMarker(givenPoint, {
        radius: 8,
        color: 'red',
        fillColor: 'red',
        fillOpacity: 1
      }).addTo(groceryLayer)
        .bindPopup("Given Point");
      
      // Build the Overpass API query using the "around" clause.
      var query = `
        [out:json];
        (
          node["shop"="supermarket"](around:${radiusMeters},${lat},${lon});
          way["shop"="supermarket"](around:${radiusMeters},${lat},${lon});
          relation["shop"="supermarket"](around:${radiusMeters},${lat},${lon});
        );
        out center;
      `;
      var url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          var nearbyStores = [];
          
          data.elements.forEach(function(element) {
            let storeLat, storeLon;
            if (element.type === "node") {
              storeLat = element.lat;
              storeLon = element.lon;
            } else if ((element.type === "way" || element.type === "relation") && element.center) {
              storeLat = element.center.lat;
              storeLon = element.center.lon;
            }
            
            if (storeLat && storeLon) {
              var storePoint = L.latLng(storeLat, storeLon);
              var distanceMeters = givenPoint.distanceTo(storePoint);
              var distanceMiles = distanceMeters / 1609.34;
              // Only include stores within 1 mile.
              if (distanceMiles <= 1) {
                L.circleMarker(storePoint, {
                  radius: 6,
                  color: 'green',
                  fillColor: 'green',
                  fillOpacity: 1
                }).addTo(groceryLayer)
                  .bindPopup("Grocery Store: " + (element.tags && element.tags.name ? element.tags.name : "Unnamed") +
                             "<br>Distance: " + distanceMiles.toFixed(2) + " miles");
                
                nearbyStores.push({
                  name: (element.tags && element.tags.name) ? element.tags.name : "Unnamed",
                  distance: distanceMiles.toFixed(2)
                });
              }
            }
          });
          
          // Sort the stores by distance (closest first).
          nearbyStores.sort((a, b) => a.distance - b.distance);
          
          // Populate the table.
          var tbody = document.querySelector("#stores-table tbody");
          nearbyStores.forEach(store => {
            var row = document.createElement("tr");
            
            var cellName = document.createElement("td");
            cellName.textContent = store.name;
            row.appendChild(cellName);
            
            var cellDistance = document.createElement("td");
            cellDistance.textContent = store.distance;
            row.appendChild(cellDistance);
            
            tbody.appendChild(row);
          });
        })
        .catch(err => console.error("Error fetching grocery store data: " + err));
    }
    
    // Set up the search button event listener for address input.
    document.getElementById("search-btn").addEventListener("click", function() {
      var address = document.getElementById("address").value;
      if (!address) {
        alert("Please enter an address.");
        return;
      }
      
      // Geocode the address using Nominatim.
      var geocodeUrl = "https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(address);
      
      fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            var lat = parseFloat(data[0].lat);
            var lon = parseFloat(data[0].lon);
            // Move the map view to the new coordinates.
            map.setView([lat, lon], 14);
            // Fetch and display nearby grocery stores.
            fetchAndDisplayStores(lat, lon);
          } else {
            alert("Address not found. Please try a different address.");
          }
        })
        .catch(err => console.error("Geocoding error: " + err));
    });
    
    // Set up address auto-complete using Nominatim suggestions.
    document.getElementById('address').addEventListener('input', function(){
      let query = this.value;
      if(query.length < 3) return; // Wait until at least 3 characters are entered
      let url = "https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=" + encodeURIComponent(query) + "&limit=5";
      fetch(url)
        .then(response => response.json())
        .then(data => {
          let dataList = document.getElementById("address-suggestions");
          dataList.innerHTML = "";
          data.forEach(item => {
            let option = document.createElement("option");
            option.value = item.display_name;
            dataList.appendChild(option);
          });
        })
        .catch(err => console.error("Autocomplete error: " + err));
    });
    
    // Run an initial search using the default coordinates.
    fetchAndDisplayStores(defaultLat, defaultLon);
  });
  