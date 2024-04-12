import { useMediaQuery, useTheme } from "@mui/material";
import { Dayjs } from "dayjs";
import { EntryType } from "../../../common/entryType.enum";
import { Entry } from "../../../graphql/generated/graphql";
import DesktopEntryRow from "./DesktopEntryRow";
import MobileEntryRow from "./MobileEntryRow";
import UnknownEntry from "./UnknownEntry";

export type EntryRowProps = {
  entry: Entry;
  date: Dayjs;
};

const EntryRow = (props: EntryRowProps) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const entryTypes = Object.values(EntryType) as string[];
  const unknownEntryType = !entryTypes.includes(props.entry.typeName);

  if (unknownEntryType) {
    return <UnknownEntry {...props} />;
  }

  return mobile ? <MobileEntryRow {...props} /> : <DesktopEntryRow {...props} />;
};

export default EntryRow;
