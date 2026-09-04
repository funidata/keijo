import { ChartProps } from "./chartTypes";
import { formatAccumulatedChartData } from "./chartUtils";
import { Bar } from "react-chartjs-2";

interface BarChartProps {
  orientation?: "vertical" | "horizontal";
}

const hoursScale = { ticks: { stepSize: 1 } };
const labelScale = { ticks: { display: false } };

const getBarChartOptions = (orientation: "vertical" | "horizontal") => {
  return {
    scales: { y: hoursScale, x: labelScale },
    ...(orientation === "horizontal" && {
      scales: {
        x: hoursScale,
        y: labelScale,
      },
      indexAxis: "y" as const,
    }),
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

  return <Bar key={orientation} data={chartData} options={options} />;
}
