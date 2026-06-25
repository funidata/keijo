import { useQuery, useMutation, useApolloClient } from "@apollo/client/react";
import { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { GetMySettingsDocument, UpdateSettingsDocument } from "../../graphql/generated/graphql";

// Add new filter keys with OR ("|")
export type EntryFormFilterKey = "projects";

type EntryFormFilters = Record<EntryFormFilterKey, string[]>;

type EntryFormFiltersResult = {
  filters: EntryFormFilters;
  activeFilters: EntryFormFilterKey[];
  updateSelectedProjects: (newProjectKeys: string[]) => void;
};

export default function useEntryFormFilters(): EntryFormFiltersResult {
  const { data: settingsData } = useQuery(GetMySettingsDocument);
  const serverPreset = settingsData?.getMySettings.projectsPreset;
  const [selectedProjectKeys, setSelectedProjectKeys] = useState<string[]>([]);
  const initialized = useRef(false);
  const client = useApolloClient();
  const [updateSettings] = useMutation(UpdateSettingsDocument, {
    refetchQueries: [GetMySettingsDocument],
  });

  useEffect(() => {
    if (!initialized.current && serverPreset !== undefined) {
      initialized.current = true;
      setSelectedProjectKeys(serverPreset ?? []);
    }
  }, [serverPreset]);

  const activeFilters = useMemo(() => {
    const usedFilters: EntryFormFilterKey[] = [];

    if (selectedProjectKeys.length > 0) {
      usedFilters.push("projects");
    }

    return usedFilters;
  }, [selectedProjectKeys]);

  const updateSelectedProjects = useCallback((newProjectKeys: string[]) => {
    setSelectedProjectKeys(newProjectKeys);
    const existing = client.readQuery({ query: GetMySettingsDocument });
    if (existing) {
      client.writeQuery({
        query: GetMySettingsDocument,
        data: { getMySettings: { ...existing.getMySettings, projectsPreset: newProjectKeys } },
      });
    }
    updateSettings({ variables: { settings: { projectsPreset: newProjectKeys } } });
  }, []);

  return {
    filters: {
      projects: selectedProjectKeys,
    },
    activeFilters,
    updateSelectedProjects,
  };
}
