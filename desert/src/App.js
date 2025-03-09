import './App.css';
import AddressForm from "./AddressForm";
import GroceryMap from "./GroceryMap";
import StoreTable from "./StoreTable";
import { useState } from "react";
import { Button, Typography} from "@mui/material";

function App() {
  const [location, setLocation] = useState({ lat: 37.3022, lon: -120.4820 });
  const [stores, setStores] = useState([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState("");

  var povertyData = [];

  const handleSearch = async (lat, lon) => {
    setLocation({ lat, lon });
  };

  const openArticle = () => {
    window.open(`/article?city=${encodeURIComponent(currentCity)}`, '_blank');
  };

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px', margin: '0px' }}>
        <Typography variant="h2">Food Desert Finder</Typography>
        <Button variant="contained"
          onClick={openArticle}
        >
          Learn More About Food Deserts
        </Button>
      </div>

      <AddressForm 
        onSearch={handleSearch} 
        stores={stores} 
        setStores={setStores} 
        povertyData={povertyData} 
        setLoading={setMapLoading}
        setCurrentCity={setCurrentCity}
      />
      
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px'}}>
      <GroceryMap lat={location.lat} lon={location.lon} stores={stores} loading={mapLoading}/>
      <StoreTable stores={stores} />
      </div>
    </div>
  );
}

export default App;
