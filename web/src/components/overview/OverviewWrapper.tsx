import { useQuery } from "@apollo/client/react";
import { FindWorkdaysDocument } from "../../graphql/generated/graphql";
import { useWorkdayBrowserParams } from "../workday-browser/useWorkdayBrowserParams";
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import LoadingIndicator from "../workday-browser/LoadingIndicator";
import { compileWorkdayRange } from "../../common/workdayUtils";
import { Box, Stack, Typography } from "@mui/material";
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

type GraphConfig = TimelineChartConfig | TotalsChartConfig;

type TimelineChartConfig = {
  variant: "stacked" | "default";
  type: "timeline";
}

type TotalsChartConfig = {
  type: "totals";
  variant: "bar" | "pie";
};

interface GraphAreaConfig {
  title: string;
  graphs: GraphConfig[];
}

export default function OverviewWrapper() {
  // TODO: get data for the given range
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

  const config: GraphAreaConfig[] = [
    {
      title: "Tuotteittain",
      graphs: [
        {
          type: "totals",
          variant: "bar",
        },
        {
          type: "timeline",
          variant: "stacked",
        },
      ],
    },
    {
      title: "Toiminnoittain",
      graphs: [
        {
          type: "totals",
          variant: "pie",
        },
        {
          type: "timeline",
          variant: "default" as const
        },
      ],
    },
  ];

  return (
    <>
      {config.map((section, index) => (
        <div key={index}>
          <Typography variant="h6">{section.title}</Typography>
          <Stack direction="row">
            {section.graphs.map((graph, graphIndex) => {
              switch (graph.type) {
                case "totals":
                  return (
                    <Box sx={{ width: "50%" }}>
                      {graph.variant === "bar" && (
                        <BarChart key={graphIndex} workdays={workdays} />
                      )}
                      {graph.variant === "pie" && (
                        <PieChart key={graphIndex} workdays={workdays} />
                      )}
                    </Box>
                  );
                case "timeline":
                  return (
                    <Box sx={{ width: "50%" }}>
                      <AreaChart key={graphIndex} workdays={workdays} variant={graph.variant} />
                    </Box>
                  );
                default:
                  return null;
              }
            })}
          </Stack>
        </div>
      ))}
    </>
  );
}
