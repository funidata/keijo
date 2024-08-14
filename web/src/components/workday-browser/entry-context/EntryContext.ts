import { createContext } from "react";
import { Entry } from "../../../graphql/generated/graphql";
import { Dayjs } from "dayjs";

type EntryContextValue = {
  selectedEntries: Entry[];
  addSelectedEntry: (entry: Entry) => void;
  removeSelectedEntry: (entry: Entry) => void;
  clearEntries: () => void;
  hasEntry: (entry: Entry) => boolean;
  hasEntries: boolean;
  editDate: Dayjs | null;
  setEditDate: (date: Dayjs | null) => void;
};

export const EntryContext = createContext<EntryContextValue | undefined>(undefined);
