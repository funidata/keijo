import { Outlet } from "react-router-dom";
import ListControls from "./ListControls";
import WorkdayList from "./WorkdayList";
import { EntryContextProvider } from "./entry-context/EntryContextProvider";
import TemplateAccordion from "../template-accordion/TemplateAccordion";

const WorkdayBrowser = () => (
  <>
    <EntryContextProvider>
      <TemplateAccordion />
      <ListControls />
      <WorkdayList />
    </EntryContextProvider>
    <Outlet />
  </>
);

export default WorkdayBrowser;
