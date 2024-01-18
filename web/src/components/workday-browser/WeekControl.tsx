import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, IconButton } from "@mui/material";

const WeekControl = () => {
  return (
    <Box>
      <IconButton>
        <ArrowBackIcon />
      </IconButton>
      <IconButton>
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
};

export default WeekControl;
