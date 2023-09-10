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
import DimensionSelects from "./DimensionSelects";
import RecordTypeSelect from "./RecordTypeSelect";

type EntryFormSchema = {
  date: Dayjs;
  duration: string;
};

const EntryDialog = (props: DialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const { handleSubmit, control, reset } = useForm<EntryFormSchema>({
    defaultValues: {
      date: dayjs(),
      duration: "",
    },
  });
  const onSubmit: SubmitHandler<EntryFormSchema> = (data) => console.log(data);

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
              <RecordTypeSelect />
            </Grid>
            <DimensionSelects />
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
