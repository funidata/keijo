import { Entry, Workday } from "../../graphql/generated/schema-types";
import dayjs from "../../common/dayjs";

interface AccumulatedDataset {
  label: string;
  value: number;
}

export function formatAccumulatedChartData(workdays: Workday[], key: keyof Entry) {
  const accumulatedData = workdays
    .flatMap((workday) => workday.entries)
    .reduce<AccumulatedDataset[]>((accumulator, entry) => {
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

  return {
    labels: [...workdays.slice(0, 1).map((workday) => workday.date)],
    datasets: accumulatedData.map(({ label, value }) => ({ label, data: [value] })),
  };
}

export function formatChartDataForPieChart(data: ReturnType<typeof formatAccumulatedChartData>) {
  return {
    labels: data.datasets.map((dataset) => dataset.label),
    datasets: [{ data: data.datasets.map((dataset) => dataset.data[0]) }],
  };
}

export function formatAreaChartData(
  workdays: Workday[],
  key: keyof Entry,
  variant: "stacked" | "default",
  formatWeekNumber: (weekNumber: string) => string = (weekNumber) => weekNumber,
) {
  const datasets = new Map<string, Map<string, number>>();
  const dates = workdays.map((workday) => workday.date);
  const sortedDates = [...dates].sort();
  const spansMoreThanSevenDays =
    sortedDates.length > 0 && dayjs(sortedDates.at(-1)).diff(dayjs(sortedDates[0]), "day") + 1 > 7;
  const labels = spansMoreThanSevenDays
    ? Array.from(new Set(dates.map((date) => dayjs(date).startOf("week").format("YYYY-MM-DD"))))
    : dates;
  const displayLabels = spansMoreThanSevenDays
    ? labels.map((date) => formatWeekNumber(dayjs(date).week().toString()))
    : labels;

  workdays.forEach((workday) => {
    workday.entries.forEach((entry) => {
      if (entry.duration === 0 || !entry.durationInHours) {
        return;
      }

      const label = entry[key] ? String(entry[key]) : "unknown";
      const dataByDate = datasets.get(label) ?? new Map<string, number>();
      const date = spansMoreThanSevenDays
        ? dayjs(workday.date).startOf("week").format("YYYY-MM-DD")
        : workday.date;
      dataByDate.set(date, (dataByDate.get(date) ?? 0) + entry.duration);
      datasets.set(label, dataByDate);
    });
  });

  return {
    datasets: Array.from(datasets, ([label, dataByDate]) => ({
      label,
      ...(variant === "stacked" && { fill: "stack" }),
      data: [...labels].reverse().map((date) => ({
        date: spansMoreThanSevenDays ? formatWeekNumber(dayjs(date).week().toString()) : date,
        hours: dataByDate.get(date) ?? 0,
      })),
    })),
    labels: displayLabels,
  };
}
