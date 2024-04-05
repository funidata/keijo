import { Dayjs } from "dayjs";

export const isWeekend = (date: Dayjs): boolean => date.weekday() === 5 || date.weekday() === 6;
