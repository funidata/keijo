import { useMutation } from "@apollo/client";
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
import { Dayjs } from "dayjs";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import dayjs from "../../common/dayjs";
import {
  AddWorkdayEntryDocument,
  Entry,
  FindWorkdaysDocument,
  ReplaceWorkdayEntryDocument,
} from "../../graphql/generated/graphql";
import { useNotification } from "../global-notification/useNotification";
import EntryForm from "./EntryForm";

export type EntryFormSchema = {
  date: Dayjs;
  duration: string;
  description: string;
  product: string;
  activity: string;
  issue: string | null;
  client: string;
};

type EntryDialogProps = DialogProps & {
  editEntry?: Entry;
  date?: Dayjs;
  onClose: () => void;
};

const EntryDialog = ({ editEntry, date, onClose, ...props }: EntryDialogProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { showSuccessNotification } = useNotification();

  const [addWorkdayEntryMutation] = useMutation(AddWorkdayEntryDocument, {
    refetchQueries: [FindWorkdaysDocument],
    onCompleted: () => {
      showSuccessNotification(t("notifications.addEntry.success"));
    },
  });

  const [replaceWorkdayEntryMutation] = useMutation(ReplaceWorkdayEntryDocument, {
    refetchQueries: [FindWorkdaysDocument],
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      showSuccessNotification(t("notifications.editEntry.success"));
    },
  });

  const defaultValues: EntryFormSchema = {
    date: date ? dayjs(date) : dayjs(),
    duration: editEntry?.duration.toString() || "",
    description: "",
    product: editEntry?.product || "",
    activity: editEntry?.activity || "",
    issue: editEntry?.issue || null,
    client: editEntry?.client || "",
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<EntryFormSchema>({ defaultValues });

  const addWorkday: SubmitHandler<EntryFormSchema> = async (formValues) => {
    const { date, duration, description, product, activity, issue, client } = formValues;

    await addWorkdayEntryMutation({
      variables: {
        entry: {
          date: date.format("YYYY-MM-DD"),
          duration: Number(duration),
          description,
          product,
          activity,
          issue,
          client,
        },
      },
    });
  };

  const editWorkday: SubmitHandler<EntryFormSchema> = async (formValues) => {
    const { date, duration, description, product, activity, issue, client } = formValues;

    if (!editEntry) {
      throw new Error("Original entry not given.");
    }

    await replaceWorkdayEntryMutation({
      variables: {
        originalEntry: { key: editEntry.key, date: date.format("YYYY-MM-DD") },
        replacementEntry: {
          date: date.format("YYYY-MM-DD"),
          duration: Number(duration),
          description,
          product,
          activity,
          issue,
          client,
        },
      },
    });
  };

  const onSubmit: SubmitHandler<EntryFormSchema> = async (formValues) => {
    if (editEntry) {
      await editWorkday(formValues);
    } else {
      await addWorkday(formValues);
    }
  };

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
          control={control}
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
