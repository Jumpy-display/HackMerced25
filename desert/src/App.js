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

  const openArticle = () => {
    window.open('/article', '_blank');
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <h1>Food Desert Finder</h1>
        <button 
          onClick={openArticle}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Learn More About Food Deserts
        </button>
      </div>
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
