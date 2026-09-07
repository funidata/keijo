import { ChartProps } from "./chartTypes";
import { Pie } from "react-chartjs-2";
import {
  formatAccumulatedChartData,
  formatChartDataForPieChart,
  formatDuration,
} from "./chartUtils";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { type TooltipItem } from "chart.js";
dayjs.extend(duration);

export default function PieChart({ workdays, chartKey }: ChartProps) {
  const chartData = formatAccumulatedChartData(workdays, chartKey);
  const data = formatChartDataForPieChart(chartData);
  const options = {
    plugins: {
      tooltip: {
        title: {
          display: false,
        },
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            const rawValue = Number(context.formattedValue.replace(",", "."));
            return ` ${formatDuration(rawValue)}`;
          },
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
}
