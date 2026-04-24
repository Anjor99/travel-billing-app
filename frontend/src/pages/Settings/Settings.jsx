import { useEffect, useState } from "react";

/* MUI */

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

/* Icons */

import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";

/* Cropper */

import ImageCropper
  from "../../components/ImageCropper/ImageCropper";

/* API */

import {
  getHeaderFooterURL,
  uploadHeader,
  uploadFooter,
  deleteHeader,
  deleteFooter
} from "../../api/settings";


function Settings() {

  const [header, setHeader] =
    useState(null);

  const [footer, setFooter] =
    useState(null);

  const [headerPreview,
    setHeaderPreview] =
    useState(null);

  const [footerPreview,
    setFooterPreview] =
    useState(null);


  /* Crop states */

  const [cropOpen,
    setCropOpen] =
    useState(false);

  const [cropType,
    setCropType] =
    useState(null);

  const [imageSrc,
    setImageSrc] =
    useState(null);



  // =========================
  // Load Existing Images
  // =========================

  useEffect(() => {

    loadSettings();

  }, []);

  const loadSettings =
    async () => {

      try {

        const data =
          await getHeaderFooterURL();

        setHeader(
          data.header_url
        );

        setFooter(
          data.footer_url
        );

      }
      catch (err) {

        console.error(err);

      }

  };


  // =========================
  // Handle File Select
  // =========================

  const handleFileChange =
    (e, type) => {

      const file =
        e.target.files[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload =
        () => {

          setImageSrc(
            reader.result
          );

          setCropType(type);

          setCropOpen(true);

        };

      reader.readAsDataURL(file);

  };


  // =========================
  // Crop Complete
  // =========================

  const handleCropComplete =
    (blob) => {

      const file =
        new File(

          [blob],

          "cropped.jpg",

          { type: "image/jpeg" }

        );

      const preview =
        URL.createObjectURL(file);

      if (cropType === "header") {

        setHeader(file);
        setHeaderPreview(preview);

      }
      else {

        setFooter(file);
        setFooterPreview(preview);

      }

  };


  // =========================
  // Upload
  // =========================

  const handleUpload =
    async (type) => {

      try {

        if (type === "header") {

          if (!header) return;

          await uploadHeader(header);

        }
        else {

          if (!footer) return;

          await uploadFooter(footer);

        }

        await loadSettings();

      }
      catch (err) {

        console.error(err);

      }

  };


  // =========================
  // Delete
  // =========================

  const handleDelete =
    async (type) => {

      try {

        if (type === "header") {

          await deleteHeader();

          setHeader(null);
          setHeaderPreview(null);

        }
        else {

          await deleteFooter();

          setFooter(null);
          setFooterPreview(null);

        }

      }
      catch (err) {

        console.error(err);

      }

  };


  return (

    <Container
      maxWidth="sm"
      sx={{ mt: 4 }}
    >

      <Typography
        variant="h5"
        gutterBottom
      >

        Settings

      </Typography>


      {/* ================= HEADER ================= */}

      <Paper sx={{ p: 2, mb: 3 }}>

        <Typography variant="h6">

          Header Image

        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >

          Recommended size:
          1200 × 200 px (6:1 ratio)

        </Typography>

        <Box sx={{ mb: 2 }}>

          {(headerPreview || header) && (

            <img
              src={
                headerPreview
                || header
              }
              alt="Header"
              style={{
                width: "100%",
                border: "1px solid #ccc"
              }}
            />

          )}

        </Box>


        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          sx={{ mr: 1 }}
        >

          Choose Image

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) =>
              handleFileChange(
                e,
                "header"
              )
            }
          />

        </Button>


        <Button
          variant="contained"
          onClick={() =>
            handleUpload("header")
          }
          sx={{ mr: 1 }}
        >

          Upload

        </Button>


        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() =>
            handleDelete("header")
          }
        >

          Delete

        </Button>

      </Paper>


      <Divider sx={{ mb: 3 }} />


      {/* ================= FOOTER ================= */}

      <Paper sx={{ p: 2 }}>

        <Typography variant="h6">

          Footer Image

        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >

          Recommended size:
          1200 × 150 px (8:1 ratio)

        </Typography>

        <Box sx={{ mb: 2 }}>

          {(footerPreview || footer) && (

            <img
              src={
                footerPreview
                || footer
              }
              alt="Footer"
              style={{
                width: "100%",
                border: "1px solid #ccc"
              }}
            />

          )}

        </Box>


        <Button
          variant="contained"
          component="label"
          startIcon={<UploadIcon />}
          sx={{ mr: 1 }}
        >

          Choose Image

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) =>
              handleFileChange(
                e,
                "footer"
              )
            }
          />

        </Button>


        <Button
          variant="contained"
          onClick={() =>
            handleUpload("footer")
          }
          sx={{ mr: 1 }}
        >

          Upload

        </Button>


        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() =>
            handleDelete("footer")
          }
        >

          Delete

        </Button>

      </Paper>


      {/* ================= CROP MODAL ================= */}

      <ImageCropper

        open={cropOpen}

        image={imageSrc}

        aspect={
          cropType === "header"
            ? 6 / 1
            : 8 / 1
        }

        onClose={() =>
          setCropOpen(false)
        }

        onComplete={
          handleCropComplete
        }

      />

    </Container>

  );

}

export default Settings;