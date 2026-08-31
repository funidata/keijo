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

  return (
    <>
      <Typography>Tuotteittain</Typography>
      <Stack direction="row">
        <Box sx={{ width: "30%" }}>
          <PieChart workdays={workdays} />
          <BarChart workdays={workdays} />
          <BarChart workdays={workdays} orientation="horizontal" />
        </Box>
        <Box sx={{ width: "50%" }}>
          <AreaChart workdays={workdays} />
          <AreaChart workdays={workdays} variant="stacked" />
        </Box>
      </Stack>
      <Typography>Toiminnoittain</Typography>
      <Stack direction="row">
        <Box sx={{ width: "30%" }}>
          <PieChart workdays={workdays} />
          <BarChart workdays={workdays} />
          <BarChart workdays={workdays} orientation="horizontal" />
        </Box>
        <Box sx={{ width: "50%" }}>
          <AreaChart workdays={workdays} />
          <AreaChart workdays={workdays} variant="stacked" />
        </Box>
      </Stack>
    </>
  );
}
