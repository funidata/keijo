import BuildIcon from "@mui/icons-material/Build";
import LayersIcon from "@mui/icons-material/Layers";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Dayjs } from "dayjs";
import useDayjs from "../../common/useDayjs";
import { Entry } from "../../graphql/generated/graphql";
import DimensionChip from "./DimensionChip";
import EditEntryButton from "./EditEntryButton";

type EntryFlexRowProps = {
  entry: Entry;
  date: Dayjs;
};

const EntryFlexRow = ({ entry, date }: EntryFlexRowProps) => {
  const dayjs = useDayjs();
  const { product, activity, issue, client } = entry;

  return (
    <Box
      sx={{
        bgcolor: grey[800],
        borderRadius: 4,
        pl: 1,
        pr: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ minWidth: 60, textAlign: "right", mr: 3 }}>
        <Typography variant="h6">
          {dayjs.duration(entry.duration, "hour").format("H:mm")}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1, display: "flex", gap: 2, overflow: "scroll", whiteSpace: "nowrap" }}>
        {product && (
          <DimensionChip icon={<LayersIcon fontSize="small" />} color="primary" label={product} />
        )}
        {activity && (
          <DimensionChip icon={<BuildIcon fontSize="small" />} color="info" label={activity} />
        )}
        {issue && (
          <DimensionChip icon={<LocalOfferIcon fontSize="small" />} color="success" label={issue} />
        )}
        {client && (
          <DimensionChip icon={<PersonIcon fontSize="small" />} color="secondary" label={client} />
        )}
      </Box>
      <Box>
        <EditEntryButton date={date} entry={entry} />
      </Box>
    </Box>
  );
};

export default EntryFlexRow;