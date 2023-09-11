import { useQuery } from "@apollo/client";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import { EntryFormSchema } from ".";
import { FindRecordTypesDocument } from "../../graphql/generated/graphql";

type RecordTypeSelectProps = {
  control: Control<EntryFormSchema, any>;
};

const RecordTypeSelect = ({ control }: RecordTypeSelectProps) => {
  const { data } = useQuery(FindRecordTypesDocument);
  const label = "Record Type";
  const labelId = "record-type-select";

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        name="recordType"
        control={control}
        render={({ field }) => (
          <Select labelId={labelId} label={label} {...field}>
            {data?.findRecordTypes.map((recordType) => (
              <MenuItem
                key={`record-type-option-${recordType.ratioNumber}`}
                value={recordType.ratioNumber}
              >
                {recordType.name}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default RecordTypeSelect;
