import { ChartProps } from "./chartTypes";
import { formatAccumulatedChartData } from "./chartUtils";
import { Bar } from "react-chartjs-2";

interface BarChartProps {
  orientation?: "vertical" | "horizontal";
}

const getBarChartOptions = (orientation: "vertical" | "horizontal") => {
  return {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: { y: { ticks: { stepSize: 1 } } },
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
};

export default function BarChart({
  workdays,
  orientation = "vertical",
  chartKey,
}: ChartProps & BarChartProps) {
  const chartData = formatAccumulatedChartData(workdays, chartKey);
  const options = getBarChartOptions(orientation);

  return <Bar data={chartData} options={options} />;
}
