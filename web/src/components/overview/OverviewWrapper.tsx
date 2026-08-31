import { useQuery } from "@apollo/client/react";
import { Entry, FindWorkdaysDocument, Workday } from "../../graphql/generated/graphql";
import { useWorkdayBrowserParams } from "../workday-browser/useWorkdayBrowserParams";
import LoadingIndicator from "../workday-browser/LoadingIndicator";
import { compileWorkdayRange } from "../../common/workdayUtils";
import { Box, Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
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
import { ChartProps } from "./chartTypes";
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

interface Dataset {
  label: string;
  value: number;
}

function formatAccumulatedChartData(data: Workday[]) {
  const entries: Array<Entry> = [];

  data.forEach((workday) => {
    workday.entries.forEach((entry) => {
      entries.push(entry);
    });
  });

  const datasets = entries.reduce<Dataset[]>((accumulator, entry) => {
    // Skip entries with no worktime to accumulate
    if (entry.duration === 0) {
      return accumulator;
    }

    if (entry.durationInHours) {
      const label = entry.product ?? "unknown";
      const existingDatasetIndex = accumulator.findIndex((dataset) => {
        return dataset.label === label;
      });

      if (existingDatasetIndex === -1) {
        accumulator.push({ label, value: entry.duration });
      } else {
        accumulator[existingDatasetIndex]["value"] =
          accumulator[existingDatasetIndex]["value"] + entry.duration;
      }
    } else {
      console.error("Duration not in hours, cannot be added to workhours summary.", entry);
    }
    return accumulator;
  }, []);

  console.log(datasets);

  return { datasets: [{ data: datasets }], labels: [] };
}

function formatChartDataForPieChart(data: { datasets: Array<{ data: Dataset[] }> }) {
  const labels: string[] = [];
  const datapoints: number[] = [];
  data.datasets[0].data.forEach((dataset) => {
    labels.push(dataset.label);
    datapoints.push(dataset.value);
  });

  return { datasets: [{ data: datapoints }], labels };
}


function PieChart({ workdays }: ChartProps) {
  const chartData = formatAccumulatedChartData(workdays);
  const data = formatChartDataForPieChart(chartData);

  return <Pie data={data} />;
}

interface BarChartProps {
  orientation?: "vertical" | "horizontal";
}

function BarChart({ workdays, orientation = "vertical" }: ChartProps & BarChartProps) {
  const chartData = formatAccumulatedChartData(workdays);
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    ...(orientation === "horizontal" && { indexAxis: "y" as const }),
    parsing:
      orientation === "horizontal"
        ? {
            yAxisKey: "label",
            xAxisKey: "value",
          }
        : {
            yAxisKey: "value",
            xAxisKey: "label",
          },
  };

  return <Bar data={chartData} options={options} />;
}

interface TableViewProps {
  workdays: Workday[];
}

function TableView({ workdays }: TableViewProps) {
  return (
    <Table>
      <TableBody>
        {workdays.map((workday) => {
          return (
            <>
              {workday.entries.map((entry, i) => {
                return (
                  <TableRow>
                    {i === 0 && (
                      <TableCell rowSpan={workday.entries.length}>{workday.date}</TableCell>
                    )}
                    <TableCell>
                      <code>{JSON.stringify(entry)}</code>
                    </TableCell>
                  </TableRow>
                );
              })}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
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
        {/* <TableView workdays={workdays} /> */}
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
        {/* <TableView workdays={workdays} /> */}
      </Stack>
    </>
  );
}
