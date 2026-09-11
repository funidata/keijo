import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import { TotalsGraphVariant, type GraphGroupByKey, type GraphConfig } from "./graphTypes";
import { useOverviewConfig } from "./OverviewContext";

interface TotalsGraphProps {
  graphIndex: number;
  zoneIndex: number;
  config: GraphConfig;
  groupBy: GraphGroupByKey;
  onChangeVariant: (variant: TotalsGraphVariant) => void;
}

export default function TotalsGraph({
  graphIndex,
  zoneIndex,
  config,
  groupBy,
  onChangeVariant,
}: TotalsGraphProps) {
  const { t } = useTranslation();
  const { workdays } = useOverviewConfig();
  return (
    <>
      <Stack direction="row" sx={{ justifyContent: "end", width: "100%" }}>
        <FormControl size="small" variant="standard">
          <Select
            id={`totals-${zoneIndex}-${graphIndex}`}
            value={config.variant}
            label={t(`overview.totalsVariant.label`)}
            onChange={(event) => onChangeVariant(event.target.value as TotalsGraphVariant)}
          >
            {Object.values(TotalsGraphVariant).map((variant) => {
              return (
                <MenuItem key={variant} value={variant}>
                  {t(`overview.totalsVariant.${variant}`)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
      <Alert variant="outlined" severity="warning">
        TODO TotalsGraph: Implement the totals graph display based on the following:
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
