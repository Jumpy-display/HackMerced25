import './App.css';
import AddressForm from "./AddressForm";
import GroceryMap from "./GroceryMap";
import StoreTable from "./StoreTable";
import { useState } from "react";

function App() {
  const [location, setLocation] = useState({ lat: 37.3022, lon: -120.4820 });
  const [stores, setStores] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);

  var povertyData = [];

  const handleSearch = async (lat, lon) => {
    setLocation({ lat, lon });
  };

  return (
    <div className="App">
      <AddressForm onSearch={handleSearch} stores={stores} setStores={setStores} povertyData={povertyData} setLoading={setMapLoading}/>
      <GroceryMap
        lat={location.lat}
        lon={location.lon}
        stores={stores}
        loading={mapLoading}
      />
      <StoreTable stores={stores} />
    </div>
  );
}

export default App;
