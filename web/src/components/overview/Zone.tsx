import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import type { GraphZoneConfig } from "./graphTypes";
import Graph from "./Graph";

interface ZoneProps {
  zone: GraphZoneConfig;
  index: number;
}

export default function Zone({ zone, index }: ZoneProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h6">{t(`overview.hoursBy.${zone.groupBy}`)}</Typography>
      <Grid container spacing={6}>
        {zone.graphs.map((config, graphIndex) => (
          <Grid key={graphIndex} size={{ xs: 12, sm: 6 }}>
            <Graph
              zoneIndex={index}
              config={config}
              graphIndex={graphIndex}
              groupBy={zone.groupBy}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
