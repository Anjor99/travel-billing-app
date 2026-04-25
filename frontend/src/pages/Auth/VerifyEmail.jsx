import {

  useEffect

} from "react";

import {

  useSearchParams,
  useNavigate

} from "react-router-dom";

import {

  verifyEmail

} from "../../api/auth";

import {

  useAlert

} from "../../context/AlertContext";

import Container
  from "@mui/material/Container";

import CircularProgress
  from "@mui/material/CircularProgress";

import Typography
  from "@mui/material/Typography";


function VerifyEmail() {

  const [params] =
    useSearchParams();

  const navigate =
    useNavigate();

  const { showAlert } =
    useAlert();


  useEffect(() => {

    verify();

  }, []);


  const verify =
    async () => {

      try {

        const token =
          params.get("token");

        await verifyEmail(token);

        showAlert(

          "Email verified successfully",

          "success"

        );

        setTimeout(() => {

          navigate("/");

        }, 1500);

      }
      catch {

        showAlert(

          "Invalid or expired link",

          "error"

        );

        navigate("/");

      }

  };


  return (

    <Container
      maxWidth="sm"
      sx={{
        mt: 10,
        textAlign: "center"
      }}
    >

      <CircularProgress />

      <Typography
        sx={{ mt: 2 }}
      >

        Verifying email...

      </Typography>

    </Container>

  );

}

export default VerifyEmail;