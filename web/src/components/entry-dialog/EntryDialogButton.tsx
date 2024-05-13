import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, IconButton, IconButtonProps, Tooltip } from "@mui/material";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

type EntryDialogButtonProps = IconButtonProps & {
  date?: Dayjs;
};

const EntryDialogButton = ({ date, ...props }: EntryDialogButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <Tooltip title={t("entryDialog.title")}>
        <IconButton
          aria-label={t("entryDialog.title")}
          onClick={() => navigate(`${location.pathname}/create`, { state: { date } })}
          color="inherit"
          size="large"
          {...props}
        >
          <AddCircleIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default EntryDialogButton;
