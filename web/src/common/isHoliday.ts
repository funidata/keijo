import { Dayjs } from "dayjs";
import holidaysRaw from "../assets/holidays.json";
import dayjs from "./dayjs";

const holidays = holidaysRaw.map(dayjs);

export const isHoliday = (date: Dayjs): boolean =>
  !!holidays.find((holiday) => date.isSame(holiday, "date"));
