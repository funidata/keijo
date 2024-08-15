import { Box, ListItemProps, useMediaQuery, useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import EntryListItem from "../workday-accordion/entry-row/EntryListItem";
import CopyEntryButton from "../workday-accordion/entry-row/CopyEntryButton";
import { EntryTemplateType } from "../../graphql/generated/graphql";
import { useEntryContext } from "../workday-browser/entry-context/useEntryContext";
import useDarkMode from "../../theme/useDarkMode";
import MobileEntryListItem from "../workday-accordion/entry-row/MobileEntryListItem";

type EntryTemplateRowProps = {
  entry: EntryTemplateType;
  listItemProps?: ListItemProps;
};

const EntryTemplateRow = ({ entry, listItemProps }: EntryTemplateRowProps) => {
  const { darkMode } = useDarkMode();
  const { hasEntry } = useEntryContext();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {!mobile ? (
        <EntryListItem
          action={
            <>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box>
                  <CopyEntryButton entry={entry} />
                </Box>
                <Box></Box>
                <Box sx={{ display: { xs: "none", md: "block" }, ml: -0.5 }}></Box>
              </Box>
            </>
          }
          entry={entry}
          {...listItemProps}
          sx={{
            bgcolor: darkMode ? grey[800] : "primary.light",

            backgroundColor: (theme) =>
              hasEntry(entry)
                ? darkMode
                  ? theme.palette.grey[700]
                  : theme.palette.primary.main
                : undefined,
            ...listItemProps?.sx,
          }}
        />
      ) : (
        <MobileEntryListItem
          entry={entry}
          action={
            <>
              <Box>
                <CopyEntryButton entry={entry} />
              </Box>
            </>
          }
          {...listItemProps}
          sx={{
            bgcolor: darkMode ? grey[800] : "primary.light",
            backgroundColor: (theme) =>
              hasEntry(entry)
                ? darkMode
                  ? theme.palette.grey[700]
                  : theme.palette.primary.main
                : undefined,
            ...listItemProps?.sx,
          }}
        />
      )}
    </>
  );
};

export default EntryTemplateRow;
