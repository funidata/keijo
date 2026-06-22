import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import ProjectFilter from "./ProjectFilter";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useEntryFormFilters from "./useEntryFormFilters";
import Badge from "@mui/material/Badge";

export default function EntryFiltersSection() {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();
  const { filters, updateSelectedProjects, activeFilters } = useEntryFormFilters();

  return (
    <>
      <Button
        onClick={() => setShowFilters((prev) => !prev)}
        size="small"
        variant="text"
        aria-label={
          showFilters ? undefined : t("controls.showFilters_aria", { count: activeFilters.length })
        }
        sx={{ marginBottom: 1 }}
      >
        {showFilters ? t("controls.hideFilters") : t("controls.showFilters")}
        <Badge badgeContent={activeFilters.length} color="primary" sx={{ ml: 2 }} />
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
