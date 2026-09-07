import { ChartProps } from "./chartTypes";
import { formatAreaChartData, formatDuration } from "./chartUtils";
import type { TooltipItem } from "chart.js";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

interface LineChartProps {
  variant?: "default" | "stacked";
}

const tooltipOptions = {
  tooltip: {
    callbacks: {
      label: (context: TooltipItem<"line">) => {
        const rawValue = Number(context.formattedValue.replace(",", "."));

        return `${context.dataset.label}: ${formatDuration(rawValue)}`;
      },
    },
  },
};

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
    plugins: {
      ...tooltipOptions,
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
        ...tooltipOptions,
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
  const options = getAreaChartOptions(variant);

  return <Line key={variant} data={chartData} options={options} />;
}
