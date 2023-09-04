import { useQuery } from "@apollo/client";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Entry, FindDimensionNamesDocument } from "../../graphql/generated/graphql";

type EntryTableProps = {
  entries: Entry[];
};

const EntryTable = ({ entries }: EntryTableProps) => {
  const { data } = useQuery(FindDimensionNamesDocument);

  if (!data) {
    return null;
  }

  const { findDimensionNames } = data;

  return (
    <Table size="small">
      <TableHead>
        <TableCell>Type</TableCell>
        <TableCell>Duration</TableCell>
        {findDimensionNames.map((name) => (
          <TableCell key={name}>{name}</TableCell>
        ))}
      </TableHead>

      <TableBody>
        {
          // FIXME: TableRow needs a proper key!
        }
        {entries.map((entry) => (
          <TableRow key={entry.duration}>
            <TableCell>{entry.entryType}</TableCell>
            <TableCell>{entry.duration}</TableCell>
            {findDimensionNames.map((name) => (
              <TableCell key={[name, entry.duration].join()}>
                {entry.dimensions.find((dim) => dim.name === name)?.value}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EntryTable;
