import { useCallback, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

type AccordionState = {
  [key: string]: { expanded: boolean };
};

const useEntryTemplateAccordionState = () => {
  const key = "entry-template-accordion-state";
  const [accordionState, setAccordionStates] = useLocalStorage<AccordionState>(key, {});

  const expanded = useMemo(() => {
    return accordionState[key]?.expanded ?? false;
  }, [accordionState, key]);

  const setExpanded = useCallback(
    (value: boolean) => {
      setAccordionStates({ [key]: { expanded: value } });
    },
    [setAccordionStates],
  );

  return { expanded, setExpanded };
};

export default useEntryTemplateAccordionState;
