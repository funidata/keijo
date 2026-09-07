import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";

import PieChart from "./PieChart";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import { Workday } from "../../graphql/generated/graphql";
import type { ChartKey } from "./chartTypes";
import type { GraphConfig } from "./useChartAreaConfig";
import useChartAreaConfig from "./useChartAreaConfig";

interface GraphProps {
  graph: GraphConfig;
  graphIndex: number;
  chartKey: ChartKey;
  workdays: Workday[];
  sectionIndex: number;
}

export default function Graph({ graph, graphIndex, chartKey, workdays, sectionIndex }: GraphProps) {
  const { t } = useTranslation();
  const { handleTotalsChartVariantChange, handleTimelineChartVariantChange } = useChartAreaConfig();

  switch (graph.type) {
    case "totals":
      return (
        <Grid key={graphIndex} size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" sx={{ justifyContent: "end", width: "100%" }}>
            <FormControl size="small" variant="standard">
              <Select
                id={`totals-${sectionIndex}-${graphIndex}`}
                value={graph.variant}
                label={t(`overview.totalsVariant.label`)}
                onChange={(event) =>
                  handleTotalsChartVariantChange(event.target.value, graphIndex, sectionIndex)
                }
              >
                <MenuItem value="bar-horizontal">
                  {t(`overview.totalsVariant.barHorizontal`)}
                </MenuItem>
                <MenuItem value="bar-vertical">{t(`overview.totalsVariant.barVertical`)}</MenuItem>
                <MenuItem value="pie">{t(`overview.totalsVariant.pie`)}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          {graph.variant === "bar-horizontal" && (
            <BarChart chartKey={chartKey} workdays={workdays} orientation="horizontal" />
          )}
          {graph.variant === "bar-vertical" && (
            <BarChart chartKey={chartKey} workdays={workdays} orientation="vertical" />
          )}
          {graph.variant === "pie" && <PieChart chartKey={chartKey} workdays={workdays} />}
        </Grid>
      );
    case "timeline":
      return (
        <Grid key={graphIndex} size={{ xs: 12, sm: 6 }}>
          <Stack direction="row" sx={{ justifyContent: "end", width: "100%" }}>
            <FormControl size="small" variant="standard">
              <Select
                id={`timeline-${sectionIndex}-${graphIndex}`}
                value={graph.variant}
                label={t(`overview.timelineVariant.label`)}
                onChange={(event) =>
                  handleTimelineChartVariantChange(event.target.value, graphIndex, sectionIndex)
                }
              >
                <MenuItem value="default">{t(`overview.timelineVariant.unstacked`)}</MenuItem>
                <MenuItem value="stacked">{t(`overview.timelineVariant.stacked`)}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <AreaChart chartKey={chartKey} workdays={workdays} variant={graph.variant} />
        </Grid>
      );
    default:
      return null;
  }
}
