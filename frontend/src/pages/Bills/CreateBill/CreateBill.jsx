import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

import { useAlert } from "../../../context/AlertContext";

/* MUI Layout Components */

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

function CreateBill() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [form, setForm] =
    useState({

      customer_name: "",
      customer_phone: "",

      vehicle_no: "",

      source: "",
      destination: "",

      total_km: "",
      rate_per_km: "",

      per_day_km: "",
      total_nights: "",
      toll_tax_parking: "",

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

  const validateForm = () => {

  if (!form.customer_name.trim()) {

    showAlert("Customer name is required","warning");
    return false;

  }

  if (!form.source.trim()) {

    showAlert("Source is required","warning");
    return false;

  }

  if (!form.destination.trim()) {

    showAlert("Destination is required","warning");
    return false;

  }

  if (!form.total_km || form.total_km <= 0) {

    showAlert("Enter valid Total KM","warning");
    return false;

  }

  if (!form.rate_per_km || form.rate_per_km <= 0) {

    showAlert("Enter valid Rate per KM","warning");
    return false;

  }

  if (!form.bill_date) {

    showAlert("Select bill date","warning");
    return false;

  }

  if (
    form.customer_phone &&
    !/^[0-9]{10}$/.test(form.customer_phone)
  ) {

    showAlert("Phone must be 10 digits","warning");
    return false;

  }

  return true;

};

  // Submit
  const handleSubmit =
    async () => {

    // 🔴 Validate first

    if (!validateForm())
      return;

    try {

      const payload = {

        ...form,

        // Convert empty numbers → 0

        per_day_km:
          form.per_day_km || 0,

        total_nights:
          form.total_nights || 0,

        toll_tax_parking:
          form.toll_tax_parking || 0

      };

      const res =
        await createBill(payload);

      showAlert(
        `Bill Created! Bill No: ${res.bill_no}`,
        "success"
      );

      // Navigate to bill view

      setTimeout(() => {

        navigate(
          `/bills/${res.bill_id}`
        );

      }, 700);

    }

    catch (err) {

      console.error(err);

      showAlert("Error creating bill","warning");

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