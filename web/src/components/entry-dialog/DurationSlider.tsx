import { Box, Slider } from "@mui/material";
import { TimeField } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { ControllerRenderProps } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useDayjs from "../../common/useDayjs";
import { EntryFormSchema } from "./EntryDialog";

type DurationSliderProps = {
  field: ControllerRenderProps<EntryFormSchema, "duration">;
};

const DurationSlider = ({ field }: DurationSliderProps) => {
  const { t } = useTranslation();
  const dayjs = useDayjs();
  const hoursDecimal = Number(field.value);
  const timeFieldValue = dayjs()
    .hour(hoursDecimal)
    .minute((hoursDecimal % 1) * 60);

  const handleTimeFieldChange = (value: Dayjs | null) => {
    if (!value) {
      return null;
    }

    field.onChange(value.hour() + value.minute() / 60);
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    if (typeof value !== "number") {
      throw new Error("Invalid slider value.");
    }

    field.onChange(value / 60);
  };

  return (
    <Box>
      <TimeField
        value={timeFieldValue}
        onChange={handleTimeFieldChange}
        label={t("entryDialog.duration")}
      />
      <Slider min={0} max={600} step={15} value={hoursDecimal * 60} onChange={handleSliderChange} />
    </Box>
  );
};

export default DurationSlider;
