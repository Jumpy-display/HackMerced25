import './App.css';
import AddressForm from "./AddressForm";
import GroceryMap from "./GroceryMap";
import StoreTable from "./StoreTable";
import { useState } from "react";

function App() {
  const [location, setLocation] = useState({ lat: 37.3022, lon: -120.4820 });
  const [stores, setStores] = useState([]);

  return (
    <div className="App">
      <AddressForm onSearch={(lat, lon) => setLocation({ lat, lon })}/>
      <GroceryMap lat={location.lat} lon={location.lon}/>
      <StoreTable stores={stores} />
    </div>
  );
}

export default App;