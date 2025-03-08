import React from "react";

const StoreTable = ({ stores }) => {
  return (
    <div style={{ height: "30vh", overflowY: "auto", padding: "10px" }}>
      <h2>Grocery Stores within 1 Mile</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px", background: "#f4f4f4" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "8px", background: "#f4f4f4" }}>Distance (miles)</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{store.name}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{store.distance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreTable;