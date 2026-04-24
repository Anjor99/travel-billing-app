import TextField from "@mui/material/TextField";

function InputField({

  label,
  name,
  value,
  onChange,
  type = "text",
  error

}) {

  return (

    <TextField

      fullWidth

      label={label}

      name={name}

      type={type}

      value={value || ""}

      onChange={onChange}

      margin="normal"

      error={!!error}

      helperText={error}

    />

  );

}

export default InputField;