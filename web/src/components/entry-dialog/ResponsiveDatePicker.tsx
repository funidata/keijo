import { useMediaQuery, useTheme } from "@mui/material";
import { DatePicker, StaticDatePicker } from "@mui/x-date-pickers-pro";
import { ControllerRenderProps } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useDayjs from "../../common/useDayjs";
import { EntryFormSchema } from "../entry-form/useEntryForm";

type ResponsiveDatePickerProps = {
  field: ControllerRenderProps<EntryFormSchema, "date">;
};

const ResponsiveDatePicker = ({ field }: ResponsiveDatePickerProps) => {
  const { t } = useTranslation();
  const dayjs = useDayjs();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  if (mobile) {
    return <DatePicker {...field} label={t("entryDialog.date")} sx={{ width: "100%" }} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref: _, ...rest } = field;

  return (
    <StaticDatePicker
      {...rest}
      value={rest.value || dayjs()}
      orientation="landscape"
      slots={{ actionBar: () => null }}
      localeText={{
        toolbarTitle: t("entryDialog.date"),
      }}
      sx={{
        ".MuiPickersToolbar-content": { pb: 4 },
      }}
    />
  );
};

export default ResponsiveDatePicker;
