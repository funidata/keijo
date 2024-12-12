import { Dayjs } from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import useDayjs from "../../common/useDayjs";
import { NotFoundException } from "../error/NotFoundException";

export type BrowsingMode = "week" | "range";
const dateFormat = "YYYY-MM-DD";

export const useWorkdayBrowserParams = () => {
  const dayjs = useDayjs();
  const navigate = useNavigate();
  const { browsingMode, from: fromParam, to: toParam } = useParams();

  // Validate browsing mode.
  if (!browsingMode || !["week", "range"].includes(browsingMode)) {
    throw new NotFoundException();
  }

  /**
   * Parse "from" and "to" dates from given week param.
   *
   * Defaults to current week if param is undefined.
   *
   * For consistency, week param should be the Monday of the given week. However,
   * this parser will work with other days of week as input, too.
   */
  const parseWeekParam = (weekParam: string | undefined) => {
    // TODO: Add cool error handling to redirect people away from old paths.
    const paramDay = dayjs(weekParam);
    const from = paramDay.weekday(0);
    const to = from.weekday(6);
    return { from, to };
  };

  /**
   * Parse "from" and "to" dates from given date range params.
   */
  const parseRangeParams = (fromParam: string | undefined, toParam: string | undefined) => {
    return {
      from: dayjs(fromParam),
      to: dayjs(toParam),
    };
  };

  const datesFromParams = (
    mode: BrowsingMode,
    fromParam: string | undefined,
    toParam: string | undefined,
  ) => {
    if (mode === "week") {
      return parseWeekParam(fromParam);
    }

    return parseRangeParams(fromParam, toParam);
  };

  const { from, to } = datesFromParams(browsingMode as BrowsingMode, fromParam, toParam);

  /**
   * Navigate to week including given day.
   */
  const goToWeek = (day: Dayjs) => {
    // Week start is defined as monday.
    // Using week numbers caused confusion near the end/beginning of year so it was changed to just dates.
    const weekStart = day.weekday(0);
    navigate(`/entries/week/${weekStart.format(dateFormat)}`);
  };

  /**
   * Navigate to given date range.
   *
   * Will not allow an invalid range, i.e., end before start.
   */
  const goToRange = (targetFrom: Dayjs, targetTo: Dayjs) => {
    const safeTo = targetTo.isBefore(targetFrom) ? targetFrom : targetTo;
    const newPath = `/entries/range/${targetFrom.format(dateFormat)}/${safeTo.format(dateFormat)}`;
    navigate(newPath);
  };

  return {
    browsingMode,
    from,
    to,
    formattedFrom: from.format(dateFormat),
    formattedTo: to.format(dateFormat),
    goToWeek,
    goToRange,
  };
};
