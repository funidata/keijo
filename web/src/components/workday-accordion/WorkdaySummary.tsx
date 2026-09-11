import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useMutation } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { roundToFullMinutes, totalDurationOfEntries } from "../../common/duration";
import useDayjs from "../../common/useDayjs";
import { isSpecialSingleEntryDay } from "../../common/workdayUtils";
import {
  AddWorkdayEntryDocument,
  EntryTemplateType,
  FindWorkdaysDocument,
  Workday,
} from "../../graphql/generated/graphql";
import EntryDialogButton from "../entry-dialog/EntryDialogButton";
import { useEntryContext } from "../workday-browser/entry-context/useEntryContext";
import { useNotification } from "../global-notification/useNotification";
import PasteEntryButton from "./PasteEntryButton";
import PasteEditEntryButton from "./PasteEditEntryButton";
import InfoChip from "./info-chips/InfoChip";

type WorkdayAccordionProps = {
  workday: Workday;
};

const WorkdaySummary = ({ workday }: WorkdayAccordionProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const dayjs = useDayjs();
  const date = dayjs(workday.date).locale(dayjs.locale());
  const isCurrentDay = date.isSame(dayjs(), "day");
  const disabled = isSpecialSingleEntryDay(workday);

  const totalDuration = totalDurationOfEntries(workday.entries);
  const totalHoursFormatted = roundToFullMinutes(totalDuration).format("H:mm");

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

  return (
    <Box sx={{ position: "relative" }}>
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
              disabled
                ? { display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }
                : {}
            }
          >
            <Typography
              sx={{
                textTransform: "capitalize",
                position: "relative",
                minWidth: 105,
                ...(isCurrentDay && { fontWeight: "medium" }),
              }}
              aria-current={isCurrentDay ? "date" : undefined}
            >
              {date.format("dd l")}
              <Typography
                component="span"
                sx={{ position: "absolute", paddingLeft: 1, fontWeight: "medium" }}
              >
                {isCurrentDay && !mobile && `(${t("general.today")})`}
              </Typography>
            </Typography>
            {mobile && (
              <Box sx={!disabled ? { mt: 1 } : {}}>
                <InfoChip workday={workday} date={date} />
              </Box>
            )}
          </Box>
          {!mobile && <InfoChip workday={workday} date={date} />}
          <Stack direction="row" sx={{ alignItems: "center" }}>
            {!disabled && (
              <Chip
                label={`${totalHoursFormatted} h`}
                sx={{
                  mr: 2,
                  color: "inherit",
                  ...(isCurrentDay && { fontWeight: "medium" }),
                }}
              />
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
              <PasteEntryButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePasteEntries(selectedEntries);
                }}
              />
              <PasteEditEntryButton date={date} />
            </>
          )}
          {!hasEntries && <EntryDialogButton date={date} size="medium" />}
        </Stack>
      )}
    </Box>
  );
};

export default WorkdaySummary;
