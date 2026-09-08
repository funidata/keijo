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
import { DEFAULT_ASPECT_RATIO } from "./constants";

ChartJS.defaults.animation = false;
ChartJS.defaults.aspectRatio = DEFAULT_ASPECT_RATIO;

/**
 * This custom plugin changes the background color of bar chart datasets to
 * match their border color, making the bars more opaque, which matches the rest
 * of the charts' color scheme.
 */
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
