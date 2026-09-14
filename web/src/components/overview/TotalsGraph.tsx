import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import { ChartKey, GraphConfig, TotalsChartVariant } from "./chartTypes";
import { Workday } from "../../graphql/generated/graphql";

interface TotalsGraphProps {
  graphIndex: number;
  sectionIndex: number;
  graph: GraphConfig;
  chartKey: ChartKey;
  workdays: Workday[];
  onChangeVariant: (variant: TotalsChartVariant) => void;
}

export default function TotalsGraph({
  graphIndex,
  sectionIndex,
  graph,
  chartKey,
  workdays,
  onChangeVariant,
}: TotalsGraphProps) {
  const { t } = useTranslation();
  return (
    <>
      <Stack direction="row" sx={{ justifyContent: "end", width: "100%" }}>
        <FormControl size="small" variant="standard">
          <Select
            id={`totals-${sectionIndex}-${graphIndex}`}
            value={graph.variant}
            label={t(`overview.totalsVariant.label`)}
            onChange={(event) => onChangeVariant(event.target.value as TotalsChartVariant)}
          >
            <MenuItem value="bar-horizontal">{t(`overview.totalsVariant.barHorizontal`)}</MenuItem>
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
    </>
  );
}
