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
   * Defaults to current week if param is undefined. Assumes current year, if passed only
   * a single number. Also supports YYYY-WW notation (e.g. 2023-50), where WW is week number.
   */
  const parseWeekParam = (weekParam: string | undefined) => {
    let year = dayjs().year();
    let week = dayjs().week();

    if (weekParam) {
      const parsedFromParam = weekParam.split("-");
      year = parsedFromParam.length === 2 ? Number(parsedFromParam[0]) : dayjs().year();
      week = parsedFromParam.length === 2 ? Number(parsedFromParam[1]) : Number(weekParam);
    }

    const from = dayjs().year(year).week(week).weekday(0);
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
    const weekParam = day.year() === dayjs().year() ? day.week() : `${day.year()}-${day.week()}`;
    navigate(`/entries/week/${weekParam}`);
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
