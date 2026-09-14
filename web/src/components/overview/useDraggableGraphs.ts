import { useCallback, useState } from "react";
import type { DragEvent } from "react";
import { useOverviewConfig } from "./OverviewContext";

const GRAPH_DRAG_TYPE = "application/x-keijo-overview-graph";

export default function useDraggableGraphs(zoneIndex: number) {
  const { updateOverviewConfig } = useOverviewConfig();
  const [draggedGraphIndex, setDraggedGraphIndex] = useState<number | null>(null);

  const moveGraph = useCallback(
    (sectionIndex: number, sourceIndex: number, targetIndex: number) => {
      if (sourceIndex === targetIndex) {
        return;
      }

      updateOverviewConfig((previousConfig) => {
        const section = previousConfig[sectionIndex];

        if (!section) {
          return previousConfig;
        }

        const graphs = [...section.graphs];
        const [graph] = graphs.splice(sourceIndex, 1);

        if (!graph) {
          return previousConfig;
        }

        graphs.splice(targetIndex, 0, graph);
        const newConfig = [...previousConfig];
        newConfig[sectionIndex] = { ...section, graphs };
        return newConfig;
      });
    },
    [updateOverviewConfig],
  );

  return {
    draggedGraphIndex,
    handleGraphDragStart: (event: DragEvent<HTMLDivElement>, graphIndex: number) => {
      event.stopPropagation();
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(GRAPH_DRAG_TYPE, `${zoneIndex}:${graphIndex}`);
      setDraggedGraphIndex(graphIndex);
    },
    handleGraphDrop: (event: DragEvent<HTMLDivElement>, targetIndex: number) => {
      const serializedGraphLocation = event.dataTransfer.getData(GRAPH_DRAG_TYPE);

      if (!serializedGraphLocation) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const [sourceZoneIndex, sourceIndex] = serializedGraphLocation.split(":").map(Number);

      if (sourceZoneIndex === zoneIndex && Number.isInteger(sourceIndex) && sourceIndex >= 0) {
        moveGraph(zoneIndex, sourceIndex, targetIndex);
      }

      setDraggedGraphIndex(null);
    },
    setDraggedGraphIndex,
  };
}
