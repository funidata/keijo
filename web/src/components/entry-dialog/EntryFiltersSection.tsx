import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import ProjectFilter from "./ProjectFilter";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useEntryFormFilters, { type EntryFormFilterKey } from "./useEntryFormFilters";
import Badge from "@mui/material/Badge";

export default function EntryFiltersSection() {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();
  const { filters, updateSelectedProjects, activeFilters } = useEntryFormFilters();
  const filterValueCount = Object.entries(filters)
    .filter(([key, value]) => activeFilters.includes(key as EntryFormFilterKey) && value.length > 0)
    .map(([, value]) => value.length)
    .reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      <Button
        onClick={() => setShowFilters((prev) => !prev)}
        size="small"
        variant="text"
        color="secondary"
        aria-label={
          showFilters ? undefined : t("controls.showFilters_aria", { count: filterValueCount })
        }
        sx={{ marginBottom: 1, color: "secondary.dark" }}
      >
        {showFilters ? t("controls.hideFilters") : t("controls.showFilters")}
        <Badge badgeContent={filterValueCount} color="secondary" sx={{ ml: 2 }} />
      </Button>
      <Collapse in={showFilters}>
        <ProjectFilter
          selectedProjects={filters.projects}
          onProjectsChange={updateSelectedProjects}
        />
      </Collapse>
    </>
  );
}
