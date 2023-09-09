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

const EntryDialog = (props: DialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog {...props} fullScreen={fullScreen}>
      <DialogTitle>Entry</DialogTitle>
      <DialogContent sx={{ maxWidth: "100vw" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DatePicker />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
              <Button type="reset" variant="outlined" size="large">
                Cancel
              </Button>
              <Button type="submit" variant="contained" size="large">
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EntryDialog;
