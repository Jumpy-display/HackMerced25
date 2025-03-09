import React from "react";
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StoreTable = ({ stores }) => {
  return (
    <div style={{ height: "60vh", padding: "10px", margin: "30px" }}>
      <Typography style={{ padding: "20px"}} variant="h4">Grocery Stores Near You</Typography>
      <div>
      <TableContainer style={{height: "48vh", overflowY: "auto"}} component={Paper}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead sx={{position: 'sticky'}}>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Distance (miles)</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stores.map((store, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{store.name}</StyledTableCell>
              <StyledTableCell>{store.distance}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
      </div>
    </div>
  );
};

export default StoreTable;
