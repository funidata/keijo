import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Entry } from "../../graphql/generated/graphql";

type EntryTableProps = {
  entries: Entry[];
};

const EntryTable = ({ entries }: EntryTableProps) => {
  return (
    <Table>
      <TableHead>
        <TableCell>Type</TableCell>
        <TableCell>Duration</TableCell>
      </TableHead>

      <TableBody>
        {
          // FIXME: TableRow needs a proper key!
        }
        {entries.map((entry) => (
          <TableRow key={entry.duration}>
            <TableCell>{entry.entryType}</TableCell>
            <TableCell>{entry.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EntryTable;
