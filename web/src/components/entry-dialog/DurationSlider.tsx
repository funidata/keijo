import { Box, Slider } from "@mui/material";
import { TimeField } from "@mui/x-date-pickers-pro";
import { Dayjs } from "dayjs";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useDayjs from "../../common/useDayjs";

type DurationSliderProps<T extends FieldValues, E extends FieldPath<T>> = {
  field: ControllerRenderProps<T, E>;
};

const DurationSlider = <T extends FieldValues, E extends FieldPath<T>>({
  field,
}: DurationSliderProps<T, E>) => {
  const { t } = useTranslation();
  const dayjs = useDayjs();
  const hoursDecimal = Number(field.value || 0);
  const timeFieldValue = dayjs()
    .hour(hoursDecimal)
    .minute(Math.round((hoursDecimal % 1) * 60));

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: { xs: 2, md: 0 },
      }}
    >
      <TimeField
        value={timeFieldValue}
        onChange={handleTimeFieldChange}
        label={t("entryDialog.duration")}
        ampm={false}
        sx={{
          width: { xs: "100%", md: "50%" },
          input: { textAlign: "center", fontSize: "2rem", fontWeight: "bold" },
        }}
      />
      <Slider
        min={0}
        max={600}
        step={15}
        value={hoursDecimal * 60}
        onChange={handleSliderChange}
        sx={{ mt: 2 }}
      />
    </Box>
  );
};

export default DurationSlider;
