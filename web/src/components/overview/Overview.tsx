import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Zone from "./Zone";
import { useOverviewConfig } from "./OverviewContext";
import useDraggableGraphs from "./useDraggableGraphs";

export default function Overview() {
  const { overviewConfig } = useOverviewConfig();
  const { handleZoneDragStart, handleZoneDrop, draggedZoneIndex, setDraggedZoneIndex } =
    useDraggableGraphs();

  return (
    <Stack direction="column" spacing={4}>
      {overviewConfig.map((zone, zoneIndex) => (
        <Box
          key={zoneIndex}
          draggable
          onDragStart={(event) => handleZoneDragStart(event, zoneIndex)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleZoneDrop(event, zoneIndex)}
          onDragEnd={() => setDraggedZoneIndex(null)}
          sx={{ opacity: draggedZoneIndex === zoneIndex ? 0.5 : 1 }}
        >
          <Zone zone={zone} index={zoneIndex} />
        </Box>
      ))}
    </Stack>
  );
}
