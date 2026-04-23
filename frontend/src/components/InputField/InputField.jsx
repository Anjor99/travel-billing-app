import TextField from "@mui/material/TextField";

function InputField({

  label,
  name,
  value,
  onChange,
  type = "text",
  fullWidth = true

}) {

  return (

    <TextField
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth={fullWidth}
      size="small"
      margin="normal"
    />

  );

}

export default InputField;