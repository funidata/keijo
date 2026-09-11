import Stack from "@mui/material/Stack";
import Zone from "./Zone";
import { useOverviewConfig } from "./OverviewContext";

export default function Overview() {
  const { overviewConfig } = useOverviewConfig();

  return (
    <Stack direction="column" spacing={4}>
      {overviewConfig.map((zone, zoneIndex) => (
        <Zone key={zoneIndex} zone={zone} index={zoneIndex} />
      ))}
    </Stack>
  );
}
