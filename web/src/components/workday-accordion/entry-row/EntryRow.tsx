import { useMediaQuery, useTheme } from "@mui/material";
import { Dayjs } from "dayjs";
import { Entry } from "../../../graphql/generated/graphql";
import DesktopEntryRow from "./DesktopEntryRow";
import MobileEntryRow from "./MobileEntryRow";

export type EntryRowProps = {
  entry: Entry;
  date: Dayjs;
};

const EntryRow = (props: EntryRowProps) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  return mobile ? <MobileEntryRow {...props} /> : <DesktopEntryRow {...props} />;
};

export default EntryRow;
