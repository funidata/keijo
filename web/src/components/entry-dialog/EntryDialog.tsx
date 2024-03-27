import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import EntryForm from "./EntryForm";
import useEntryForm, { useEntryProps } from "./useEntryForm";

type EntryDialogProps = DialogProps &
  useEntryProps & {
    onClose: () => void;
  };

const EntryDialog = ({ editEntry, date, onClose, ...props }: EntryDialogProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { form, onSubmit } = useEntryForm({ editEntry, date });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      onClose();
    }
  }, [isSubmitSuccessful, reset, onClose]);

  return (
    <Dialog maxWidth="lg" fullWidth {...props} fullScreen={fullScreen} onClose={onClose}>
      <DialogTitle>{t("entryDialog.title")}</DialogTitle>
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
      <DialogContent sx={{ maxWidth: "100vw" }}>
        <EntryForm
          form={form}
          onSubmit={handleSubmit(onSubmit)}
          reset={reset}
          editEntry={editEntry}
          originalDate={date}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EntryDialog;
