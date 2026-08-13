import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";
import { AcceptanceStatus } from "../../../graphql/generated/graphql";
import useDarkMode from "../../../theme/useDarkMode";
import EditEntryButton from "./EditEntryButton";
import { EntryRowProps } from "./EntryRow";
import AcceptedChip from "./status-chips/AcceptedChip";
import OpenChip from "./status-chips/OpenChip";
import PaidChip from "./status-chips/PaidChip";
import MobileEntryListItem from "./MobileEntryListItem";
import { EntryType } from "../../../common/entryType.enum";

const MobileEntryRow = ({ entry, date }: EntryRowProps) => {
  const { darkMode } = useDarkMode();
  const { ratioNumber } = entry;
  const editable = ratioNumber === EntryType.NormalWork;
  const accepted = entry.acceptanceStatus === AcceptanceStatus.Accepted;
  const paid = entry.acceptanceStatus === AcceptanceStatus.Paid;
  const open = entry.acceptanceStatus === AcceptanceStatus.Open;

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
        </>
      }
      sx={{
        bgcolor: darkMode ? grey[800] : "primary.light",
        pr: accepted || paid || open ? 0 : 1,
      }}
    />
  );
};

export default MobileEntryRow;
