import { ChartProps } from "./chartTypes";
import { formatAreaChartData } from "./chartUtils";
import { Line } from "react-chartjs-2";

interface LineChartProps {
  variant?: "default" | "stacked";
}

const getAreaChartOptions = (variant: "default" | "stacked") => {
  return {
    parsing: { xAxisKey: "date", yAxisKey: "hours" },
    scales: {
      y: {
        min: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
      axis: "xy" as const,
    },
    ...(variant === "stacked" && {
      scales: {
        y: {
          stacked: true,
          min: 0,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        filler: {
          propagate: true,
        },
      },
    }),
  };
};

export default function AreaChart({
  workdays,
  chartKey,
  variant = "default",
}: ChartProps & LineChartProps) {
  const chartData = formatAreaChartData(workdays, chartKey, variant);
  const options = getAreaChartOptions(variant);

  return <Line data={chartData} options={options} />;
}
