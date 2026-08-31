import { ChartProps } from "./chartTypes";
import { Pie } from "react-chartjs-2";
import { formatAccumulatedChartData, formatChartDataForPieChart } from "./chartUtils";

export default function PieChart({ workdays }: ChartProps) {
  const chartData = formatAccumulatedChartData(workdays);
  const data = formatChartDataForPieChart(chartData);

  return <Pie data={data} />;
}
