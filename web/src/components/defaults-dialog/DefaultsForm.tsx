import { useLazyQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { GetMySettingsDocument } from "../../graphql/generated/graphql";
import DimensionComboBox from "../entry-dialog/DimensionComboBox";
import useDefaultEntryValues from "../user-preferences/useDefaultEntryValues";

type DefaultsFormSchema = {
  activity: string;
  product: string;
};

const DefaultsForm = () => {
  const { t } = useTranslation();

  const [getMySettings] = useLazyQuery(GetMySettingsDocument);

  const getDefaultValues = async (): Promise<DefaultsFormSchema> => {
    const { data: settingsData } = await getMySettings();

    return {
      product: settingsData?.getMySettings.productPreset || "",
      activity: settingsData?.getMySettings.activityPreset || "",
    };
  };

  const { setDefaultValues } = useDefaultEntryValues();
  const form = useForm<DefaultsFormSchema>({
    defaultValues: getDefaultValues,
  });

  const { watch } = form;

  useEffect(() => {
    const sub = watch((value) => setDefaultValues(value));
    return () => sub.unsubscribe();
  }, [setDefaultValues, watch]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          <DimensionComboBox form={form} name="product" title={t("entryDialog.product")} />
          <DimensionComboBox form={form} name="activity" title={t("entryDialog.activity")} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DefaultsForm;
