import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../context/AlertContext";

import InputField
  from "../../components/InputField/InputField";

import Button
  from "../../components/Button/Button";

import { registerUser }
  from "../../api/auth";

/* MUI */

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

function Register() {

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [form, setForm] =
    useState({

      name: "",
      email: "",
      password: "",
      password2: ""

    });

  const [loading, setLoading] =
    useState(false);

  // Handle input change

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  };

  // Submit register

  const handleRegister =
    async () => {

      try {

        setLoading(true);

        if (form.password != form.password2) {
          showAlert("Passwords are not matching","warning")
          return ;
        } else {
          await registerUser(form);

          showAlert(
            "Registration successful! Please verify your email.","success"
          );

          navigate("/");
        }

      }
      catch (err) {

        console.error(err);

        showAlert(
          err?.response?.data?.detail
          || "Registration failed","error"
        );

      }
      finally {

        setLoading(false);

      }

  };

  return (

    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center"
      }}
    >

      <Paper
        elevation={4}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: 3
        }}
      >

        {/* Title */}

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "#483D8B"
          }}
        >

          Create Account

        </Typography>

        {/* Form */}

        <Box sx={{ mt: 2 }}>

          <InputField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <InputField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          <InputField
            label="Repeat Password"
            name="password2"
            type="password"
            value={form.password2}
            onChange={handleChange}
          />

          <Button
            text={
              loading
                ? "Registering..."
                : "Register"
            }
            onClick={handleRegister}
          />

        </Box>

        {/* Login Link */}

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 2 }}
        >

          Already have an account?{" "}

          <Link
            component="button"
            onClick={() =>
              navigate("/")
            }
            sx={{
              color: "#483D8B",
              fontWeight: 500
            }}
          >

            Login

          </Link>

        </Typography>

      </Paper>

    </Container>

  );

}

export default Register;