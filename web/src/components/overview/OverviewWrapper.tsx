import { useQuery } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { FindWorkdaysDocument } from "../../graphql/generated/graphql";
import { useWorkdayBrowserParams } from "../workday-browser/useWorkdayBrowserParams";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import LoadingIndicator from "../workday-browser/LoadingIndicator";
import { compileWorkdayRange } from "../../common/workdayUtils";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
} from "chart.js";
import AreaChart from "./AreaChart";
import useChartAreaConfig from "./useChartAreaConfig";
// import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

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
);

export default function OverviewWrapper() {
  // TODO: get data for the given range
  const { t } = useTranslation();
  const { from, to, formattedFrom, formattedTo } = useWorkdayBrowserParams();
  const { chartAreaConfig, handleTotalsChartVariantChange, handleTimelineChartVariantChange } =
    useChartAreaConfig();
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
    <Stack direction="column" spacing={4}>
      {chartAreaConfig.map((section, sectionIndex) => (
        <Box key={sectionIndex}>
          <Typography variant="h6">{t(`overview.hoursBy.${section.key}`)}</Typography>
          <Stack direction="row" spacing={4}>
            {section.graphs.map((graph, graphIndex) => {
              switch (graph.type) {
                case "totals":
                  return (
                    <Box sx={{ width: "50%" }}>
                      <Select
                        id={`totals-${sectionIndex}-${graphIndex}`}
                        value={graph.variant}
                        label="Variant"
                        onChange={(event) =>
                          handleTotalsChartVariantChange(
                            event.target.value,
                            graphIndex,
                            sectionIndex,
                          )
                        }
                      >
                        <MenuItem value="bar-horizontal">Bar Horizontal</MenuItem>
                        <MenuItem value="bar-vertical">Bar Vertical</MenuItem>
                        <MenuItem value="pie">Pie</MenuItem>
                      </Select>
                      {graph.variant === "bar-horizontal" && (
                        <BarChart
                          key={`${sectionIndex}-${graphIndex}`}
                          chartKey={section.key}
                          workdays={workdays}
                          orientation="horizontal"
                        />
                      )}
                      {graph.variant === "bar-vertical" && (
                        <BarChart
                          key={`${sectionIndex}-${graphIndex}`}
                          chartKey={section.key}
                          workdays={workdays}
                          orientation="vertical"
                        />
                      )}
                      {graph.variant === "pie" && (
                        <PieChart
                          key={`${sectionIndex}-${graphIndex}`}
                          chartKey={section.key}
                          workdays={workdays}
                        />
                      )}
                    </Box>
                  );
                case "timeline":
                  return (
                    <Box sx={{ width: "50%" }}>
                      <Select
                        id={`timeline-${sectionIndex}-${graphIndex}`}
                        value={graph.variant}
                        label="Variant"
                        onChange={(event) =>
                          handleTimelineChartVariantChange(
                            event.target.value,
                            graphIndex,
                            sectionIndex,
                          )
                        }
                      >
                        <MenuItem value="default">Unstacked</MenuItem>
                        <MenuItem value="stacked">Stacked</MenuItem>
                      </Select>
                      <AreaChart
                        key={`${sectionIndex}-${graphIndex}`}
                        chartKey={section.key}
                        workdays={workdays}
                        variant={graph.variant}
                      />
                    </Box>
                  );
                default:
                  return null;
              }
            })}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
