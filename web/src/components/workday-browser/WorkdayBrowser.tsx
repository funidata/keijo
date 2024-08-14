import { Outlet } from "react-router-dom";
import ListControls from "./ListControls";
import WorkdayList from "./WorkdayList";
import { EntryContextProvider } from "./entry-context/EntryContextProvider";

const WorkdayBrowser = () => (
  <>
    <EntryContextProvider>
      <ListControls />
      <WorkdayList />
    </EntryContextProvider>
    <Outlet />
  </>
);

export default WorkdayBrowser;
