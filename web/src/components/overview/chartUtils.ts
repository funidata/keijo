import { Entry, Workday } from "../../graphql/generated/schema-types";

interface Dataset {
  label: string;
  value: number;
}

export function formatAccumulatedChartData(data: Workday[]) {
  const entries: Array<Entry> = [];

  data.forEach((workday) => {
    workday.entries.forEach((entry) => {
      entries.push(entry);
    });
  });

  const datasets = entries.reduce<Dataset[]>((accumulator, entry) => {
    // Skip entries with no worktime to accumulate
    if (entry.duration === 0) {
      return accumulator;
    }

    if (entry.durationInHours) {
      const label = entry.product ?? "unknown";
      const existingDatasetIndex = accumulator.findIndex((dataset) => {
        return dataset.label === label;
      });

      if (existingDatasetIndex === -1) {
        accumulator.push({ label, value: entry.duration });
      } else {
        accumulator[existingDatasetIndex]["value"] =
          accumulator[existingDatasetIndex]["value"] + entry.duration;
      }
    } else {
      console.error("Duration not in hours, cannot be added to workhours summary.", entry);
    }
    return accumulator;
  }, []);

  console.log(datasets);

  return { datasets: [{ data: datasets }], labels: [] };
}

export function formatChartDataForPieChart(data: { datasets: Array<{ data: Dataset[] }> }) {
  const labels: string[] = [];
  const datapoints: number[] = [];
  data.datasets[0].data.forEach((dataset) => {
    labels.push(dataset.label);
    datapoints.push(dataset.value);
  });

  return { datasets: [{ data: datapoints }], labels };
}