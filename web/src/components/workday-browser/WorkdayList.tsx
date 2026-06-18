import { useMutation, useQuery } from "@apollo/client/react";
import { Box, Button, Collapse, Paper } from "@mui/material";
import { range } from "lodash";
import useDayjs from "../../common/useDayjs";
import {
  FindWorkdaysDocument,
  GetMySettingsDocument,
  UpdateSettingsDocument,
  Workday,
} from "../../graphql/generated/graphql";
import WorkdayAccordion from "../workday-accordion/WorkdayAccordion";
import LoadingIndicator from "./LoadingIndicator";
import TotalHours from "./TotalHours";
import { useWorkdayBrowserParams } from "./useWorkdayBrowserParams";
import { isWeekend } from "../../common/workdayUtils";
import { t } from "i18next";

const WorkdayList = () => {
  const dayjs = useDayjs();

  const { from, to, formattedFrom, formattedTo } = useWorkdayBrowserParams();
  const { data: settingsData } = useQuery(GetMySettingsDocument);
  const [updateSettings] = useMutation(UpdateSettingsDocument, {
    refetchQueries: [GetMySettingsDocument],
  });

  const { data } = useQuery(FindWorkdaysDocument, {
    variables: { start: formattedFrom, end: formattedTo },
    // Poll every 5 minutes, mainly to keep IDP session alive.
    pollInterval: 5 * 60 * 1000,
  });

  if (!data) {
    return <LoadingIndicator />;
  }

  const normalizedStart = from.hour(0).minute(0).second(0).millisecond(0);
  const normalizedEnd = to.hour(0).minute(0).second(0).millisecond(0);

  const showWeekend = !!settingsData?.getMySettings.showWeekend;
  const handleChange = () => {
    updateSettings({
      variables: { settings: { showWeekend: !showWeekend } },
    });
  };

  // Construct requested date range to include days without entries.
  const workdays: Workday[] = range(normalizedEnd.diff(normalizedStart, "day") + 1).map((i) => {
    const date = normalizedStart.add(i, "day");
    return {
      date: date.format("YYYY-MM-DD"),
      entries: data.findWorkdays.find((wd) => date.isSame(dayjs(wd.date), "day"))?.entries || [],
    };
  });

  const dividedWorkdays = workdays.reduce<Workday[][]>((arr, curr) => {
    if (
      arr.length === 0 ||
      isWeekend(dayjs(curr.date)) !== isWeekend(dayjs(arr.slice(-1)[0].slice(-1)[0].date))
    ) {
      arr.push([curr]);
    } else {
      arr.slice(-1)[0].push(curr);
    }
    return arr;
  }, []);

  return (
    <>
      <TotalHours workdays={workdays} />
      <Paper>
        {dividedWorkdays.map((wdArr) => {
          if (isWeekend(dayjs(wdArr[0].date))) {
            return (
              <Collapse in={showWeekend} key={wdArr[0].date}>
                {wdArr.map((wd) => (
                  <WorkdayAccordion workday={wd} key={wd.date} />
                ))}
              </Collapse>
            );
          }
          return wdArr.map((wd) => <WorkdayAccordion workday={wd} key={wd.date} />);
        })}
      </Paper>
      <Box sx={{ textAlign: "left", mt: "1em" }}>
        <Button
          onClick={handleChange}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 3 }}
          aria-label={showWeekend ? t("controls.hideWeekend") : t("controls.showWeekend")}
        >
          {showWeekend ? t("controls.hideWeekend") : t("controls.showWeekend")}
        </Button>
      </Box>
    </>
  );
};

export default WorkdayList;
