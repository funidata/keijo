import { Autocomplete, AutocompleteProps, FormControl, Grid, TextField } from "@mui/material";
import { Control, Controller, ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";

type FormComboBoxProps<T extends FieldValues, E> = {
  form: UseFormReturn<T>;
  name: string;
  title: string;
  rules?: ControllerProps["rules"];
  autoCompleteProps: Omit<
    AutocompleteProps<E, boolean | undefined, boolean | undefined, boolean | undefined>,
    "renderInput" | "value"
  >;
};

const FormComboBox = <T extends FieldValues, E>({
  form,
  name,
  title,
  rules,
  autoCompleteProps,
}: FormComboBoxProps<T, E>) => {
  return (
    <Grid item xs={12} md={6}>
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
              clearOnBlur
              {...autoCompleteProps}
              value={value || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={title}
                  onChange={onChange}
                  error={!!error}
                  helperText={error?.message as string}
                />
              )}
              onInputChange={(event, value, reason) => {
                if (autoCompleteProps?.onInputChange) {
                  autoCompleteProps.onInputChange(event, value, reason);
                }
                onChange(value);
              }}
            />
          )}
        />
      </FormControl>
    </Grid>
  );
};

export default FormComboBox;
