import { useCallback, useState } from "react";
import type { DragEvent } from "react";
import { useOverviewConfig } from "./OverviewContext";

const ZONE_DRAG_TYPE = "application/x-keijo-overview-zone";

export default function useDraggableZones() {
  const { updateOverviewConfig } = useOverviewConfig();
  const [draggedZoneIndex, setDraggedZoneIndex] = useState<number | null>(null);

  const moveZone = useCallback(
    (sourceIndex: number, targetIndex: number) => {
      if (sourceIndex === targetIndex) {
        return;
      }

      updateOverviewConfig((previousConfig) => {
        const newConfig = [...previousConfig];
        const [zone] = newConfig.splice(sourceIndex, 1);

        if (!zone) {
          return previousConfig;
        }

        newConfig.splice(targetIndex, 0, zone);
        return newConfig;
      });
    },
    [updateOverviewConfig],
  );

  return {
    draggedZoneIndex,
    handleZoneDragStart: (event: DragEvent<HTMLDivElement>, zoneIndex: number) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData(ZONE_DRAG_TYPE, String(zoneIndex));
      setDraggedZoneIndex(zoneIndex);
    },
    handleZoneDrop: (event: DragEvent<HTMLDivElement>, targetIndex: number) => {
      event.preventDefault();
      const serializedSourceIndex = event.dataTransfer.getData(ZONE_DRAG_TYPE);
      const sourceIndex = Number(serializedSourceIndex);

      if (serializedSourceIndex && Number.isInteger(sourceIndex) && sourceIndex >= 0) {
        moveZone(sourceIndex, targetIndex);
      }

      setDraggedZoneIndex(null);
    },
    setDraggedZoneIndex,
  };
}
