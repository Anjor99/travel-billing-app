import {

  createContext,
  useContext,
  useState

} from "react";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const AlertContext =
  createContext();

export function AlertProvider({

  children

}) {

  const [alert,
    setAlert] = useState({

      open: false,
      message: "",
      severity: "success"

  });

  const showAlert =
    (message,
     severity = "success") => {

      setAlert({

        open: true,
        message,
        severity

      });

  };

  const handleClose =
    () => {

      setAlert({

        ...alert,
        open: false

      });

  };

  return (

    <AlertContext.Provider
      value={{ showAlert }}
    >

      {children}

      <Snackbar

        open={alert.open}

        autoHideDuration={3000}

        onClose={handleClose}

        anchorOrigin={{

          vertical: "top",
          horizontal: "center"

        }}

      >

        <Alert

          severity={alert.severity}

          onClose={handleClose}

          variant="filled"

        >

          {alert.message}

        </Alert>

      </Snackbar>

    </AlertContext.Provider>

  );

}

export const useAlert =
  () => useContext(AlertContext);