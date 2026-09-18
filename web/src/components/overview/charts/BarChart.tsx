import { TooltipItem } from "chart.js";
import { ChartDateRange, ChartProps } from "./chartTypes";
import { useTranslation } from "react-i18next";
import { formatAccumulatedChartData, tooltipLabelFormatter, formatDateRange } from "./chartUtils";
import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import "./chartjs";

interface BarChartProps {
  orientation?: "vertical" | "horizontal";
}

const hoursScale = { ticks: { stepSize: 1 } };
const labelScale = { ticks: { display: false } };

const getBarChartOptions = (
  orientation: "vertical" | "horizontal",
  totalHours: number,
  dateRange: ChartDateRange,
  t: (key: string, options?: Record<string, unknown>) => string,
) => {
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
            return tooltipLabelFormatter(context.dataset.label ?? "", context.formattedValue);
          },
          afterLabel: (context: TooltipItem<"bar">) => {
            const rawValue = Number(context.formattedValue.replace(",", "."));
            const percentage = (rawValue / totalHours) * 100;

            return ` ${t("overview.chart.percentageOfTotalHours", { percentage: percentage.toFixed(0) })}`;
          },
          title: () => formatDateRange(dateRange),
        },
      },
    },
  };
};

export default function BarChart({
  workdays,
  orientation = "vertical",
  groupBy,
}: ChartProps & BarChartProps) {
  const chartData = formatAccumulatedChartData(workdays, groupBy);
  const totalHours = useMemo(() => {
    return chartData.datasets.reduce(
      (acc, dataset) => acc + dataset.data.reduce((acc, value) => acc + Number(value), 0),
      0,
    );
  }, [chartData]);
  const dateRange = useMemo(() => {
    return {
      startDate: workdays.slice(0, 1).map((workday) => workday.date)[0],
      endDate: workdays.slice(-1).map((workday) => workday.date)[0],
    };
  }, [workdays]);
  const { t } = useTranslation();

  const options = getBarChartOptions(
    orientation,
    totalHours,
    dateRange,
    (key: string, options?: Record<string, unknown>) => t(key, options),
  );

  return <Bar key={orientation} data={chartData} options={options} />;
}
