import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionSummary, Box, Chip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { roundToFullMinutes, totalDurationOfEntries } from "../../common/duration";
import useDayjs from "../../common/useDayjs";
import {
  isFlexLeaveDay,
  isHoliday,
  isSickLeave,
  isSpecialSingleEntryDay,
  isVacation,
  isWeekend,
} from "../../common/workdayUtils";
import {
  AddWorkdayEntryDocument,
  Entry,
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

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdaySummary = ({ workday }: WorkdayAccordionProps) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const dayjs = useDayjs();
  const date = dayjs(workday.date).locale(dayjs.locale());
  const holiday = isHoliday(date);
  const weekend = isWeekend(date);
  const vacation = isVacation(workday);
  const flexLeave = isFlexLeaveDay(workday);
  const sickLeave = isSickLeave(workday);
  const disabled = isSpecialSingleEntryDay(workday);

  const totalDuration = totalDurationOfEntries(workday.entries);
  const totalHoursFormatted = roundToFullMinutes(totalDuration).format("H:mm");

  const empty = workday.entries.length === 0;
  const { t } = useTranslation();

  const { selectedEntry, setSelectedEntry } = useEntryContext();
  const { showSuccessNotification } = useNotification();
  const [addWorkdayEntryMutation] = useMutation(AddWorkdayEntryDocument, {
    refetchQueries: [FindWorkdaysDocument],
    onCompleted: async () => {
      showSuccessNotification(t("notifications.addEntry.success"));
    },
  });
  const handlePasteEntry = async (entry: Entry) => {
    await addWorkdayEntryMutation({
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
    setSelectedEntry(null);
  };

  const InfoChip = () => {
    if (vacation) {
      return <VacationChip />;
    }
    if (flexLeave) {
      return <FlexLeaveChip />;
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
      return <NoEntriesChip />;
    }
    return null;
  };

  return (
    <AccordionSummary expandIcon={!disabled && <ExpandMoreIcon />}>
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
            disabled ? { display: "flex", flexDirection: "row", alignItems: "center", gap: 2 } : {}
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {selectedEntry ? (
            <PasteEntryButton
              onClick={(e) => {
                e.stopPropagation();
                handlePasteEntry(selectedEntry);
              }}
            />
          ) : null}
          {!disabled && (
            <>
              <EntryDialogButton date={date} size="medium" />
              <Chip label={`${totalHoursFormatted} h`} sx={{ mr: 2, color: "inherit" }} />
            </>
          )}
          {disabled && !mobile && <Box sx={{ width: 133 }} />}
        </Box>
      </Box>
    </AccordionSummary>
  );
};

export default WorkdaySummary;
