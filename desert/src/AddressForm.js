import { useState } from "react";
import { Card, CardContent, Button, TextField, Container, Typography } from "@mui/material";
import React, { useContext } from "react";
import { DataContext } from "./DataContext";

function AddressForm() {

  const { data, setData } = useContext(DataContext);
  
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
    setData(address);
    console.log("Address saved:", data);
    setSubmitted(true);
  };

  const handleUnsubmit = () => {
    setSubmitted(false);
  }

  return (
    <Container style={{ marginTop: "2rem" }}>
      <Card variant="outlined" style={{ padding: "1.5rem" }}>
        <CardContent>
          {!submitted ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <TextField label="Street" name="street" variant="outlined" fullWidth onChange={handleAddressChange} />
              <TextField label="City" name="city" variant="outlined" fullWidth onChange={handleAddressChange} />
              <TextField label="State" name="state" variant="outlined" fullWidth onChange={handleAddressChange} />
              <TextField label="ZIP Code" name="zipcode" variant="outlined" fullWidth onChange={handleAddressChange} />
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
