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
import { AddWorkdayEntryDocument, AddWorkdayEntryInput } from "../../graphql/generated/graphql";
import DimensionSelects from "./DimensionSelects";
import RecordTypeSelect from "./RecordTypeSelect";

export type EntryFormSchema = {
  date: Dayjs;
  duration: string;
  recordType: number;
  dimensions: any[];
};

const EntryDialog = (props: DialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [addWorkdayEntryMutation] = useMutation(AddWorkdayEntryDocument);

  const { handleSubmit, control, reset } = useForm<EntryFormSchema>({
    defaultValues: {
      date: dayjs(),
      duration: "",
      recordType: 100,
      dimensions: [],
    },
  });

  const onSubmit: SubmitHandler<EntryFormSchema> = async (formValues) => {
    const { date, duration, recordType } = formValues;
    const dimensions: AddWorkdayEntryInput["dimensions"] = formValues.dimensions
      .filter((dim) => dim.value)
      .map(({ name, value }) => ({ name, value }));

    await addWorkdayEntryMutation({
      variables: {
        entry: {
          date: date.format("YYYY-MM-DD"),
          duration: Number(duration),
          recordTypeRatioNumber: recordType,
          dimensions,
        },
      },
    });
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
            <Grid item xs={12}>
              <RecordTypeSelect control={control} />
            </Grid>
            <DimensionSelects control={control} />
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
