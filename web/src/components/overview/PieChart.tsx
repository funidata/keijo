import { ChartProps } from "./chartTypes";
import { Pie } from "react-chartjs-2";
import { formatAccumulatedChartData, formatChartDataForPieChart } from "./chartUtils";

export default function PieChart({ workdays, chartKey }: ChartProps) {
  const chartData = formatAccumulatedChartData(workdays, chartKey);
  const data = formatChartDataForPieChart(chartData);

  const options = { animation: false };

  return <Pie data={data} options={options} />;
}
