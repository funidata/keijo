import AddCircleIcon from "@mui/icons-material/AddCircle";
import { IconButton } from "@mui/material";
import { useState } from "react";
import EntryDialog from "./EntryDialog";

const EntryDialogButton = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <IconButton aria-label="Open entry dialog." onClick={toggle} color="inherit" size="large">
        <AddCircleIcon fontSize="inherit" />
      </IconButton>
      <EntryDialog open={open} onClose={toggle} />
    </>
  );
};

export default EntryDialogButton;
