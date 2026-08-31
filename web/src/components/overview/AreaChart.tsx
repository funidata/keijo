import { ChartProps } from "./chartTypes";
import { Line } from "react-chartjs-2";

interface LineChartProps {
  variant?: "default" | "stacked";
}

export default function AreaChart({ workdays, variant }: ChartProps & LineChartProps) {
  const options = {
    parsing: { xAxisKey: "date", yAxisKey: "hours" },
    scales: {
      y: {
        min: 0,
      },
    },
    ...(variant === "stacked" && {
      scales: {
        y: {
          stacked: true,
          min: 0,
        },
      },
      interaction: {
        intersect: false,
      },
      plugins: {
        filler: {
          propagate: true,
        },
      },
    }),
  };
  return (
    <Line
      data={{
        labels: ["2026-08-18", "2026-08-19", "2026-08-20", "2026-08-21"],
        datasets: [
          {
            label: "Sisäiset tapahtumat ja palaverit",
            ...(variant === "stacked" && { fill: "stack" }),
            data: [
              { date: "2026-08-21", hours: 1 },
              { date: "2026-08-20", hours: 4 },
              { date: "2026-08-19", hours: 3 },
              { date: "2026-08-18", hours: 6 },
            ],
          },
          {
            label: "Toteutus",
            ...(variant === "stacked" && { fill: "stack" }),
            data: [
              { date: "2026-08-21", hours: 4 },
              { date: "2026-08-20", hours: 3 },
              { date: "2026-08-19", hours: 3 },
              { date: "2026-08-18", hours: 2 },
            ],
          },
          {
            label: "Tuotekehityksen palaverit",
            ...(variant === "stacked" && { fill: "stack" }),
            data: [
              { date: "2026-08-21", hours: 4 },
              { date: "2026-08-20", hours: 1 },
              { date: "2026-08-19", hours: 1 },
              { date: "2026-08-18", hours: 1 },
            ],
          },
        ],
      }}
      options={options}
    />
  );
}
