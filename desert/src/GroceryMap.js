import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GroceryMap = ({ lat, lon }) => {
  const [stores, setStores] = useState([]);
  const radiusMeters = 1609.34;

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
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const parsedStores = data.elements.map((element) => {
        const storeLat = element.type === "node" ? element.lat : element.center?.lat;
        const storeLon = element.type === "node" ? element.lon : element.center?.lon;
        return storeLat && storeLon ? { lat: storeLat, lon: storeLon, name: element.tags?.name || "Unnamed" } : null;
      }).filter(Boolean);
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
    </MapContainer>
  );
};

export default GroceryMap;
