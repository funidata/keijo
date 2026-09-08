import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import type { GraphZoneConfig } from "./graphTypes";
import Graph from "./Graph";
import useDraggableGraphs from "./useDraggableGraphs";

interface ZoneProps {
  zone: GraphZoneConfig;
  index: number;
}

export default function Zone({ zone, index }: ZoneProps) {
  const { t } = useTranslation();
  const { draggedGraphIndex, setDraggedGraphIndex, handleGraphDragStart, handleGraphDrop } =
    useDraggableGraphs();

  return (
    <Box>
      <Typography variant="h6">{t(`overview.hoursBy.${zone.groupBy}`)}</Typography>
      <Grid container spacing={6}>
        {zone.graphs.map((config, graphIndex) => (
          <Grid
            key={graphIndex}
            size={{ xs: 12, sm: 6 }}
            draggable
            onDragStart={(event) => handleGraphDragStart(event, graphIndex, index)}
            onDragOver={(event) => {
              if (event.dataTransfer.types.includes("application/x-keijo-overview-graph")) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
            onDrop={(event) => handleGraphDrop(event, graphIndex, index)}
            onDragEnd={(event) => {
              event.stopPropagation();
              setDraggedGraphIndex(null);
            }}
            sx={{ opacity: draggedGraphIndex === graphIndex ? 0.5 : 1 }}
          >
            <Graph
              zoneIndex={index}
              config={config}
              graphIndex={graphIndex}
              groupBy={zone.groupBy}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
