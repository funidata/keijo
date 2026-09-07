import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import type { GraphAreaConfig } from "./chartTypes";
import { Workday } from "../../graphql/generated/graphql";
import Graph from "./Graph";
import { useChartAreaConfig } from "./OverviewContext";

interface SectionProps {
  workdays: Workday[];
  section: GraphAreaConfig;
  index: number;
}

export default function Section({ section, index, workdays }: SectionProps) {
  const { t } = useTranslation();
  const { moveGraph } = useChartAreaConfig();
  const [draggedGraphIndex, setDraggedGraphIndex] = useState<number | null>(null);

  function handleDragStart(event: DragEvent<HTMLDivElement>, graphIndex: number) {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(graphIndex));
    setDraggedGraphIndex(graphIndex);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetIndex: number) {
    event.preventDefault();
    event.stopPropagation();
    const sourceIndex = Number(event.dataTransfer.getData("text/plain"));

    if (Number.isInteger(sourceIndex) && sourceIndex >= 0) {
      moveGraph(index, sourceIndex, targetIndex);
    }

    setDraggedGraphIndex(null);
  }

  return (
    <Box>
      <Typography variant="h6">{t(`overview.hoursBy.${section.key}`)}</Typography>
      <Grid container spacing={6}>
        {section.graphs.map((graph, graphIndex) => (
          <Grid
            key={graph.type}
            size={{ xs: 12, sm: 6 }}
            draggable
            onDragStart={(event) => handleDragStart(event, graphIndex)}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onDrop={(event) => handleDrop(event, graphIndex)}
            onDragEnd={(event) => {
              event.stopPropagation();
              setDraggedGraphIndex(null);
            }}
            sx={{ opacity: draggedGraphIndex === graphIndex ? 0.5 : 1 }}
          >
            <Graph
              sectionIndex={index}
              graph={graph}
              graphIndex={graphIndex}
              chartKey={section.key}
              workdays={workdays}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
