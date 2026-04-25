import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { forgotPassword }
  from "../../api/auth";

import { useAlert }
  from "../../context/AlertContext";

import InputField
  from "../../components/InputField/InputField";

import Button
  from "../../components/Button/Button";

/* MUI */
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";


function ForgotPassword() {

  const { showAlert } =
    useAlert();

  const navigate =
    useNavigate();

  const [email,
    setEmail] =
    useState("");


  const handleSubmit =
    async () => {

      if (!email) {

        showAlert(
          "Enter email",
          "warning"
        );

        return;

      }

      try {

        await forgotPassword({
          email
        });

        showAlert(
          "Reset email sent",
          "success"
        );

      }
      catch {

        showAlert(
          "Email not found",
          "error"
        );

      }

  };


  return (

    <Box
      sx={{
        position: "relative",
        padding: 3
      }}
    >

      {/* Top-left Arrow */}

      <IconButton
        onClick={() => navigate("/")}
        sx={{
          position: "absolute",
          top: 8,
          left: 8
        }}
      >
        <ArrowBackIcon />
      </IconButton>


      <h2>
        Forgot Password
      </h2>

      <InputField
        label="Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
      />

      <Button
        text="Send Reset Link"
        onClick={handleSubmit}
      />

    </Box>

  );

}

export default ForgotPassword;