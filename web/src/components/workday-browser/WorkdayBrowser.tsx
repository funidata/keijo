import { Outlet } from "react-router-dom";
import ListControls from "./ListControls";
import WorkdayList from "./WorkdayList";
import Box from "@mui/material/Box";
import { EntryContextProvider } from "./entry-context/EntryContextProvider";
import TemplateAccordion from "../template-accordion/TemplateAccordion";

export default function WorkdayBrowser() {
  return (
    <>
      <EntryContextProvider>
        <ListControls />
        <Box sx={{ mt: { sx: 0, sm: 3 }, mb: { xs: 4, sm: 1 } }}>
          <TemplateAccordion />
        </Box>
        <WorkdayList />
      </EntryContextProvider>
      <Outlet />
    </>
  );
}
