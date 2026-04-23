import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";

import {
  ThemeProvider,
  createTheme
} from "@mui/material/styles";

/* Date Picker */

import {
  LocalizationProvider
} from "@mui/x-date-pickers";

import {
  AdapterDayjs
} from "@mui/x-date-pickers/AdapterDayjs";

/* Theme */

const theme = createTheme({

  palette: {

    primary: {
      main: "#483D8B" // darkslateblue
    }

  }

});

ReactDOM
  .createRoot(
    document.getElementById("root")
  )
  .render(

    <ThemeProvider theme={theme}>

      <LocalizationProvider
        dateAdapter={AdapterDayjs}
      >

        <App />

      </LocalizationProvider>

    </ThemeProvider>

  );