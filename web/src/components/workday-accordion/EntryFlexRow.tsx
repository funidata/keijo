import { Box, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import dayjs from "../../common/dayjs";
import { Entry } from "../../graphql/generated/graphql";

type EntryFlexRowProps = {
  entry: Entry;
  date: Dayjs;
};

const EntryFlexRow = ({ entry, date }: EntryFlexRowProps) => {
  return (
    <Box>
      <Box>
        <Typography variant="h6">
          {dayjs.duration(entry.duration, "hour").format("H:mm")}
        </Typography>
      </Box>
    </Box>
  );
};

export default EntryFlexRow;
