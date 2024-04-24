import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useSessionStorage } from "usehooks-ts";
import useDayjs from "../../common/useDayjs";
import DateControl from "./DateControl";
import WeekControl from "./WeekControl";

export type BrowsingMode = "week" | "range";
export const SELECTED_BROWSING_MODE_KEY = "selected-browsing-mode";

const ListControls = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dayjs = useDayjs();
  const { browsingMode, from } = useParams();

  const [selectedTab, setSelectedTab] = useSessionStorage<BrowsingMode>(
    SELECTED_BROWSING_MODE_KEY,
    "week",
  );

  const handleChange = (_: SyntheticEvent, newValue: BrowsingMode) => {
    setSelectedTab(newValue);
    // TODO: Converting between week and date range must be done here.

    // Exit early if tab did not actually change.
    if (newValue === browsingMode) {
      return;
    }

    const dateFormat = "YYYY-MM-DD";

    if (newValue === "range") {
      let year = dayjs().year();
      let week = dayjs().week();

      if (from) {
        // FIXME: Parsing should be done elsewhere?
        const parsedFromParam = from.split("-");
        year = parsedFromParam.length === 2 ? Number(parsedFromParam[0]) : dayjs().year();
        week = parsedFromParam.length === 2 ? Number(parsedFromParam[1]) : Number(from);
      }

      const newFrom = dayjs().year(year).week(week).weekday(0);
      const newTo = newFrom.weekday(6);
      const newPath = `/entries/range/${newFrom.format(dateFormat)}/${newTo.format(dateFormat)}`;
      navigate(newPath);
    }

    if (newValue === "week") {
      const fromDay = dayjs(from);
      const weekParam =
        fromDay.year() === dayjs().year() ? fromDay.week() : `${fromDay.year()}-${fromDay.week()}`;
      navigate(`/entries/week/${weekParam}`);
    }
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={selectedTab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label={t("entryTable.tabs.aria")}>
            <Tab label={t("entryTable.tabs.browseByWeek")} value="week" />
            <Tab label={t("entryTable.tabs.browseByDates")} value="range" />
          </TabList>
        </Box>
        <TabPanel value="week">
          <WeekControl />
        </TabPanel>
        <TabPanel value="range">
          <DateControl />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ListControls;
