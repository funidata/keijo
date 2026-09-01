import { TabContext, TabList, TabPanel } from "@mui/lab";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
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
          <Stack direction="row" sx={{ justifyContent: "center", width: "100%" }}>
            <DateControl />
          </Stack>
        </TabPanel>
        <TabPanel value="overview">
          <Stack direction="row" sx={{ justifyContent: "center", width: "100%" }}>
            <DateControl target="overview" />
          </Stack>
          <Box sx={{ marginTop: 4 }}>
            <OverviewWrapper />
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ListControls;
