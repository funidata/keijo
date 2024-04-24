import { Navigate } from "react-router-dom";
import { useSessionStorage } from "usehooks-ts";
import { BrowsingMode, SELECTED_BROWSING_MODE_KEY } from "./ListControls";

const WorkdayBrowserRedirect = () => {
  const [selectedTab] = useSessionStorage<BrowsingMode>(SELECTED_BROWSING_MODE_KEY, "week");

  return <Navigate to={`/entries/${selectedTab}`} />;
};

export default WorkdayBrowserRedirect;
