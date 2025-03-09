import { useState } from "react";
import { Card, CardContent, Button, TextField, Container } from "@mui/material";
import { retrieveGeography } from "./AddressLookup.js";
import { fetchStores } from "./GroceryMap";

function AddressForm({ onSearch, stores, setStores, povertyData }) {

  const setPovertyData = (p) => {
    povertyData = p;
  };

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: ""
  });

  const cleanAddress = (a) => {
    return {
      street: `${a.street.replace(/[^\w\s]|_/g, "")}`,
      city: `${a.city.replace(/[^\w\s]|_/g, "")}`,
      state: `${a.state.replace(/[^\w\s]|_/g, "")}`,
      zipcode: `${a.zipcode.replace(/[^\w\s]|_/g, "")}`
    };
  }

  const [submitted, setSubmitted] = useState(false);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  async function handleSubmit() {
    setSubmitted(true);

    let tempAddress = cleanAddress(address);

    let latlon = await handleSearch();

    console.log(latlon);

    let lookupData = await retrieveGeography(tempAddress);
    if(lookupData === null){
      return;
    }

    console.log(lookupData);

    //After the fetch we put the data there
    fetch(`http://localhost:5000/api/places/${lookupData["lookupName"]}`)
      .then((res) => res.json())
      .then((data) => workWithPovertyData(data, latlon, setStores))
      .catch((err) => console.error(err));
  };

  async function workWithPovertyData(info, latlon, setStores) {
    let currStores = await fetchStores(latlon[0], latlon[1], setStores);
    setPovertyData(info);
    console.log(povertyData);
    let pRate = Number(povertyData.povertyRate);
    console.log(pRate);
    console.log(`The number of stores in your area is ${currStores.length}`);

    //Check if the poverty rate is greater than 19 and there are NO stores near you.
    if (pRate >= 19 && currStores.length === 0) {
      //Generate a button to link to a new page!
      alert("YOU LIVE IN A FOOD DESERT!");
    } else {
      alert("YOU DO NOT LIVE IN A FOOD DESERT!");
    }

  }

  const handleUnsubmit = () => {
    setSubmitted(false);
  }


  const handleSearch = async () => {
    if (!address) {
      alert("Please enter an address.");
      return;
    }

    let tempAddress = cleanAddress(address);

    const fullAddress = `${tempAddress.street}, ${tempAddress.city}, ${tempAddress.state} ${tempAddress.zipcode}`.trim();

    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(fullAddress)}&api_key=67ccd5cee0c03893031572fbzb29295`;
    console.log(fullAddress);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        onSearch(parseFloat(data[0].lat), parseFloat(data[0].lon));
      } else {
        alert("Address not found.");
      }
      return [data[0].lat, data[0].lon];
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return;
  };

  return (
    <Container style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Card variant="outlined" style={{ padding: "1.5rem" }}>
        <CardContent>
          {!submitted ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <TextField defaultValue={`${address.street}`} label="Street" name="street" variant="filled" fullWidth onChange={handleAddressChange} />
              <TextField defaultValue={`${address.city}`} label="City" name="city" variant="filled" fullWidth onChange={handleAddressChange} />
              <TextField defaultValue={`${address.state}`} label="State" name="state" variant="filled" fullWidth onChange={handleAddressChange} />
              <TextField defaultValue={`${address.zipcode}`} label="ZIP Code" name="zipcode" variant="filled" fullWidth onChange={handleAddressChange} />
              <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>Submit</Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Button variant="contained" color="primary" onClick={handleUnsubmit} fullWidth>Change Address</Button>
            </div>

          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default AddressForm;
