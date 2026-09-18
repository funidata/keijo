import Stack from "@mui/material/Stack";
import LoadingIndicator from "../workday-browser/LoadingIndicator";
import Zone from "./Zone";
import { useOverviewConfig } from "./OverviewContext";

export default function Overview() {
  const { overviewConfig, isLoading } = useOverviewConfig();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Stack direction="column" spacing={4}>
      {overviewConfig.map((zone, zoneIndex) => (
        <Zone key={zoneIndex} zone={zone} index={zoneIndex} />
      ))}
    </Stack>
  );
}
