import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import DateControl from "./DateControl";
import WeekControl from "./WeekControl";
import { BrowsingMode, useWorkdayBrowserParams } from "./useWorkdayBrowserParams";

const ListControls = () => {
  const { t } = useTranslation();
  const { browsingMode, from, to, goToWeek, goToRange } = useWorkdayBrowserParams();

  const handleChange = (_: SyntheticEvent, newValue: BrowsingMode) => {
    if (newValue === "range") {
      goToRange(from, to);
    }

    if (newValue === "week") {
      goToWeek(from);
    }
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={browsingMode}>
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
