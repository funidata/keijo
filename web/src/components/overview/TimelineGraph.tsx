import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import { TimelineGraphVariant, type GraphGroupByKey, type GraphConfig } from "./graphTypes";
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
      <Alert variant="outlined" severity="warning">
        TODO TimelineGraph: Implement the timeline graph display based on the following:
        <pre>
          {JSON.stringify(
            {
              variant: config.variant,
              groupBy,
              daterange: { start: workdays[0]?.date, end: workdays[workdays.length - 1]?.date },
            },
            null,
            2,
          )}
        </pre>
      </Alert>
    </>
  );
}
