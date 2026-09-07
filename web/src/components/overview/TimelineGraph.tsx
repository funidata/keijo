import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import AreaChart from "./AreaChart";
import type { ChartKey, GraphConfig, TimelineChartVariant } from "./chartTypes";
import type { Workday } from "../../graphql/generated/graphql";

interface TimelineGraphProps {
  graphIndex: number;
  sectionIndex: number;
  graph: GraphConfig;
  chartKey: ChartKey;
  workdays: Workday[];
  onChangeVariant: (variant: TimelineChartVariant) => void;
}

export default function TimelineGraph({
  graphIndex,
  sectionIndex,
  graph,
  chartKey,
  workdays,
  onChangeVariant,
}: TimelineGraphProps) {
  const { t } = useTranslation();
  const id = `timeline-${sectionIndex}-${graphIndex}`; 

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: "end", width: "100%" }}>
        <FormControl size="small" variant="standard">
          <Select
            labelId={`label-${sectionIndex}-${graphIndex}`}
            id={id}
            value={graph.variant}
            label={t(`overview.timelineVariant.label`)}
            onChange={(event) => onChangeVariant(event.target.value as TimelineChartVariant)}
          >
            <MenuItem value="default">{t(`overview.timelineVariant.unstacked`)}</MenuItem>
            <MenuItem value="stacked">{t(`overview.timelineVariant.stacked`)}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <AreaChart
        key={graph.variant}
        chartKey={chartKey}
        workdays={workdays}
        variant={graph.variant as TimelineChartVariant}
      />
    </>
  );
}
