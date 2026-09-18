import { ChartProps } from "./chartTypes";
import { DEFAULT_ASPECT_RATIO } from "./constants";
import { formatDateRange } from "./chartUtils";
import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import {
  formatAccumulatedChartData,
  formatChartDataForPieChart,
  tooltipLabelFormatter,
} from "./chartUtils";
import type { TooltipItem } from "chart.js";
import "./chartjs";

export default function PieChart({ workdays, groupBy }: ChartProps) {
  const { t } = useTranslation();

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

  const data = formatChartDataForPieChart(chartData);

  const options = {
    aspectRatio: DEFAULT_ASPECT_RATIO,
    plugins: {
      tooltip: {
        title: {
          display: false,
        },
        callbacks: {
          label: (context: TooltipItem<"pie">) => {
            return tooltipLabelFormatter(context.label, context.formattedValue);
          },
          afterLabel: (context: TooltipItem<"pie">) => {
            const rawValue = Number(context.formattedValue.replace(",", "."));
            const percentage = (rawValue / totalHours) * 100;
            return ` ${t("overview.chart.percentageOfTotalHours", { percentage: percentage.toFixed(0) })}`;
          },
          title: () => formatDateRange(dateRange),
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
}
