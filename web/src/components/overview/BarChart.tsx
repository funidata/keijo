import { ChartProps } from "./chartTypes";
import { formatAccumulatedChartData } from "./chartUtils";
import { Bar } from "react-chartjs-2";

interface BarChartProps {
  orientation?: "vertical" | "horizontal";
}

export default function BarChart({
  workdays,
  orientation = "vertical",
  chartKey,
}: ChartProps & BarChartProps) {
  const chartData = formatAccumulatedChartData(workdays, chartKey);
  console.log(chartData);
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
