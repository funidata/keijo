import { TooltipItem } from "chart.js";
import { ChartProps } from "./chartTypes";
import { formatAccumulatedChartData, formatDuration } from "./chartUtils";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

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
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const rawValue = Number(context.formattedValue.replace(",", "."));

            return ` ${formatDuration(rawValue)}`;
          },
        },
      },
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
