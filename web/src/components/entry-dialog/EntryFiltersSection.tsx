import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import ProjectFilter from "./ProjectFilter";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function EntryFiltersSection() {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button
        onClick={() => setShowFilters((prev) => !prev)}
        size="small"
        variant="text"
        aria-label={showFilters ? t("controls.hideFilters") : t("controls.showFilters")}
      >
        {showFilters ? t("controls.hideFilters") : t("controls.showFilters")}
      </Button>
      <Collapse in={showFilters}>
        <ProjectFilter />
      </Collapse>
    </>
  );
}
