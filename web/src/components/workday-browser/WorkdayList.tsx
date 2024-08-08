import { useQuery } from "@apollo/client";
import { Box, Button, Collapse, Paper } from "@mui/material";
import { range } from "lodash";
import useDayjs from "../../common/useDayjs";
import { Entry, FindWorkdaysDocument } from "../../graphql/generated/graphql";
import WorkdayAccordion from "../workday-accordion/WorkdayAccordion";
import LoadingIndicator from "./LoadingIndicator";
import TotalHours from "./TotalHours";
import { useWorkdayBrowserParams } from "./useWorkdayBrowserParams";
import { useState } from "react";
import { isWeekend } from "../../common/workdayUtils";
import { Dayjs } from "dayjs";
import { t } from "i18next";
import { EntryContextProvider } from "./entry-context/EntryContextProvider";

const WorkdayList = () => {
  const dayjs = useDayjs();

  const { from, to, formattedFrom, formattedTo } = useWorkdayBrowserParams();
  const [checked, setChecked] = useState(false);

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

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  // Construct requested date range to include days without entries.
  const workdays = range(normalizedEnd.diff(normalizedStart, "day") + 1).map((i) => {
    const date = normalizedStart.add(i, "day");
    return {
      date,
      entries: data.findWorkdays.find((wd) => date.isSame(dayjs(wd.date), "day"))?.entries || [],
    };
  });

  const dividedWorkdays = workdays.reduce<{ date: Dayjs; entries: Entry[] }[][]>((arr, curr) => {
    if (
      arr.length === 0 ||
      isWeekend(curr.date) !== isWeekend(arr.slice(-1)[0].slice(-1)[0].date)
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
          if (isWeekend(wdArr[0].date)) {
            return (
              <Collapse in={checked}>
                {wdArr.map((wd) => (
                  <WorkdayAccordion workday={wd} key={wd.date.toString()} />
                ))}
              </Collapse>
            );
          }
          return wdArr.map((wd) => <WorkdayAccordion workday={wd} key={wd.date.toString()} />);
        })}
      </Paper>
      <Box textAlign="left" mt="1em">
        <Button
          onClick={handleChange}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ borderRadius: 3 }}
          aria-label={checked ? t("controls.hideWeekend") : t("controls.showWeekend")}
        >
          {checked ? t("controls.hideWeekend") : t("controls.showWeekend")}
        </Button>
      </Box>
    </>
  );
};

export default WorkdayList;
