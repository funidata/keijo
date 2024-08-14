import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { AcceptanceStatus } from "../../../graphql/generated/graphql";
import useDarkMode from "../../../theme/useDarkMode";
import EditEntryButton from "./EditEntryButton";
import { EntryRowProps } from "./EntryRow";
import AcceptedChip from "./status-chips/AcceptedChip";
import OpenChip from "./status-chips/OpenChip";
import PaidChip from "./status-chips/PaidChip";
import CopyEntryButton from "./CopyEntryButton";
import MobileEntryListItem from "./MobileEntryListItem";
import { useEntryContext } from "../../workday-browser/entry-context/useEntryContext";

const MobileEntryRow = ({ entry, date }: EntryRowProps) => {
  const { darkMode } = useDarkMode();
  const accepted = entry.acceptanceStatus === AcceptanceStatus.Accepted;
  const paid = entry.acceptanceStatus === AcceptanceStatus.Paid;
  const open = entry.acceptanceStatus === AcceptanceStatus.Open;
  const { hasEntry } = useEntryContext();

  return (
    <MobileEntryListItem
      entry={entry}
      action={
        <>
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
                <CopyEntryButton entry={entry} />
                <EditEntryButton date={date} entry={entry} />
              </Box>
            </Box>
          )}
          {open && (
            <Box>
              <OpenChip />
            </Box>
          )}
        </>
      }
      sx={{
        bgcolor: darkMode ? grey[800] : "primary.light",
        pr: accepted || paid || open ? 0 : 1,
        backgroundColor: (theme) =>
          hasEntry(entry)
            ? darkMode
              ? theme.palette.grey[700]
              : theme.palette.primary.main
            : undefined,
      }}
    />
  );
};

export default MobileEntryRow;
