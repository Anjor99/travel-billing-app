import { useEffect, useState } from "react";

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import Grid from "@mui/material/Grid";

import Button from "@mui/material/Button";

import Box from "@mui/material/Box";

import { getBills }
  from "../../../api/bills";

import { useNavigate }
  from "react-router-dom";

function BillsList() {

  const [bills, setBills] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filteredBills, setFilteredBills] =
    useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    fetchBills();

  }, []);

  useEffect(() => {

    applyFilters();

  }, [search, bills]);

  // Fetch bills

  const fetchBills =
    async () => {

      try {

        const data =
          await getBills();

        const list =
          Array.isArray(data)
            ? data
            : [];

        setBills(list);
        setFilteredBills(list);

      }
      catch (err) {

        console.error(err);

      }

  };

  // Apply search filter

  const applyFilters = () => {

    let filtered =
      bills.filter((bill) =>

        bill.customer_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
        ||

        bill.bill_no
          ?.toString()
          .includes(search)

      );

    setFilteredBills(filtered);

  };

  // Aggregations

  const totalBills =
    filteredBills.length;

  const totalAmount =
    filteredBills.reduce(

      (sum, bill) =>
        sum + bill.total_amount,

      0

    );

  return (

    <Container
      maxWidth="sm"
      sx={{ mt: 2 }}
    >

      {/* Page Title */}

      <Typography
        variant="h5"
        sx={{ mb: 2 }}
      >

        Bills

      </Typography>

      {/* Search */}

      <TextField
        label="Search customer / bill no"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* Aggregations */}

      <Grid container spacing={2} sx={{ mb: 2 }}>

        <Grid item xs={6}>

          <Paper sx={{ p: 2 }}>

            <Typography variant="body2">

              Total Bills

            </Typography>

            <Typography variant="h6">

              {totalBills}

            </Typography>

          </Paper>

        </Grid>

        <Grid item xs={6}>

          <Paper sx={{ p: 2 }}>

            <Typography variant="body2">

              Total Amount

            </Typography>

            <Typography variant="h6">

              ₹ {totalAmount}

            </Typography>

          </Paper>

        </Grid>

      </Grid>

      {/* Bills Cards */}

      {filteredBills.map((bill) => (

        <Card
          key={bill.id}
          sx={{
            mb: 2,
            cursor: "pointer"
          }}

          onClick={() =>
            navigate(
              `/bills/${bill.id}`
            )
          }
        >

          <CardContent>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between"
              }}
            >

              <Typography
                variant="subtitle1"
              >

                Bill #{bill.bill_no}

              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600
                }}
              >

                ₹ {bill.total_amount}

              </Typography>

            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
            >

              {bill.customer_name}

            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >

              {bill.bill_date}

            </Typography>

          </CardContent>

        </Card>

      ))}

    </Container>

  );

}

export default BillsList;