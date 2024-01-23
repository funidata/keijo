import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Dayjs } from "dayjs";
import useDayjs from "../../common/useDayjs";
import { Entry } from "../../graphql/generated/graphql";
import EditEntryButton from "./EditEntryButton";

type EntryFlexRowProps = {
  entry: Entry;
  date: Dayjs;
};

const EntryFlexRow = ({ entry, date }: EntryFlexRowProps) => {
  const dayjs = useDayjs();

  return (
    <Box
      sx={{
        bgcolor: grey[800],
        borderRadius: 3,
        pl: 1,
        pr: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ minWidth: 60, textAlign: "right", mr: 1 }}>
        <Typography variant="h6">
          {dayjs.duration(entry.duration, "hour").format("H:mm")}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: "scroll", whiteSpace: "nowrap" }}>Dimension chips</Box>
      <Box>
        <EditEntryButton date={date} entry={entry} />
      </Box>
    </Box>
  );
};

export default EntryFlexRow;
