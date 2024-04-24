import { useParams } from "react-router-dom";
import dayjs from "../../common/dayjs";
import { BrowsingMode } from "./ListControls";

const dateFormat = "YYYY-MM-DD";

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

export const datesFromParams = (
  mode: BrowsingMode,
  fromParam: string | undefined,
  toParam: string | undefined,
) => {
  if (mode === "week") {
    return parseWeekParam(fromParam);
  }

  return parseRangeParams(fromParam, toParam);
};

export const useWorkdayBrowserParams = () => {
  const { browsingMode, from: fromParam, to: toParam } = useParams();

  const { from, to } = datesFromParams(browsingMode as BrowsingMode, fromParam, toParam);

  return {
    from,
    to,
    fromFormatted: from.format(dateFormat),
    toFormatted: to.format(dateFormat),
  };
};
