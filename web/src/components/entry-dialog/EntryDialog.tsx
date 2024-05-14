import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import EntryForm from "./EntryForm";
import useEntryForm from "./useEntryForm";

type EntryDialogProps = Omit<DialogProps, "open">;

const EntryDialog = ({ ...props }: EntryDialogProps) => {
  const { state } = useLocation();
  // state is possibly null
  const { date, editEntry } = state || {};
  console.log(date);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { form, onSubmit, loading } = useEntryForm({ editEntry, date });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  const onClose = useCallback(() => {
    navigate("..");
  }, [navigate]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful, reset, onClose]);

  return (
    <Dialog maxWidth="lg" fullWidth {...props} fullScreen={fullScreen} onClose={onClose} open>
      <DialogTitle>{t("entryDialog.title")}</DialogTitle>
      <Tooltip title={t("controls.close")}>
        <IconButton
          aria-label={t("controls.close")}
          onClick={onClose}
          size="large"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <DialogContent sx={{ maxWidth: "100vw" }}>
        <EntryForm
          form={form}
          onSubmit={handleSubmit(onSubmit)}
          reset={reset}
          editEntry={editEntry}
          originalDate={date}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EntryDialog;
