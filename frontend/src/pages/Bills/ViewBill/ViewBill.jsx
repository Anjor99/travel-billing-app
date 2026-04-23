import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* MUI */

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

/* Icons */

import ArrowBackIcon
  from "@mui/icons-material/ArrowBack";

import PersonIcon
  from "@mui/icons-material/Person";

import PhoneIcon
  from "@mui/icons-material/Phone";

import DirectionsCarIcon
  from "@mui/icons-material/DirectionsCar";

import LocationOnIcon
  from "@mui/icons-material/LocationOn";

import RouteIcon
  from "@mui/icons-material/Route";

import CurrencyRupeeIcon
  from "@mui/icons-material/CurrencyRupee";

import DownloadIcon
  from "@mui/icons-material/Download";

import DeleteIcon
  from "@mui/icons-material/Delete";

import ShareIcon
  from "@mui/icons-material/Share";

import EditIcon
  from "@mui/icons-material/Edit";

/* APIs */

import {
  getBillById,
  deleteBill,
  downloadBillPdf
} from "../../../api/bills";

function ViewBill() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [bill, setBill] =
    useState(null);

  useEffect(() => {

    fetchBill();

  }, []);

  const fetchBill =
    async () => {

      try {

        const data =
          await getBillById(id);

        setBill(data);

      }
      catch (err) {

        console.error(err);

      }

  };

  /* DELETE */

  const handleDelete =
    async () => {

      const confirmDelete =
        window.confirm(
          "Delete this bill?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteBill(id);

        alert("Bill deleted");

        navigate("/bills");

      }
      catch (err) {

        console.error(err);

      }

  };

  /* DOWNLOAD */

  const handleDownload = () => {

    downloadBillPdf(id);

  };

  if (!bill) {

    return (

      <Typography
        align="center"
        sx={{ mt: 4 }}
      >

        Loading...

      </Typography>

    );

  }

  return (

    <Container
      maxWidth="sm"
      sx={{ mt: 2 }}
    >

      {/* BACK BUTTON */}

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          navigate("/bills")
        }
        sx={{
          mb: 1,
          textTransform: "none"
        }}
      >

        Back to Bills

      </Button>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3
        }}
      >

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center"
          }}
        >

          <Typography variant="h6">

            Bill #{bill.bill_no}

          </Typography>

          <Chip
            label={bill.bill_date}
            color="primary"
            size="small"
          />

        </Box>

        <Divider sx={{ my: 2 }} />

        {/* CUSTOMER */}

        <Typography
          variant="subtitle1"
          sx={{ mb: 1 }}
        >

          Customer

        </Typography>

        <Box sx={{ mb: 2 }}>

          <Typography>

            <PersonIcon
              fontSize="small"
              sx={{ mr: 1 }}
            />

            {bill.customer_name}

          </Typography>

          <Typography>

            <PhoneIcon
              fontSize="small"
              sx={{ mr: 1 }}
            />

            {bill.customer_phone || "-"}

          </Typography>

        </Box>

        {/* VEHICLE */}

        <Typography
          variant="subtitle1"
        >

          Vehicle

        </Typography>

        <Typography sx={{ mb: 2 }}>

          <DirectionsCarIcon
            fontSize="small"
            sx={{ mr: 1 }}
          />

          {bill.vehicle_no || "-"}

        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* TRIP */}

        <Typography
          variant="subtitle1"
        >

          Trip Details

        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>

          <Grid item xs={6}>

            <LocationOnIcon fontSize="small" />

            <Typography>

              {bill.source}

            </Typography>

          </Grid>

          <Grid item xs={6}>

            <LocationOnIcon fontSize="small" />

            <Typography>

              {bill.destination}

            </Typography>

          </Grid>

          <Grid item xs={6}>

            <RouteIcon fontSize="small" />

            <Typography>

              {bill.total_km} KM

            </Typography>

          </Grid>

          <Grid item xs={6}>

            <CurrencyRupeeIcon fontSize="small" />

            <Typography>

              ₹ {bill.rate_per_km}

            </Typography>

          </Grid>

          <Grid item xs={6}>

            Nights:

            <Typography>

              ₹ {bill.total_nights}

            </Typography>

          </Grid>

          <Grid item xs={6}>

            Toll:

            <Typography>

              ₹ {bill.toll_tax_parking}

            </Typography>

          </Grid>

        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* TOTAL */}

        <Box
          sx={{
            textAlign: "right",
            mb: 2
          }}
        >

          <Typography variant="h6">

            Total ₹ {bill.total_amount}

          </Typography>

        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ACTIONS */}

        <Grid container spacing={1}>

          <Grid item xs={6}>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<EditIcon />}
            >

              Edit

            </Button>

          </Grid>

          <Grid item xs={6}>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<ShareIcon />}
            >

              Share

            </Button>

          </Grid>

          <Grid item xs={6}>

            <Button
              fullWidth
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
            >

              PDF

            </Button>

          </Grid>

          <Grid item xs={6}>

            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >

              Delete

            </Button>

          </Grid>

        </Grid>

      </Paper>

    </Container>

  );

}

export default ViewBill;