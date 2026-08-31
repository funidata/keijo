import { Entry, Workday } from "../../graphql/generated/schema-types";

interface Dataset {
  label: string;
  value: number;
}

export function formatAccumulatedChartData(workdays: Workday[], key: keyof Entry) {
  const entries: Array<Entry> = [];

  workdays.forEach((workday) => {
    workday.entries.forEach((entry) => {
      entries.push(entry);
    });
  });

  const data = entries.reduce<Dataset[]>((accumulator, entry) => {
    // Skip entries with no worktime to accumulate
    if (entry.duration === 0) {
      return accumulator;
    }

    if (entry.durationInHours) {
      const label = entry[key] ? String(entry[key]) : "unknown";
      const existingDatasetIndex = accumulator.findIndex((data) => {
        return data.label === label;
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

  return { datasets: [{ data }], labels: [] };
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

export function formatAreaChartData(
  workdays: Workday[],
  key: keyof Entry,
  variant: "stacked" | "default",
) {
  const datasets = new Map<string, Map<string, number>>();

  workdays.forEach((workday) => {
    workday.entries.forEach((entry) => {
      if (entry.duration === 0 || !entry.durationInHours) {
        return;
      }

      const label = entry[key] ? String(entry[key]) : "unknown";
      const dataByDate = datasets.get(label) ?? new Map<string, number>();
      dataByDate.set(workday.date, (dataByDate.get(workday.date) ?? 0) + entry.duration);
      datasets.set(label, dataByDate);
    });
  });

  const labels = workdays.map((workday) => workday.date);

  return {
    datasets: Array.from(datasets, ([label, dataByDate]) => ({
      label,
      ...(variant === "stacked" && { fill: "stack" }),
      data: (variant === "stacked" ? Array.from(dataByDate.keys()) : [...labels])
        .reverse()
        .map((date) => ({ date, hours: dataByDate.get(date) ?? 0 })),
    })),
    labels,
  };
}
