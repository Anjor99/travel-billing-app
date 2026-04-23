import Button from "@mui/material/Button";

function CustomButton({

  text,
  onClick,
  type = "button"

}) {

  return (

    <Button
      variant="contained"
      color="primary"
      fullWidth
      onClick={onClick}
      type={type}
      sx={{
        mt: 2,
        backgroundColor: "darkslateblue"
      }}

    >

      {text}

    </Button>

  );

}

export default CustomButton;