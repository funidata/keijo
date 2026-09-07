import { ChartProps } from "./chartTypes";
import { formatDateRange } from "./chartUtils";
import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import {
  formatAccumulatedChartData,
  formatChartDataForPieChart,
  tooltipLabelFormatter,
} from "./chartUtils";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { type TooltipItem } from "chart.js";
dayjs.extend(duration);

export default function PieChart({ workdays, chartKey }: ChartProps) {
  const { t } = useTranslation();

  const chartData = formatAccumulatedChartData(workdays, chartKey);
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
    aspectRatio: 1.5,
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
            return ` ${t("overview.percentageOfTotalHours", { percentage: percentage.toFixed(0) })}`;
          },
          title: () => formatDateRange(dateRange),
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
}
