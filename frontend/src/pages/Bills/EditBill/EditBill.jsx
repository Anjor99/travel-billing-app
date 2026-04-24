import { useEffect, useState } from "react";
import { useAlert } from "../../../context/AlertContext";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {

  getBillById,
  updateBill

} from "../../../api/bills";

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

import MuiButton
  from "@mui/material/Button";

import ArrowBackIcon
  from "@mui/icons-material/ArrowBack";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";

import Paper from "@mui/material/Paper";

function EditBill() {
  const { showAlert } = useAlert();

  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] =
    useState(null);

  const [errors, setErrors] =
    useState({});

  /* LOAD EXISTING */

  useEffect(() => {

    fetchBill();

  }, []);

  const fetchBill =
    async () => {

      try {

        const data =
          await getBillById(id);

        // Fix date format
        if (data.bill_date) {

          data.bill_date =
            data.bill_date.split("T")[0];

        }

        setForm(data);

      }
      catch (err) {

        console.error(err);

      }

  };

  if (!form)
    return <p>Loading...</p>;

  /* HANDLE CHANGE */

  const handleChange =
    (e) => {

      const {
        name,
        value,
        type,
        checked
      } = e.target;

      setForm({

        ...form,

        [name]:

          type === "checkbox"
            ? checked
            : value

      });

      // Clear error when typing

      setErrors({

        ...errors,

        [name]: ""

      });

  };

  /* VALIDATION */

  const validateForm =
    () => {

      let newErrors = {};

      if (!form.customer_name?.trim()) {

        newErrors.customer_name =
          "Customer name required";

      }

      if (!form.source?.trim()) {

        newErrors.source =
          "Source required";

      }

      if (!form.destination?.trim()) {

        newErrors.destination =
          "Destination required";

      }

      if (!form.total_km ||
          form.total_km <= 0) {

        newErrors.total_km =
          "Total KM must be > 0";

      }

      if (!form.rate_per_km ||
          form.rate_per_km <= 0) {

        newErrors.rate_per_km =
          "Rate must be > 0";

      }

      if (!form.bill_date) {

        newErrors.bill_date =
          "Bill date required";

      }

      setErrors(newErrors);

      return Object.keys(newErrors)
        .length === 0;

  };

  /* SUBMIT */

  const handleUpdate =
    async () => {

      if (!validateForm())
        return;

      try {

        await updateBill(
          id,
          form
        );

        showAlert("Bill Updated","success");

        // Redirect to view page

        navigate(
          `/bills/${id}`
        );

      }
      catch (err) {

        console.error(err);

        showAlert("Update failed","error");

      }

  };

  return (

    <Box sx={{ p: 2 }}>

    {/* BACK BUTTON */}

    <MuiButton
      variant="text"
      startIcon={<ArrowBackIcon />}
      onClick={() =>
        navigate(`/bills/${id}`)
      }
      sx={{
        mb: 1,
        textTransform: "none"
      }}
    >

      Back to Bill

    </MuiButton>

    <Paper sx={{ p: 3 }}>

        <Typography
        variant="h6"
        sx={{ mb: 2 }}
        >

        Edit Bill

        </Typography>

      {/* CUSTOMER */}

      <InputField
        label="Customer Name"
        name="customer_name"
        value={form.customer_name}
        onChange={handleChange}
        error={errors.customer_name}
      />

      <InputField
        label="Phone"
        name="customer_phone"
        value={form.customer_phone}
        onChange={handleChange}
      />

      <InputField
        label="Vehicle No"
        name="vehicle_no"
        value={form.vehicle_no}
        onChange={handleChange}
      />

      {/* TRIP */}

      <InputField
        label="Source"
        name="source"
        value={form.source}
        onChange={handleChange}
        error={errors.source}
      />

      <InputField
        label="Destination"
        name="destination"
        value={form.destination}
        onChange={handleChange}
        error={errors.destination}
      />

      <NumberInput
        label="Total KM"
        name="total_km"
        value={form.total_km}
        onChange={handleChange}
        error={errors.total_km}
      />

      <NumberInput
        label="Rate per KM"
        name="rate_per_km"
        value={form.rate_per_km}
        onChange={handleChange}
        error={errors.rate_per_km}
      />

      <NumberInput
        label="Per Day KM"
        name="per_day_km"
        value={form.per_day_km}
        onChange={handleChange}
      />

      <NumberInput
        label="Night Charges"
        name="total_nights"
        value={form.total_nights}
        onChange={handleChange}
      />

      <NumberInput
        label="Toll/Tax/Parking"
        name="toll_tax_parking"
        value={form.toll_tax_parking}
        onChange={handleChange}
      />

      <Checkbox
        label="Return Trip"
        name="is_return"
        checked={form.is_return}
        onChange={handleChange}
      />

      {/* BILL */}

      <DateInput
        label="Bill Date"
        name="bill_date"
        value={form.bill_date}
        onChange={handleChange}
        error={errors.bill_date}
      />

      <Button
        text="Update Bill"
        onClick={handleUpdate}
      />

      </Paper>

</Box>

  );

}

export default EditBill;