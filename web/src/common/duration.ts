import dayjs from "dayjs";
import { Duration } from "dayjs/plugin/duration";
import { sumBy } from "lodash";
import { Entry } from "../graphql/generated/graphql";
import { EntryType } from "./entryType.enum";

/**
 * Rounds duration to minute-precision.
 *
 * Simply increments the minute-part of give `Duration` if the second-part is 30 or greater.
 * In practice, this is necessary when showing durations from NV API as it stores only two
 * decimals of the hour-based duration value. This loss of precision causes the rounded value
 * to sometimes be a little less than a full minute leading to incorrect minute-precision
 * duration to be shown on UI.
 *
 * I.e., duration 0:35 in decimal form is 0.58333... and gets saved as 0.58. When this is
 * coverted back to duration we get 0:34:47 which `Duration.format("HH:mm")` shows as 0:34.
 */
export const roundToFullMinutes = (duration: Duration): Duration => {
  // Duration does not offer methods to mutate it or create new edited durations, so we hack it.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dur = duration as any;

  if (dur.$d.seconds >= 30) {
    dur.$d.minutes++;
  }

  dur.$d.seconds = 0;

  return dur;
};

/**
 * Sum durations of given entries.
 *
 * Ignores entries which are not hour-based.
 */
export const totalDurationOfEntries = (entries: Entry[]): Duration => {
  const totalHours = sumBy(
    entries.filter((entry) => entry.durationInHours && entry.ratioNumber !== EntryType.travelTime),
    "duration",
  );
  return dayjs.duration(totalHours, "hour");
};
