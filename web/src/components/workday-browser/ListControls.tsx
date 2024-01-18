import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import DateControl from "./DateControl";
import WeekControl from "./WeekControl";

const ListControls = () => {
  const [value, setValue] = useState("1");

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Browse by week" value="1" />
            <Tab label="Browse by date" value="2" />
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
