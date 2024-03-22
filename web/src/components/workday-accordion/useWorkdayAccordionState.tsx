import { Dayjs } from "dayjs";
import { useLocalStorage } from "usehooks-ts";

type AccordionState = {
  [key: string]: { expanded: boolean };
};

const useWorkdayAccordionState = (date: Dayjs) => {
  const key = "workday-accordion-states";
  const [accordionStates, setAccordionStates] = useLocalStorage<AccordionState>(key, {});
  const shortDate = date.format("YYYY-MM-DD");

  const expanded = Object.keys(accordionStates).includes(shortDate)
    ? accordionStates[shortDate].expanded
    : true;

  const setExpanded = (value: boolean) => {
    setAccordionStates({ ...accordionStates, [shortDate]: { expanded: value } });
  };

  return { expanded, setExpanded };
};

export default useWorkdayAccordionState;
