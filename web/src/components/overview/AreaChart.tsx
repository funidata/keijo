import { ChartProps } from "./chartTypes";
import { formatAreaChartData } from "./chartUtils";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const chartData = formatAreaChartData(workdays, chartKey, variant, (weekNumber) =>
    t("overview.weekNumber", { weekNumber }),
  );
  console.log(chartData);
  const options = getAreaChartOptions(variant);

  return <Line key={variant} data={chartData} options={options} />;
}
