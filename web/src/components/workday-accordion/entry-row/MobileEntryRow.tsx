import { Box, ListItem, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import dayjs from "dayjs";
import { roundToFullMinutes } from "../../../common/duration";
import { AcceptanceStatus } from "../../../graphql/generated/graphql";
import useDarkMode from "../../../theme/useDarkMode";
import DimensionChip from "./DimensionChip";
import EditEntryButton from "./EditEntryButton";
import { EntryRowProps } from "./EntryRow";
import AcceptedChip from "./status-chips/AcceptedChip";
import OpenChip from "./status-chips/OpenChip";
import PaidChip from "./status-chips/PaidChip";
import { EntryType } from "../../../common/entryType.enum";

const MobileEntryRow = ({ entry, date }: EntryRowProps) => {
  const { darkMode } = useDarkMode();
  const { product, activity, issue, client, description, ratioNumber, typeName } = entry;
  const editable = ratioNumber === EntryType.NormalWork;
  const accepted = entry.acceptanceStatus === AcceptanceStatus.Accepted;
  const paid = entry.acceptanceStatus === AcceptanceStatus.Paid;
  const open = entry.acceptanceStatus === AcceptanceStatus.Open;
  const roundedDuration = roundToFullMinutes(dayjs.duration(entry.duration, "hour"));

  return (
    <ListItem
      sx={{
        bgcolor: darkMode ? grey[800] : "primary.light",
        borderRadius: 4,
        pl: 1,
        pr: accepted || paid || open ? 0 : 1,
        pt: 0,
        pb: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", minHeight: 40 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            minWidth: 50,
            mr: 1,
          }}
        >
          <Typography variant="h6">{roundedDuration.format("H:mm")}</Typography>
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
              {editable && (
                <Box>
                  <EditEntryButton date={date} entry={entry} />
                </Box>
              )}
            </Box>
          )}
          {open && (
            <Box>
              <OpenChip />
            </Box>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
          mr: 1,
          pb: 1,
          minHeight: 48,
        }}
      >
        {product && <DimensionChip dimension="product" label={product} />}
        {activity && <DimensionChip dimension="activity" label={activity} />}
        {issue && <DimensionChip dimension="issue" label={issue} />}
        {client && <DimensionChip dimension="client" label={client} />}
        {(paid || open || accepted) && !product && !activity && !issue && !client && typeName && (
          <Typography variant="subtitle1" sx={{ width: "100%", mt: 1, ml: 1 }}>
            {typeName}
          </Typography>
        )}
        {description && (
          <Typography variant="subtitle2" sx={{ width: "100%", mt: 1, ml: 1 }}>
            {description}
          </Typography>
        )}
      </Box>
    </ListItem>
  );
};

export default MobileEntryRow;
