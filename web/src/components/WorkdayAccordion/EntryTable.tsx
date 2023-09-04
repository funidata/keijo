import { useQuery } from "@apollo/client";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Entry, FindDimensionNamesDocument, Workday } from "../../graphql/generated/graphql";

type EntryTableProps = {
  workday: Workday;
};

const EntryTable = ({ workday }: EntryTableProps) => {
  const { data } = useQuery(FindDimensionNamesDocument);

  if (!data) {
    return null;
  }

  const { findDimensionNames } = data;

  const tableHeadCellKey = (name: string) => [workday.date, name, "head"].join("-");
  const tableRowKey = (entry: Entry) =>
    [
      workday.date,
      entry.entryType,
      entry.duration,
      ...entry.dimensions.map((dim) => dim.value),
    ].join("-");
  const dimensionValueCellKey = (entry: Entry, name: string) =>
    [tableRowKey(entry), name].join("-");

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Type</TableCell>
          <TableCell>Duration</TableCell>
          {findDimensionNames.map((name) => (
            <TableCell key={tableHeadCellKey(name)}>{name}</TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {workday.entries.map((entry) => (
          <TableRow key={tableRowKey(entry)}>
            <TableCell>{entry.entryType}</TableCell>
            <TableCell>{entry.duration}</TableCell>
            {findDimensionNames.map((name) => (
              <TableCell key={dimensionValueCellKey(entry, name)}>
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
