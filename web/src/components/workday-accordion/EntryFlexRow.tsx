import { Box, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Dayjs } from "dayjs";
import useDayjs from "../../common/useDayjs";
import { AcceptanceStatus, Entry } from "../../graphql/generated/graphql";
import useDarkMode from "../../theme/useDarkMode";
import DeleteEntryButton from "./DeleteEntryButton";
import DimensionChip from "./DimensionChip";
import EditEntryButton from "./EditEntryButton";
import AcceptedChip from "./status-chips/AcceptedChip";
import OpenChip from "./status-chips/OpenChip";
import PaidChip from "./status-chips/PaidChip";

type EntryFlexRowProps = {
  entry: Entry;
  date: Dayjs;
};

const EntryFlexRow = ({ entry, date }: EntryFlexRowProps) => {
  const { darkMode } = useDarkMode();
  const dayjs = useDayjs();
  const { product, activity, issue, client, description } = entry;
  const accepted = entry.acceptanceStatus === AcceptanceStatus.Accepted;
  const paid = entry.acceptanceStatus === AcceptanceStatus.Paid;
  const open = entry.acceptanceStatus === AcceptanceStatus.Open;

  return (
    <Box
      sx={{
        bgcolor: darkMode ? grey[800] : "primary.light",
        borderRadius: 4,
        pl: 1,
        pr: accepted || paid || open ? 0 : 1,
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
        {product && <DimensionChip dimension="product" label={product} />}
        {activity && <DimensionChip dimension="activity" label={activity} />}
        {issue && <DimensionChip dimension="issue" label={issue} />}
        {client && <DimensionChip dimension="client" label={client} />}
        {description && (
          <Typography
            variant="subtitle2"
            sx={{ overflow: { xs: "visible", md: "hidden" }, textOverflow: "ellipsis" }}
          >
            {description}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex" }}>
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
        {open && (
          <Box>
            <OpenChip />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EntryFlexRow;
