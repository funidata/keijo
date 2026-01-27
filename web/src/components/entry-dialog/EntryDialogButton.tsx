import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButtonProps } from "@mui/material";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import LabelledIconButton from "../LabelledIconButton";

type EntryDialogButtonProps = IconButtonProps & {
  date?: Dayjs;
};

const EntryDialogButton = ({ date, ...props }: EntryDialogButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const label = date
    ? t("controls.addEntryWithDate", {
        date: date.format("L").toString(),
        interpolation: { escapeValue: false },
      })
    : t("controls.addEntry");

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <LabelledIconButton
        label={label}
        onClick={() =>
          navigate(generatePath(`${location.pathname}/create`), {
            state: { date: date?.format("YYYY-MM-DD") },
          })
        }
        {...props}
      >
        <AddCircleIcon fontSize="inherit" />
      </LabelledIconButton>
    </Box>
  );
};

export default EntryDialogButton;
