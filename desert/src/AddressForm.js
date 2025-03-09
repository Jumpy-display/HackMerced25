import { useState } from "react";
import { Card, CardContent, Button, TextField, Container } from "@mui/material";
import { retrieveGeography } from "./AddressLookup.js";
import  App from "./App";

function AddressForm( {onSearch, stores} ) {

  const [povertyData, setPovertyData] = useState([]);

  var lookupData = null;

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

    handleSearch();

    let lookupData = await retrieveGeography(tempAddress);

    console.log(lookupData);
	
	//After the fetch we put the data there
    fetch(`http://localhost:5000/api/places/${lookupData["lookupName"]}`)
      .then((res) => res.json())
      .then((data) => workWithPovertyData(data))
      .catch((err) => console.error(err));
  };
  
  function workWithPovertyData(info){
	  setPovertyData(info);
	  let pRate = Number(povertyData.povertyRate);
	  console.log(pRate);
	  console.log(`The number of stores in your area is ${stores.length}`);
	  
	  //Check if the poverty rate is greater than 19 and there are NO stores near you.
	  if(pRate >= 19 && stores.length == 0){
		  //Generate a button to link to a new page!
		  alert("You live in a food desert!");
	  }else{
		  alert("You do NOT live in a food desert.");
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
