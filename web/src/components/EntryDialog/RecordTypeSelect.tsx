import { useQuery } from "@apollo/client";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FindRecordTypesDocument } from "../../graphql/generated/graphql";

const RecordTypeSelect = () => {
  const { data } = useQuery(FindRecordTypesDocument);
  const label = "Record Type";
  const labelId = "record-type-select";

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select labelId={labelId} label={label}>
        {data?.findRecordTypes.map((recordType) => (
          <MenuItem
            key={`record-type-option-${recordType.ratioNumber}`}
            value={recordType.ratioNumber}
          >
            {recordType.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default RecordTypeSelect;
