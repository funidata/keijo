import { useLocalStorage } from "usehooks-ts";

type AccordionState = {
  [key: string]: { expanded: boolean };
};

const useEntryTemplateAccordionState = () => {
  const key = "entry-template-accordion-state";
  const [accordionState, setAccordionStates] = useLocalStorage<AccordionState>(key, {});

  const expanded = accordionState[key]?.expanded ?? false;

  const setExpanded = (value: boolean) => {
    setAccordionStates({ [key]: { expanded: value } });
  };

  return { expanded, setExpanded };
};

export default useEntryTemplateAccordionState;
