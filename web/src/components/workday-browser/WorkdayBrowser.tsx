import { Outlet } from "react-router-dom";
import ListControls from "./ListControls";
import WorkdayList from "./WorkdayList";

const WorkdayBrowser = () => (
  <>
    <ListControls />
    <WorkdayList />
    <Outlet />
  </>
);

export default WorkdayBrowser;
