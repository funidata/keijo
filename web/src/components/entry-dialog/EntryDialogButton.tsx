import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, IconButtonProps } from "@mui/material";
import { Dayjs } from "dayjs";
import { useState } from "react";
import EntryDialog from "./EntryDialog";

type EntryDialogButtonProps = IconButtonProps & {
  date?: Dayjs;
};

const EntryDialogButton = ({ date, ...props }: EntryDialogButtonProps) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <IconButton
        aria-label="Open entry dialog."
        onClick={toggle}
        color="inherit"
        size="large"
        {...props}
      >
        <AddCircleIcon fontSize="inherit" />
      </IconButton>
      <EntryDialog open={open} onClose={toggle} date={date} />
    </Box>
  );
};

export default EntryDialogButton;
