import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DimensionComboBox from "./DimensionComboBox";
import { EntryFormSchema } from "./useEntryForm";
import useDefaultEntryValues from "../user-preferences/useDefaultEntryValues";
import { useEffect } from "react";

const DefaultsForm = () => {
  const { t } = useTranslation();
  const { defaultEntryValues, setDefaultValues } = useDefaultEntryValues();
  const form = useForm<Partial<EntryFormSchema>>({
    defaultValues: defaultEntryValues || {
      product: "",
      activity: "",
    },
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
