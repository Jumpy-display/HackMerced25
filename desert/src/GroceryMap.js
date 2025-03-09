import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up the default icon for markers
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3959; //radius of Earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
};

function ChangeMapView({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
}

const GroceryMap = ({ lat, lon, stores, setStores }) => {
  const radiusMeters = 1609.34; //1 mile in meters

  const fetchStores = async (lat, lon) => {
    const query = `
      [out:json];
      (
        node["shop"="supermarket"](around:${radiusMeters},${lat},${lon});
        way["shop"="supermarket"](around:${radiusMeters},${lat},${lon});
        relation["shop"="supermarket"](around:${radiusMeters},${lat},${lon});
      );
      out center;
    `;
    
    try {
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      const parsedStores = data.elements
        .map(element => {
          const storeLat = element.type === "node" ? element.lat : element.center?.lat;
          const storeLon = element.type === "node" ? element.lon : element.center?.lon;
          
          if (storeLat && storeLon) {
            return {
              name: element.tags?.name || "Unnamed Store",
              distance: calculateDistance(lat, lon, storeLat, storeLon),
              lat: storeLat,
              lon: storeLon
            };
          }
          return null;
        })
        .filter(Boolean);
        
      setStores(parsedStores);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  useEffect(() => {
    fetchStores(lat, lon);
  }, [lat, lon]);

  return (
    <MapContainer center={[lat, lon]} zoom={14} style={{ height: "60vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <CircleMarker center={[lat, lon]} radius={8} color="red" fillOpacity={1} />
      {stores.map((store, index) => (
        <Marker key={index} position={[store.lat, store.lon]}>
          <Popup>{store.name}</Popup>
        </Marker>
      ))}
      <ChangeMapView lat={lat} lon={lon} />
    </MapContainer>
  );
};

export default GroceryMap;
