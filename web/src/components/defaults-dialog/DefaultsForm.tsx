import { useMutation, useQuery } from "@apollo/client";
import { Autocomplete, FormControl, Grid, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  FindDimensionOptionsDocument,
  GetMySettingsDocument,
  UpdateSettingsDocument,
} from "../../graphql/generated/graphql";

const DefaultsForm = () => {
  const { t } = useTranslation();
  const { data: dimensionData } = useQuery(FindDimensionOptionsDocument);
  const { data: settingsData } = useQuery(GetMySettingsDocument);
  const [updateSettings] = useMutation(UpdateSettingsDocument, {
    refetchQueries: [GetMySettingsDocument],
  });

  if (!settingsData) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <FormControl fullWidth>
          <Autocomplete
            onChange={(_, value) =>
              updateSettings({ variables: { settings: { productPreset: value } } })
            }
            options={dimensionData?.findDimensionOptions.product || []}
            value={settingsData?.getMySettings.productPreset}
            renderInput={(params) => <TextField {...params} label={t("entryDialog.product")} />}
          />
        </FormControl>
      </Grid>
      <Grid
        size={{
          xs: 12,
          md: 6,
        }}
      >
        <FormControl fullWidth>
          <Autocomplete
            onChange={(_, value) =>
              updateSettings({ variables: { settings: { activityPreset: value } } })
            }
            options={dimensionData?.findDimensionOptions.activity || []}
            value={settingsData?.getMySettings.activityPreset}
            renderInput={(params) => <TextField {...params} label={t("entryDialog.activity")} />}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default DefaultsForm;
