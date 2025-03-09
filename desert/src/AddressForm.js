import { useState } from "react";
import { Card, CardContent, Button, TextField, Container } from "@mui/material";
import { retrieveGeography } from "./AddressLookup.js"

function AddressForm( {onSearch} ) {
  
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setAddress({
      street: `${address.street.replaceAll(",","")}`,
      city: `${address.city.replaceAll(",","")}`,
      state: `${address.state.replaceAll(",","")}`,
      zipcode: `${address.zipcode.replaceAll(",","")}`
    });

    handleSearch();
    retrieveGeography(address);
  };

  const handleUnsubmit = () => {
    setSubmitted(false);
  }


  const handleSearch = async () => {
    if (!address) {
      alert("Please enter an address.");
      return;
    }
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipcode}`.trim();

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
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  return (
    <Container style={{ marginTop: "2rem", marginBottom: "2rem"}}>
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
            <div style={{ display: "flex", flexDirection: "column"}}>
              <Button variant="contained" color="primary" onClick={handleUnsubmit} fullWidth>Change Address</Button>
            </div>

          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default AddressForm;
