import { ControllerProps, FieldValues, UseFormReturn } from "react-hook-form";
import { useDimensionOptions } from "../../common/useDimensionOptions";
import FormComboBox from "./FormComboBox";

type DimensionComboBoxProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: "product" | "activity" | "issue" | "client";
  title: string;
  rules?: ControllerProps["rules"];
};

const DimensionComboBox = <T extends FieldValues>({ ...props }: DimensionComboBoxProps<T>) => {
  const dimensionOptions = useDimensionOptions();
  const options = dimensionOptions[props.name];

  return <FormComboBox {...props} autoCompleteProps={{ options }} />;
};

export default DimensionComboBox;
