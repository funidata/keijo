import { createContext } from "react";
import { EntryTemplateType } from "../../../graphql/generated/graphql";
import { Dayjs } from "dayjs";

type EntryContextValue = {
  selectedEntries: EntryTemplateType[];
  addSelectedEntry: (entry: EntryTemplateType) => void;
  removeSelectedEntry: (entry: EntryTemplateType) => void;
  clearEntries: () => void;
  hasEntry: (entry: EntryTemplateType) => boolean;
  hasEntries: boolean;
  editDate: Dayjs | null;
  setEditDate: (date: Dayjs | null) => void;
};

export const EntryContext = createContext<EntryContextValue | undefined>(undefined);
