import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useState, type DragEvent } from "react";
import Section from "./Section";
import { useChartAreaConfig } from "./OverviewContext";
import type { Workday } from "../../graphql/generated/graphql";

interface OverviewProps {
  workdays: Workday[]; // Replace `any` with the appropriate type for workdays
}
export default function Overview({ workdays }: OverviewProps) {
  const { chartAreaConfig, moveSection } = useChartAreaConfig();
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);

  function handleDragStart(event: DragEvent<HTMLDivElement>, sectionIndex: number) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(sectionIndex));
    setDraggedSectionIndex(sectionIndex);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetIndex: number) {
    event.preventDefault();
    const sourceIndex = Number(event.dataTransfer.getData("text/plain"));

    if (Number.isInteger(sourceIndex) && sourceIndex >= 0) {
      moveSection(sourceIndex, targetIndex);
    }

    setDraggedSectionIndex(null);
  }

  return (
    <Stack direction="column" spacing={4}>
      {chartAreaConfig.map((section, sectionIndex) => (
        <Box
          key={section.key}
          draggable
          onDragStart={(event) => handleDragStart(event, sectionIndex)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDrop(event, sectionIndex)}
          onDragEnd={() => setDraggedSectionIndex(null)}
          sx={{ opacity: draggedSectionIndex === sectionIndex ? 0.5 : 1 }}
        >
          <Section section={section} index={sectionIndex} workdays={workdays} />
        </Box>
      ))}
    </Stack>
  );
}
