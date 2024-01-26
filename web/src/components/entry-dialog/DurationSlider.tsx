import { Box, Slider } from "@mui/material";
import { TimeField } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import useDayjs from "../../common/useDayjs";
import { EntryFormSchema } from "./EntryDialog";

type DurationSliderProps = {
  field: ControllerRenderProps<EntryFormSchema, "duration">;
};

const DurationSlider = ({ field }: DurationSliderProps) => {
  const dayjs = useDayjs();
  const [duration, setDuration] = useState(0);
  const [timeFieldValue, setTimeFieldValue] = useState(dayjs().hour(0).minute(0));

  useEffect(() => {
    const totalHours = duration / 60;
    field.onChange(totalHours.toString());
  }, [duration, field]);

  const handleTimeFieldChange = (value: Dayjs | null) => {
    if (!value) {
      return null;
    }

    const totalMinutes = value.hour() * 60 + value.minute();
    setDuration(totalMinutes);
    setTimeFieldValue(value);
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    if (typeof value !== "number") {
      throw new Error("Invalid slider value.");
    }

    setDuration(value);
    setTimeFieldValue(
      dayjs()
        .hour(value / 60)
        .minute(value % 60),
    );
  };

  return (
    <Box>
      <TimeField value={timeFieldValue} onChange={handleTimeFieldChange} />
      <Slider min={0} max={600} step={15} value={duration} onChange={handleSliderChange} />
    </Box>
  );
};

export default DurationSlider;
