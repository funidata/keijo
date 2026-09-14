import Stack from "@mui/material/Stack";
import Section from "./Section";
import { useChartAreaConfig } from "./OverviewContext";
import type { Workday } from "../../graphql/generated/graphql";

interface OverviewProps {
  workdays: Workday[]; // Replace `any` with the appropriate type for workdays
}
export default function Overview({ workdays }: OverviewProps) {
  const { chartAreaConfig } = useChartAreaConfig();

  return (
    <Stack direction="column" spacing={4}>
      {chartAreaConfig.map((section, sectionIndex) => (
        <Section key={sectionIndex} section={section} index={sectionIndex} workdays={workdays} />
      ))}
    </Stack>
  );
}
