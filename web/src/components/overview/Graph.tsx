import type { GraphGroupByKey, GraphConfig } from "./graphTypes";
import { useOverviewConfig } from "./OverviewContext";
import Alert from "@mui/material/Alert";

interface GraphProps {
  config: GraphConfig;
  graphIndex: number;
  groupBy: GraphGroupByKey;
  zoneIndex: number;
}

export default function Graph(props: GraphProps) {
  const { config, groupBy } = props;
  const { workdays } = useOverviewConfig();

  return (
    <Alert variant="outlined" severity="warning">
      TODO: Implement the graph display based on the following:
      <pre>
        {JSON.stringify(
          {
            type: config.type,
            variant: config.variant,
            groupBy,
            daterange: { start: workdays[0]?.date, end: workdays[workdays.length - 1]?.date },
          },
          null,
          2,
        )}
      </pre>
    </Alert>
  );
}
