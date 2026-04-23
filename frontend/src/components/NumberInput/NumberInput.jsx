import TextField from "@mui/material/TextField";

function NumberInput({

  label,
  name,
  value,
  onChange,
  placeholder,
  fullWidth = true

}) {

  return (

    <TextField
      label={label}
      name={name}
      type="number"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      variant="outlined"
      fullWidth={fullWidth}
      size="small"
      margin="normal"

      inputProps={{
        min: 0
      }}

    />

  );

}

export default NumberInput;