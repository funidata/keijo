import { useQuery } from "@apollo/client/react";
import { FindWorkdaysDocument } from "../../graphql/generated/graphql";
import { useWorkdayBrowserParams } from "../workday-browser/useWorkdayBrowserParams";
import LoadingIndicator from "../workday-browser/LoadingIndicator";
import { compileWorkdayRange } from "../../common/workdayUtils";
import OverviewContextProvider from "./OverviewContext";
import Overview from "./Overview";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  Filler,
  type Plugin,
} from "chart.js";
import { CHART_DEFAULT_ASPECT_RATIO } from "./constants";

const opaqueBarBackgrounds: Plugin = {
  id: "opaqueBarBackgrounds",
  afterLayout(chart) {
    if (!("type" in chart.config) || chart.config.type !== "bar") {
      return;
    }

    for (const dataset of chart.data.datasets) {
      dataset.backgroundColor = dataset.borderColor;
    }
  },
};

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Colors,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
  Filler,
  opaqueBarBackgrounds,
);

ChartJS.defaults.animation = false;
ChartJS.defaults.aspectRatio = CHART_DEFAULT_ASPECT_RATIO;

export default function OverviewWrapper() {
  const { from, to, formattedFrom, formattedTo } = useWorkdayBrowserParams();
  const { data } = useQuery(FindWorkdaysDocument, {
    variables: { start: formattedFrom, end: formattedTo },
    // Poll every 5 minutes, mainly to keep IDP session alive.
    pollInterval: 5 * 60 * 1000,
  });

  if (!data) {
    return <LoadingIndicator />;
  }

  const workdays = compileWorkdayRange(data, { from, to });

  return (
    <OverviewContextProvider>
      <Overview workdays={workdays} />
    </OverviewContextProvider>
  );
}
