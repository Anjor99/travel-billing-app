import {

  useState

} from "react";

import {

  useSearchParams,
  useNavigate

} from "react-router-dom";

import {

  resetPassword

} from "../../api/auth";

import {

  useAlert

} from "../../context/AlertContext";

import InputField
  from "../../components/InputField/InputField";

import Button
  from "../../components/Button/Button";


function ResetPassword() {

  const [params] =
    useSearchParams();

  const navigate =
    useNavigate();

  const { showAlert } =
    useAlert();

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");


  const handleReset =
    async () => {

      const token =
        params.get("token");

      if (!password) {

        showAlert(
          "Enter password",
          "warning"
        );

        return;

      }

      if (password != password2) {
        showAlert(
          "Passwords do not match",
          "warning"
        );

        return;
      }

      try {

        await resetPassword({

          token,
          new_password:
            password

        });

        showAlert(

          "Password updated",

          "success"

        );

        navigate("/");

      }
      catch {

        showAlert(

          "Invalid or expired token",

          "error"

        );

      }

  };


  return (

    <div>

      <h2>
        Reset Password
      </h2>

      <InputField

        label="New Password"

        type="password"

        value={password}

        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }

      />

      <InputField

        label="Re-enter Password"

        type="password"

        value={password2}

        onChange={(e) =>
          setPassword2(
            e.target.value
          )
        }

      />

      <Button

        text="Reset Password"

        onClick={handleReset}

      />

    </div>

  );

}

export default ResetPassword;