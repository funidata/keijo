import { useState, useCallback } from "react";
import type { DragEvent } from "react";
import { useOverviewConfig } from "./OverviewContext";
import { OVERVIEW_CONFIG_LOCALSTORAGE_KEY } from "./constants";

const ZONE_DRAG_TYPE = "application/x-keijo-overview-zone";
const GRAPH_DRAG_TYPE = "application/x-keijo-overview-graph";

export default function useDraggableGraphs() {
  const { updateOverviewConfig, overviewConfig } = useOverviewConfig();
  const [draggedGraphIndex, setDraggedGraphIndex] = useState<number | null>(null);
  const [draggedZoneIndex, setDraggedZoneIndex] = useState<number | null>(null);

  const handleZoneDragStart = (event: DragEvent<HTMLDivElement>, zoneIndex: number) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(ZONE_DRAG_TYPE, String(zoneIndex));
    setDraggedZoneIndex(zoneIndex);
  };

  function handleZoneDrop(event: DragEvent<HTMLDivElement>, targetIndex: number) {
    event.preventDefault();
    const serializedSourceIndex = event.dataTransfer.getData(ZONE_DRAG_TYPE);
    const sourceIndex = Number(serializedSourceIndex);

    if (serializedSourceIndex && Number.isInteger(sourceIndex) && sourceIndex >= 0) {
      moveZone(sourceIndex, targetIndex);
    }

    setDraggedZoneIndex(null);
  }

  function handleGraphDragStart(
    event: DragEvent<HTMLDivElement>,
    graphIndex: number,
    zoneIndex: number,
  ) {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(GRAPH_DRAG_TYPE, `${zoneIndex}:${graphIndex}`);
    setDraggedGraphIndex(graphIndex);
  }

  function handleGraphDrop(
    event: DragEvent<HTMLDivElement>,
    targetIndex: number,
    zoneIndex: number,
  ) {
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
  }

  const moveGraph = useCallback(
    (sectionIndex: number, sourceIndex: number, targetIndex: number) => {
      if (sourceIndex === targetIndex) {
        return;
      }

      const section = overviewConfig[sectionIndex];
      const graphs = [...section.graphs];
      const [graph] = graphs.splice(sourceIndex, 1);

      if (!graph) {
        return;
      }

      graphs.splice(targetIndex, 0, graph);
      const newConfig = [...overviewConfig];
      newConfig[sectionIndex] = { ...section, graphs };

      localStorage.setItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY, JSON.stringify(newConfig));
      updateOverviewConfig(newConfig);
    },
    [updateOverviewConfig, overviewConfig],
  );

  const moveZone = useCallback(
    (sourceIndex: number, targetIndex: number) => {
      if (sourceIndex === targetIndex) {
        return;
      }

      const newConfig = [...overviewConfig];
      const [section] = newConfig.splice(sourceIndex, 1);

      if (!section) {
        return;
      }

      newConfig.splice(targetIndex, 0, section);
      localStorage.setItem(OVERVIEW_CONFIG_LOCALSTORAGE_KEY, JSON.stringify(newConfig));

      updateOverviewConfig(newConfig);
    },
    [updateOverviewConfig, overviewConfig],
  );

  return {
    draggedGraphIndex,
    draggedZoneIndex,
    handleZoneDragStart,
    handleZoneDrop,
    moveGraph,
    moveZone,
    handleGraphDragStart,
    handleGraphDrop,
    setDraggedGraphIndex,
    setDraggedZoneIndex,
  };
}
