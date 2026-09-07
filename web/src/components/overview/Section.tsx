import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import type { GraphAreaConfig } from "./chartTypes";
import { Workday } from "../../graphql/generated/graphql";
import Graph from "./Graph";

interface SectionProps {
  workdays: Workday[];
  section: GraphAreaConfig;
  index: number;
}

export default function Section({ section, index, workdays }: SectionProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h6">{t(`overview.hoursBy.${section.key}`)}</Typography>
      <Grid container spacing={6}>
        {section.graphs.map((graph, graphIndex) => (
          <Grid key={graphIndex} size={{ xs: 12, sm: 6 }}>
            <Graph
              sectionIndex={index}
              graph={graph}
              graphIndex={graphIndex}
              chartKey={section.key}
              workdays={workdays}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
