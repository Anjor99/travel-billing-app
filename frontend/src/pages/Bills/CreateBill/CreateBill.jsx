import { useState } from "react";

import InputField
  from "../../../components/InputField/InputField";

import NumberInput
  from "../../../components/NumberInput/NumberInput";

import DateInput
  from "../../../components/DateInput/DateInput";

import Checkbox
  from "../../../components/Checkbox/Checkbox";

import Button
  from "../../../components/Button/Button";

import { createBill }
  from "../../../api/bills";

/* MUI Layout Components */

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

function CreateBill() {

  const [form, setForm] =
    useState({

      customer_name: "",
      customer_phone: "",

      vehicle_no: "",

      source: "",
      destination: "",

      total_km: 0,
      rate_per_km: 0,

      per_day_km: 0,
      total_nights: 0,
      toll_tax_parking: 0,

      is_return: false,

      bill_date: ""

    });

  // Handle change
  const handleChange = (e) => {

    const { name, value, type, checked }
      = e.target;

    setForm({

      ...form,

      [name]:
        type === "checkbox"
          ? checked
          : value

    });

  };

  // Submit
  const handleSubmit =
    async () => {

      try {

        const res =
          await createBill(form);

        alert(
          `Bill Created! Bill No: ${res.bill_no}`
        );

      }
      catch (err) {

        console.error(err);

        alert("Error creating bill");

      }

  };

  return (

    <Container maxWidth="sm">

      <Paper
        elevation={3}
        sx={{ p: 3, mt: 4 }}
      >

        {/* Title */}

        <Typography
          variant="h5"
          gutterBottom
        >
          Create Bill
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* CUSTOMER */}

        <Typography
          variant="h6"
          sx={{ mt: 2 }}
        >
          Customer Details
        </Typography>

        <Grid container spacing={2}>

          <Grid item xs={12}>

            <InputField
              label="Customer Name"
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12}>

            <InputField
              label="Phone"
              name="customer_phone"
              value={form.customer_phone}
              onChange={handleChange}
            />

          </Grid>

        </Grid>

        {/* VEHICLE */}

        <Typography
          variant="h6"
          sx={{ mt: 3 }}
        >
          Vehicle
        </Typography>

        <Grid container spacing={2}>

          <Grid item xs={12}>

            <InputField
              label="Vehicle Number"
              name="vehicle_no"
              value={form.vehicle_no}
              onChange={handleChange}
            />

          </Grid>

        </Grid>

        {/* TRIP */}

        <Typography
          variant="h6"
          sx={{ mt: 3 }}
        >
          Trip Details
        </Typography>

        <Grid container spacing={2}>

          <Grid item xs={6}>

            <InputField
              label="Source"
              name="source"
              value={form.source}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={6}>

            <InputField
              label="Destination"
              name="destination"
              value={form.destination}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={6}>

            <NumberInput
              label="Total KM"
              name="total_km"
              value={form.total_km}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={6}>

            <NumberInput
              label="Rate per KM"
              name="rate_per_km"
              value={form.rate_per_km}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={6}>

            <NumberInput
              label="Per Day KM"
              name="per_day_km"
              value={form.per_day_km}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={6}>

            <NumberInput
              label="Night Charges"
              name="total_nights"
              value={form.total_nights}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12}>

            <NumberInput
              label="Toll / Tax / Parking"
              name="toll_tax_parking"
              value={form.toll_tax_parking}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12}>

            <Checkbox
              label="Return Trip"
              name="is_return"
              checked={form.is_return}
              onChange={handleChange}
            />

          </Grid>

        </Grid>

        {/* BILL */}

        <Typography
          variant="h6"
          sx={{ mt: 3 }}
        >
          Bill Details
        </Typography>

        <Grid container spacing={2}>

          <Grid item xs={12}>

            <DateInput
              label="Bill Date"
              name="bill_date"
              value={form.bill_date}
              onChange={handleChange}
            />

          </Grid>

        </Grid>

        {/* BUTTON */}

        <Box sx={{ mt: 3 }}>

          <Button
            text="Create Bill"
            onClick={handleSubmit}
          />

        </Box>

      </Paper>

    </Container>

  );

}

export default CreateBill;