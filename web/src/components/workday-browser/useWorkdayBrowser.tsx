import { Dayjs } from "dayjs";
import { create } from "zustand";
import dayjs from "../../common/dayjs";

type WorkdayBrowserOptions = {
  start: Dayjs;
  end: Dayjs;
  setStart: (start: Dayjs) => void;
  setEnd: (end: Dayjs) => void;
};

const lastMonday = dayjs().weekday(0);

const useWorkdayBrowser = create<WorkdayBrowserOptions>((set) => ({
  start: lastMonday,
  end: lastMonday.add(7, "day"),
  setStart: (start) =>
    set((state) => ({
      start,
      end: state.end.isBefore(start) ? start : state.end,
    })),
  setEnd: (end) =>
    set((state) => ({
      end: end.isBefore(state.start) ? state.start : end,
    })),
}));

export default useWorkdayBrowser;
