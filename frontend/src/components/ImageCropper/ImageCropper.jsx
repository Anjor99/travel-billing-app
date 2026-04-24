import { useState } from "react";

import Cropper
  from "react-easy-crop";

import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import getCroppedImg
  from "../../utils/cropImage";

function ImageCropper({

  open,
  image,
  aspect,
  onClose,
  onComplete

}) {

  const [crop,
    setCrop] =
    useState({ x: 0, y: 0 });

  const [zoom,
    setZoom] =
    useState(1);

  const [croppedArea,
    setCroppedArea] =
    useState(null);


  const onCropComplete =
    (_, croppedPixels) => {

      setCroppedArea(
        croppedPixels
      );

  };


  const handleSave =
    async () => {

      const blob =
        await getCroppedImg(

          image,
          croppedArea

        );

      onComplete(blob);

      onClose();

  };


  return (

    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
    >

      <Box
        sx={{
          position: "relative",
          height: 300
        }}
      >

        <Cropper

          image={image}

          crop={crop}

          zoom={zoom}

          aspect={aspect}

          onCropChange={setCrop}

          onZoomChange={setZoom}

          onCropComplete={
            onCropComplete
          }

        />

      </Box>

      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent:
            "space-between"
        }}
      >

        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          Crop
        </Button>

      </Box>

    </Dialog>

  );

}

export default ImageCropper;