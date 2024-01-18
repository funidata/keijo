import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import DateControl from "./DateControl";
import WeekControl from "./WeekControl";

const ListControls = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("1");

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label={t("entryTable.tabs.aria")}>
            <Tab label={t("entryTable.tabs.browseByWeek")} value="1" />
            <Tab label={t("entryTable.tabs.browseByDates")} value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <WeekControl />
        </TabPanel>
        <TabPanel value="2">
          <DateControl />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default ListControls;
