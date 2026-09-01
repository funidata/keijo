import { ChartProps } from "./chartTypes";
import { formatAreaChartData } from "./chartUtils";
import { Line } from "react-chartjs-2";

interface LineChartProps {
  variant?: "default" | "stacked";
}

export default function AreaChart({ workdays, chartKey, variant }: ChartProps & LineChartProps) {
  const chartData = formatAreaChartData(workdays, chartKey, variant ?? "default");
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
  return <Line data={chartData} options={options} />;
}
