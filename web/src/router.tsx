import { createBrowserRouter } from "react-router-dom";
import WorkdayBrowser from "./components/workday-browser/WorkdayBrowser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WorkdayBrowser />,
  },
]);

export default router;
