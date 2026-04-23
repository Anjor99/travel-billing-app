import TextField from "@mui/material/TextField";

import {
  DatePicker
} from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

function DateInput({

  label,
  name,
  value,
  onChange

}) {

  return (

    <DatePicker
      label={label}
      value={
        value
          ? dayjs(value)
          : null
      }

      onChange={(newValue) => {

        onChange({
          target: {
            name: name,
            value:
              newValue
                ? newValue.format("YYYY-MM-DD")
                : ""
          }

        });

      }}

      renderInput={(params) => (

        <TextField
          {...params}
          fullWidth
          size="small"
          margin="normal"
        />

      )}

    />

  );

}

export default DateInput;