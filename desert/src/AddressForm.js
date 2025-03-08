import React, { useState } from "react";

const AddressForm = ({ onSearch }) => {
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch address suggestions (autocomplete)
  const fetchSuggestions = async (query) => {
    if (query.length < 3) return; // Prevent too many requests
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}&limit=5`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.map((item) => item.display_name));
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  };

  // Handle search button click
  const handleSearch = async () => {
    if (!address) {
      alert("Please enter an address.");
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
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
    <div style={{ padding: "10px", background: "#f4f4f4" }}>
      <input
        type="text"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
          fetchSuggestions(e.target.value);
        }}
        list="address-suggestions"
        placeholder="Enter address (e.g., Merced, CA)"
        style={{ width: "300px", padding: "5px", fontSize: "14px" }}
      />
      <datalist id="address-suggestions">
        {suggestions.map((s, index) => (
          <option key={index} value={s} />
        ))}
      </datalist>
      <button onClick={handleSearch} style={{ padding: "5px 10px", fontSize: "14px" }}>
        Search
      </button>
    </div>
  );
};

export default AddressForm;
