import TextField from "@mui/material/TextField";

function NumberInput({

  label,
  name,
  value,
  onChange,
  error

}) {

  return (

    <TextField

      fullWidth

      label={label}

      name={name}

      type="number"

      value={value ?? ""}

      onChange={onChange}

      margin="normal"

      error={!!error}

      helperText={error}

    />

  );

}

export default NumberInput;