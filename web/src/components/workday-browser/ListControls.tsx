import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import OverviewWrapper from "../overview/OverviewWrapper";
import DateControl from "./DateControl";
import WeekControl from "./WeekControl";
import { BrowsingMode, useWorkdayBrowserParams } from "./useWorkdayBrowserParams";

const ListControls = () => {
  const { t } = useTranslation();
  const { browsingMode, from, to, goToWeek, goToRange, goToOverview } = useWorkdayBrowserParams();

  const handleChange = (_: SyntheticEvent, newValue: BrowsingMode) => {
    if (newValue === "range") {
      goToRange(from, to);
    }

    if (newValue === "week") {
      goToWeek(from);
    }

    if (newValue === "overview") {
      goToOverview(from, to);
    }
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={browsingMode}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label={t("entryTable.tabs.aria")}>
            <Tab label={t("entryTable.tabs.browseByWeek")} value="week" />
            <Tab label={t("entryTable.tabs.browseByDates")} value="range" />
            <Tab label={t("overview.title")} value="overview" />
          </TabList>
        </Box>
        <TabPanel value="week">
          <WeekControl />
        </TabPanel>
        <TabPanel value="range">
          <DateControl />
        </TabPanel>
        <TabPanel value="overview">
          <DateControl target="overview" />
          <OverviewWrapper />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ListControls;
