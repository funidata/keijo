import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import { useMutation } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { alpha } from "@mui/material/styles";
import { roundToFullMinutes, totalDurationOfEntries } from "../../common/duration";
import useDayjs from "../../common/useDayjs";
import {
  isFlexLeaveDay,
  isHoliday,
  isHolidayPayLeave,
  isSickLeave,
  isSpecialSingleEntryDay,
  isVacation,
  isWeekend,
} from "../../common/workdayUtils";
import {
  AddWorkdayEntryDocument,
  EntryTemplateType,
  FindWorkdaysDocument,
  Workday,
} from "../../graphql/generated/graphql";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import FlexLeaveChip from "./info-chips/FlexLeaveChip";
import HolidayChip from "./info-chips/HolidayChip";
import NoEntriesChip from "./info-chips/NoEntriesChip";
import SickLeaveChip from "./info-chips/SickLeaveChip";
import VacationChip from "./info-chips/VacationChip";
import WeekendChip from "./info-chips/WeekendChip";
import { useEntryContext } from "../workday-browser/entry-context/useEntryContext";
import { useNotification } from "../global-notification/useNotification";
import PasteEntryButton from "./PasteEntryButton";
import PasteEditEntryButton from "./PasteEditEntryButton";
import HolidayPayLeaveChip from "./info-chips/HolidayPayLeaveChip";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdaySummary = ({ workday }: WorkdayAccordionProps) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const dayjs = useDayjs();
  const date = dayjs(workday.date).locale(dayjs.locale());
  const isCurrentDay = date.isSame(dayjs(), "day");
  const holiday = isHoliday(date);
  const weekend = isWeekend(date);
  const vacation = isVacation(workday);
  const flexLeave = isFlexLeaveDay(workday);
  const holidayPayLeave = isHolidayPayLeave(workday);
  const sickLeave = isSickLeave(workday);
  const disabled = isSpecialSingleEntryDay(workday);

  const totalDuration = totalDurationOfEntries(workday.entries);
  const totalHoursFormatted = roundToFullMinutes(totalDuration).format("H:mm");

  const empty = workday.entries.length === 0;
  const { t } = useTranslation();

  const { selectedEntries, hasEntries, clearEntries } = useEntryContext();
  const { showSuccessNotification } = useNotification();
  const [addWorkdayEntryMutation] = useMutation(AddWorkdayEntryDocument, {
    refetchQueries: [FindWorkdaysDocument],
    onCompleted: async () => {
      showSuccessNotification(t("notifications.addEntry.success"));
    },
  });
  const handlePasteEntries = (entries: EntryTemplateType[]) => {
    entries.forEach((entry) => {
      addWorkdayEntryMutation({
        variables: {
          entry: {
            date: date.format("YYYY-MM-DD"),
            duration: entry.duration,
            description: entry.description,
            product: entry.product,
            activity: entry.activity,
            issue: entry.issue,
            client: entry.client,
          },
        },
      });
    });
    clearEntries();
  };

  const InfoChip = () => {
    if (vacation) {
      return <VacationChip />;
    }
    if (flexLeave) {
      return <FlexLeaveChip />;
    }
    if (holidayPayLeave) {
      return <HolidayPayLeaveChip />;
    }
    if (sickLeave) {
      return <SickLeaveChip />;
    }
    if (weekend) {
      return <WeekendChip />;
    }
    if (holiday) {
      return <HolidayChip />;
    }
    if (empty) {
      return <NoEntriesChip sx={{ borderColor: isCurrentDay ? "grey.800" : "grey.400" }} />;
    }
    return null;
  };

  return (
    <Box sx={{ position: "relative" }}>
      <AccordionSummary
        expandIcon={!disabled && <ExpandMoreIcon />}
        aria-current={isCurrentDay ? "date" : undefined}
        sx={{
          border: isCurrentDay ? "1px solid" : "none",
          borderColor: isCurrentDay ? "secondary.main" : "transparent",
          backgroundColor: isCurrentDay
            ? (theme) =>
                alpha(theme.palette.secondary.main, theme.palette.mode === "dark" ? 0.4 : 0.6)
            : "inherit",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={
              disabled
                ? { display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }
                : {}
            }
          >
            <Typography sx={{ textTransform: "capitalize", minWidth: 105 }}>
              {date.format("dd l")}
            </Typography>
            {mobile && (
              <Box sx={!disabled ? { mt: 1 } : {}}>
                <InfoChip />
              </Box>
            )}
          </Box>
          {!mobile && <InfoChip />}
          <Stack direction="row" sx={{ alignItems: "center" }}>
            {!disabled && (
              <>
                <Chip
                  label={`${totalHoursFormatted} h`}
                  sx={{
                    mr: 2,
                    color: "inherit",
                    border: isCurrentDay ? "1px solid" : "none",
                    borderColor: isCurrentDay ? "grey.800" : "grey.400",
                  }}
                />
              </>
            )}
            {disabled && !mobile && <Box sx={{ width: 133 }} />}
          </Stack>
        </Box>
      </AccordionSummary>
      {!disabled && (
        <Stack
          direction="row"
          sx={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "120px" }}
        >
          {hasEntries && (
            <>
              <PasteEditEntryButton date={date} />
              <PasteEntryButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePasteEntries(selectedEntries);
                }}
              />
            </>
          )}
          {!hasEntries && <EntryDialogButton date={date} size="medium" />}
        </Stack>
      )}
    </Box>
  );
};

export default WorkdaySummary;
