import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "usehooks-ts";
import useDayjs from "../../common/useDayjs";
import DateControl from "./DateControl";
import WeekControl from "./WeekControl";
import { useWorkdayBrowserParams } from "./useWorkdayBrowserParams";

export type BrowsingMode = "week" | "range";
export const SELECTED_BROWSING_MODE_KEY = "selected-browsing-mode";

const ListControls = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dayjs = useDayjs();
  const { from, formattedFrom, formattedTo } = useWorkdayBrowserParams();

  const [selectedTab, setSelectedTab] = useSessionStorage<BrowsingMode>(
    SELECTED_BROWSING_MODE_KEY,
    "week",
  );

  const handleChange = (_: SyntheticEvent, newValue: BrowsingMode) => {
    setSelectedTab(newValue);

    if (newValue === "range") {
      const newPath = `/entries/range/${formattedFrom}/${formattedTo}`;
      navigate(newPath);
    }

    if (newValue === "week") {
      // TODO: Move this to hook?
      const weekParam =
        from.year() === dayjs().year() ? from.week() : `${from.year()}-${from.week()}`;
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
