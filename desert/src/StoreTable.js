import React from "react";
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";

const StoreTable = ({ stores }) => {
  return (
    <div style={{ height: "60vh", overflowY: "auto", padding: "10px", margin: "30px" }}>
      <Typography style={{ padding: "20px"}} variant="h4">Grocery Stores Near You</Typography>
      <Table stickyheader style={{ width: "85%", borderCollapse: "collapse", margin: "auto"}}>
        <TableHead>
          <TableRow>
            <TableCell style={{ border: "3px solid #ccc", padding: "8px", background: "#f4f4f4" }}>Name</TableCell>
            <TableCell style={{ border: "3px solid #ccc", padding: "8px", background: "#f4f4f4" }}>Distance (miles)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stores.map((store, index) => (
            <TableRow key={index}>
              <TableCell style={{ border: "3px solid #ccc", padding: "8px" }}>{store.name}</TableCell>
              <TableCell style={{ border: "3px solid #ccc", padding: "8px" }}>{store.distance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StoreTable;
