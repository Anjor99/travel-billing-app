import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser }
  from "../../api/auth";

import InputField
  from "../../components/InputField/InputField";

import Button
  from "../../components/Button/Button";

/* Alert */

import { useAlert }
  from "../../context/AlertContext";

/* MUI */

import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

function Login() {

  const navigate = useNavigate();

  const { showAlert } =
    useAlert();

  const [form, setForm] =
    useState({

      email: "",
      password: ""

    });

  const [loading, setLoading] =
    useState(false);


  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value

      });

  };


  const handleLogin =
    async () => {

      if (!form.email || !form.password) {

        showAlert(
          "Enter email and password",
          "warning"
        );

        return;

      }

      try {

        setLoading(true);

        const res =
          await loginUser(form);

        localStorage.setItem(

          "token",

          res.access_token

        );

        navigate("/create-bill");

      }
      catch (err) {

        const message =
          err.response?.data?.detail ||
          err.message ||
          "Login failed";

        showAlert(
          message,
          "error"
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

          Travel Billing Login

        </Typography>


        {/* Form */}

        <Box sx={{ mt: 2 }}>

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


          {/* Forgot Password Link */}

          <Typography

            variant="body2"

            align="right"

            sx={{

              mt: 1,

              mb: 2

            }}

          >

            <Link

              component="button"

              onClick={() =>

                navigate(
                  "/forgot-password"
                )

              }

              sx={{

                color: "#483D8B",

                fontWeight: 500

              }}

            >

              Forgot Password?

            </Link>

          </Typography>


          <Button

            text={

              loading

                ? "Logging in..."

                : "Login"

            }

            onClick={handleLogin}

          />

        </Box>


        {/* Register Link */}

        <Typography

          variant="body2"

          align="center"

          sx={{ mt: 2 }}

        >

          Don't have an account?{" "}

          <Link

            component="button"

            onClick={() =>

              navigate("/register")

            }

            sx={{

              color: "#483D8B",

              fontWeight: 500

            }}

          >

            Register

          </Link>

        </Typography>

      </Paper>

    </Container>

  );

}

export default Login;