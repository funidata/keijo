import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Entry } from "../../graphql/generated/graphql";
import EntryDialog from "../entry-dialog/EntryDialog";

type EditEntryButtonProps = {
  entry: Entry;
  date: Dayjs;
};

const EditEntryButton = ({ entry, date }: EditEntryButtonProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <>
      <IconButton
        aria-label={t("controls.editEntry")}
        color="primary"
        size="medium"
        onClick={toggleOpen}
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
      <EntryDialog open={open} onClose={toggleOpen} editEntry={entry} date={date} />
    </>
  );
};

export default EditEntryButton;
