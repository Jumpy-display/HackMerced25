import './App.css';
import AddressForm from "./AddressForm";
import GroceryMap from "./GroceryMap";
import StoreTable from "./StoreTable";
import { useState } from "react";
import { Button, Typography, Container, Card, CardContent } from "@mui/material";

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


      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px' }}>
        <AddressForm onSearch={handleSearch}
          stores={stores}
          setStores={setStores}
          povertyData={povertyData}
          setLoading={setMapLoading}
          setCurrentCity={setCurrentCity}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px' }}>
        <GroceryMap
          lat={location.lat}
          lon={location.lon}
          stores={stores}
          loading={mapLoading}
        />
        <StoreTable stores={stores} />
      </div>
      <div>
        <Container
          style={{
            marginTop: "2rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "right",
            width: "70%",
          }}>
          <Card variant="outlined" style={{ padding: "1.5rem" }}>
            <CardContent>
              <Typography>
                A food desert is an area with limited access to affordable, nutritious food, often forcing residents to rely on unhealthy options. Common in low-income urban and rural areas, food deserts contribute to health issues like obesity and diabetes. The USDA defines them based on distance to supermarkets and income levels. Efforts to combat food deserts include community gardens, mobile markets, and grocery store initiatives that provide fresh, healthy food options. Addressing food deserts is essential for promoting health equity and better nutrition for all.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </div>
    </div>
  );
}

export default App;
