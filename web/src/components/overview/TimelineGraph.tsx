import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import { TimelineGraphVariant, type GraphGroupByKey, type GraphConfig } from "./graphTypes";
import LineChart from "./charts/LineChart";
import { useOverviewConfig } from "./OverviewContext";

interface TimelineGraphProps {
  graphIndex: number;
  zoneIndex: number;
  config: GraphConfig;
  groupBy: GraphGroupByKey;
  onChangeVariant: (variant: TimelineGraphVariant) => void;
}

export default function TimelineGraph({
  graphIndex,
  zoneIndex,
  config,
  groupBy,
  onChangeVariant,
}: TimelineGraphProps) {
  const { t } = useTranslation();
  const { workdays } = useOverviewConfig();
  const id = `timeline-${zoneIndex}-${graphIndex}`;

  return (
    <>
      <Stack direction="row" sx={{ justifyContent: "end", width: "100%" }}>
        <FormControl size="small" variant="standard">
          <Select
            labelId={`label-${zoneIndex}-${graphIndex}`}
            id={id}
            value={config.variant}
            label={t(`overview.timelineVariant.label`)}
            onChange={(event) => onChangeVariant(event.target.value as TimelineGraphVariant)}
          >
            {Object.values(TimelineGraphVariant).map((variant) => (
              <MenuItem key={variant} value={variant}>
                {t(`overview.timelineVariant.${variant.toLowerCase()}`)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <LineChart
        key={config.variant}
        groupBy={groupBy}
        workdays={workdays}
        variant={config.variant as TimelineGraphVariant}
      />
    </>
  );
}
