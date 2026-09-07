import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";

import PieChart from "./PieChart";
import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import useChartAreaConfig from "./useChartAreaConfig";
import type { GraphAreaConfig } from "./useChartAreaConfig";
import { Workday } from "../../graphql/generated/graphql";

interface SectionProps {
  workdays: Workday[];
  section: GraphAreaConfig;
  index: number;
}

export default function Section({ section, index, workdays }: SectionProps) {
  const { handleTotalsChartVariantChange, handleTimelineChartVariantChange } = useChartAreaConfig();
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h6">{t(`overview.hoursBy.${section.key}`)}</Typography>
      <Grid container spacing={6}>
        {section.graphs.map((graph, graphIndex) => {
          switch (graph.type) {
            case "totals":
              return (
                <Grid key={`${index}-${graphIndex}`} size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" sx={{ justifyContent: "end", width: "100%" }}>
                    <FormControl size="small" variant="standard">
                      <Select
                        id={`totals-${index}-${graphIndex}`}
                        value={graph.variant}
                        label={t(`overview.totalsVariant.label`)}
                        onChange={(event) =>
                          handleTotalsChartVariantChange(event.target.value, graphIndex, index)
                        }
                      >
                        <MenuItem value="bar-horizontal">
                          {t(`overview.totalsVariant.barHorizontal`)}
                        </MenuItem>
                        <MenuItem value="bar-vertical">
                          {t(`overview.totalsVariant.barVertical`)}
                        </MenuItem>
                        <MenuItem value="pie">{t(`overview.totalsVariant.pie`)}</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  {graph.variant === "bar-horizontal" && (
                    <BarChart
                      key={`${index}-${graphIndex}`}
                      chartKey={section.key}
                      workdays={workdays}
                      orientation="horizontal"
                    />
                  )}
                  {graph.variant === "bar-vertical" && (
                    <BarChart
                      key={`${index}-${graphIndex}`}
                      chartKey={section.key}
                      workdays={workdays}
                      orientation="vertical"
                    />
                  )}
                  {graph.variant === "pie" && (
                    <PieChart
                      key={`${index}-${graphIndex}`}
                      chartKey={section.key}
                      workdays={workdays}
                    />
                  )}
                </Grid>
              );
            case "timeline":
              return (
                <Grid key={`${index}-${graphIndex}`} size={{ xs: 12, sm: 6 }}>
                  <Stack direction="row" sx={{ justifyContent: "end", width: "100%" }}>
                    <FormControl size="small" variant="standard">
                      <Select
                        id={`timeline-${index}-${graphIndex}`}
                        value={graph.variant}
                        label={t(`overview.timelineVariant.label`)}
                        onChange={(event) =>
                          handleTimelineChartVariantChange(event.target.value, graphIndex, index)
                        }
                      >
                        <MenuItem value="default">
                          {t(`overview.timelineVariant.unstacked`)}
                        </MenuItem>
                        <MenuItem value="stacked">{t(`overview.timelineVariant.stacked`)}</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                  <AreaChart
                    key={`${index}-${graphIndex}`}
                    chartKey={section.key}
                    workdays={workdays}
                    variant={graph.variant}
                  />
                </Grid>
              );
            default:
              return null;
          }
        })}
      </Grid>
    </Box>
  );
}
