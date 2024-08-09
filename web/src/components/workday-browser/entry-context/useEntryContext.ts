import { useContext } from "react";
import { EntryContext } from "./EntryContext";

export const useEntryContext = () => {
  const entryContext = useContext(EntryContext);
  if (entryContext === undefined) {
    throw new Error("context must be inside a entryProvider");
  }
  return entryContext;
};
