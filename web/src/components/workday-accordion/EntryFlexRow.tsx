import BuildIcon from "@mui/icons-material/Build";
import LayersIcon from "@mui/icons-material/Layers";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Dayjs } from "dayjs";
import useDayjs from "../../common/useDayjs";
import { AcceptanceStatus, Entry } from "../../graphql/generated/graphql";
import DeleteEntryButton from "./DeleteEntryButton";
import DimensionChip from "./DimensionChip";
import EditEntryButton from "./EditEntryButton";
import AcceptedChip from "./status-chips/AcceptedChip";
import PaidChip from "./status-chips/PaidChip";

type EntryFlexRowProps = {
  entry: Entry;
  date: Dayjs;
};

const EntryFlexRow = ({ entry, date }: EntryFlexRowProps) => {
  const dayjs = useDayjs();
  const { product, activity, issue, client, description } = entry;
  const accepted = entry.acceptanceStatus === AcceptanceStatus.Accepted;
  const paid = entry.acceptanceStatus === AcceptanceStatus.Paid;

  return (
    <Box
      sx={{
        bgcolor: grey[800],
        borderRadius: 4,
        pl: 1,
        pr: accepted || paid ? 0 : 1,
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          overflowX: { xs: "auto", md: "hidden" },
          overflowY: "hidden",
          whiteSpace: "nowrap",
          mr: 1,
          pt: 1,
          pb: 1,
          minHeight: 48,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            minWidth: 60,
            textAlign: "right",
            mr: 1,
          }}
        >
          <Typography variant="h6">
            {dayjs.duration(entry.duration, "hour").format("H:mm")}
          </Typography>
        </Box>
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
        {description && (
          <Typography
            variant="subtitle2"
            sx={{ overflow: { xs: "visible", md: "hidden" }, textOverflow: "ellipsis" }}
          >
            {description}
          </Typography>
        )}
      </Box>
      {accepted ? (
        <Box>
          <AcceptedChip />
        </Box>
      ) : paid ? (
        <Box>
          <PaidChip />
        </Box>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <EditEntryButton date={date} entry={entry} />
          </Box>
          <Box sx={{ display: { xs: "none", md: "block" }, ml: -0.5 }}>
            <DeleteEntryButton date={date} entryKey={entry.key} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EntryFlexRow;
