import { TextField } from "@mui/material";
import { Control, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { FindDimensionOptionsDocument } from "../../graphql/generated/graphql";
import { useQuery } from "@apollo/client";
import DimensionController from "../../components/entry-dialog/DimensionController";
import JiraIssueAutoComplete from "./JiraIssueAutoComplete";

type JiraIssueComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "issue";
  title: string;
  rules?: ControllerProps["rules"];
};

const JiraIssueComboBox = <T extends FieldValues>({
  form,
  name,
  title,
  rules,
}: JiraIssueComboBoxProps<T>) => {
  const { data } = useQuery(FindDimensionOptionsDocument);
  const options = data?.findDimensionOptions[name] || [];

  return (
    <DimensionController
      control={form.control as unknown as Control<FieldValues>}
      name={name}
      rules={rules}
      render={({ field: { value, onChange } }) => (
        <JiraIssueAutoComplete
          options={options}
          value={value}
          onChange={(_, value) => onChange(value)}
          autoHighlight
          renderInput={(params) => (
            <TextField
              {...params}
              label={title}
              onChange={onChange}
              error={!!form.formState.errors[name]}
              helperText={form.formState.errors[name]?.message as string}
            />
          )}
        />
      )}
    />
  );
};

export default JiraIssueComboBox;
