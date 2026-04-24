import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function ConfirmDialog({

  open,
  title = "Confirm",
  message,
  onConfirm,
  onCancel

}) {

  return (

    <Dialog

      open={open}

      onClose={onCancel}

      maxWidth="xs"

      fullWidth

    >

      <DialogTitle>

        {title}

      </DialogTitle>

      <DialogContent>

        <Typography>

          {message}

        </Typography>

      </DialogContent>

      <DialogActions>

        <Button

          onClick={onCancel}

          color="inherit"

        >

          Cancel

        </Button>

        <Button

          onClick={onConfirm}

          color="error"

          variant="contained"

        >

          Delete

        </Button>

      </DialogActions>

    </Dialog>

  );

}

export default ConfirmDialog;