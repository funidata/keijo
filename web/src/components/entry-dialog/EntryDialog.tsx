import { useMutation } from "@apollo/client";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import dayjs from "../../common/dayjs";
import {
  AddWorkdayEntryDocument,
  Entry,
  FindWorkdaysDocument,
  ReplaceWorkdayEntryDocument,
} from "../../graphql/generated/graphql";
import DimensionSelect from "./DimensionSelect";

export type EntryFormSchema = {
  date: Dayjs;
  duration: string;
  product: string;
  activity: string;
  issue: string;
  client: string;
};

type EntryDialogProps = DialogProps & {
  editEntry?: Entry;
  date?: Dayjs;
};

const EntryDialog = ({ editEntry, date, ...props }: EntryDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [addWorkdayEntryMutation] = useMutation(AddWorkdayEntryDocument, {
    refetchQueries: [FindWorkdaysDocument],
  });
  const [replaceWorkdayEntryMutation] = useMutation(ReplaceWorkdayEntryDocument, {
    refetchQueries: [FindWorkdaysDocument],
  });

  const defaultValues: EntryFormSchema = {
    date: date ? dayjs(date) : dayjs(),
    duration: editEntry?.duration.toString() || "",
    product: editEntry?.product || "",
    activity: editEntry?.activity || "",
    issue: editEntry?.issue || "",
    client: editEntry?.client || "",
  };

  const { handleSubmit, control, reset } = useForm<EntryFormSchema>({ defaultValues });

  const addWorkday: SubmitHandler<EntryFormSchema> = async (formValues) => {
    const { date, duration, product, activity, issue, client } = formValues;

    await addWorkdayEntryMutation({
      variables: {
        entry: {
          date: date.format("YYYY-MM-DD"),
          duration: Number(duration),
          product,
          activity,
          issue,
          client,
        },
      },
    });
  };

  const editWorkday: SubmitHandler<EntryFormSchema> = async (formValues) => {
    const { date, duration, product, activity, issue, client } = formValues;

    if (!editEntry) {
      throw new Error("Original entry not given.");
    }

    await replaceWorkdayEntryMutation({
      variables: {
        originalEntry: { key: editEntry.key, date: date.format("YYYY-MM-DD") },
        replacementEntry: {
          date: date.format("YYYY-MM-DD"),
          duration: Number(duration),
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

  return (
    <Dialog {...props} fullScreen={fullScreen}>
      <DialogTitle>Entry</DialogTitle>
      <DialogContent sx={{ maxWidth: "100vw" }}>
        <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => <DatePicker {...field} />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => <TextField {...field} />}
              />
            </Grid>
            <DimensionSelect control={control} name="product" title="Tuote" />
            <DimensionSelect control={control} name="activity" title="Toiminto" />
            <DimensionSelect control={control} name="issue" title="Tiketti" />
            <DimensionSelect control={control} name="client" title="Asiakas" />
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
                <Button type="reset" variant="outlined" size="large">
                  Clear
                </Button>
                <Button type="submit" variant="contained" size="large">
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EntryDialog;
