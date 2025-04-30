import { Autocomplete, AutocompleteProps, FormControl, Grid, TextField } from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";

type FormComboBoxProps<T extends FieldValues, E> = {
  form: UseFormReturn<T>;
  name: string;
  title: string;
  rules?: ControllerProps["rules"];
  autoCompleteProps: Omit<
    AutocompleteProps<E, false, boolean | undefined, true>,
    "renderInput" | "value"
  >;
  getFormValue?: (value: E) => string;
};

const FormComboBox = <T extends FieldValues, E>({
  form,
  name,
  title,
  rules,
  autoCompleteProps,
  getFormValue,
}: FormComboBoxProps<T, E>) => {
  return (
    <Grid
      size={{
        xs: 12,
        md: 6,
      }}
    >
      <FormControl fullWidth>
        <Controller
          control={form.control as unknown as Control<FieldValues>}
          name={name}
          rules={rules}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Autocomplete
              autoHighlight
              freeSolo
              forcePopupIcon
              {...autoCompleteProps}
              value={value || null}
              onChange={(_, v) => {
                if (typeof v === "string" || v === null || !getFormValue) {
                  onChange(v);
                  return;
                }
                onChange(getFormValue(v));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={title}
                  onChange={onChange}
                  error={!!error}
                  helperText={error?.message as string}
                />
              )}
            />
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default FormComboBox;
