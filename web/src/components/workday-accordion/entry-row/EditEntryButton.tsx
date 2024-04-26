import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Entry } from "../../../graphql/generated/graphql";

type EditEntryButtonProps = {
  entry: Entry;
  date: Dayjs;
};

const EditEntryButton = ({ entry, date }: EditEntryButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <IconButton
        aria-label={t("controls.editEntry")}
        size="medium"
        onClick={() => navigate(`${location.pathname}/edit`, { state: { date, editEntry: entry } })}
        sx={(theme) => ({
          color:
            theme.palette.mode === "dark"
              ? theme.palette.primary.main
              : theme.palette.secondary.dark,
        })}
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
    </>
  );
};

export default EditEntryButton;
