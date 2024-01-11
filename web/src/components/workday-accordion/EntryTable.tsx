import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";
import dayjs from "../../common/dayjs";
import { Workday } from "../../graphql/generated/graphql";
import DeleteEntryButton from "./DeleteEntryButton";
import EditEntryButton from "./EditEntryButton";

type EntryTableProps = {
  workday: Workday;
};

const EntryTable = ({ workday }: EntryTableProps) => {
  const { t } = useTranslation();

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>{t("entryTable.head.type")}</TableCell>
          <TableCell>{t("entryTable.head.duration")}</TableCell>
          <TableCell>{t("dimensionNames.product")}</TableCell>
          <TableCell>{t("dimensionNames.activity")}</TableCell>
          <TableCell>{t("dimensionNames.issue")}</TableCell>
          <TableCell>{t("dimensionNames.client")}</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>

      <TableBody>
        {workday.entries.map((entry) => (
          <TableRow key={`entry-row-${entry.key}`}>
            <TableCell>{entry.entryType}</TableCell>
            <TableCell>{entry.duration}</TableCell>
            <TableCell>{entry.product}</TableCell>
            <TableCell>{entry.activity}</TableCell>
            <TableCell>{entry.issue}</TableCell>
            <TableCell>{entry.client}</TableCell>
            <TableCell>
              <EditEntryButton entry={entry} date={dayjs(workday.date)} />
              <DeleteEntryButton entryKey={entry.key} date={dayjs(workday.date)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EntryTable;
