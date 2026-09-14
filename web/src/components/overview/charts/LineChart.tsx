import { ChartProps } from "./chartTypes";
import { TimelineGraphVariant } from "../graphTypes";
import { formatLineChartData, tooltipLabelFormatter } from "./chartUtils";
import type { TooltipItem } from "chart.js";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import "./chartjs";

interface LineChartProps {
  variant?: TimelineGraphVariant;
}

const tooltipOptions = {
  tooltip: {
    callbacks: {
      label: (context: TooltipItem<"line">) => {
        return tooltipLabelFormatter(context.dataset.label ?? "", context.formattedValue);
      },
    },
  },
};

const getLineChartOptions = (variant: TimelineGraphVariant) => {
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

export default function LineChart({
  workdays,
  groupBy,
  variant = TimelineGraphVariant.Unstacked,
}: ChartProps & LineChartProps) {
  const { t } = useTranslation();
  const chartData = formatLineChartData(workdays, groupBy, variant, (weekNumber) =>
    t("overview.chart.weekNumber", { weekNumber }),
  );
  const options = getLineChartOptions(variant);

  return <Line key={variant} data={chartData} options={options} />;
}
