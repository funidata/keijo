import { AddWorkdayEntryDocument, FindWorkdaysDocument } from "../../../graphql/generated/graphql";
import { Button } from "@mui/material";
import { useMutation } from "@apollo/client/react";
import { useTranslation } from "react-i18next";
import { useNotification } from "../../global-notification/useNotification";
import { Dayjs } from "dayjs";

type AddZeroEntryButtonProps = {
  date: Dayjs;
};

const AddZeroEntryButton = ({ date }: AddZeroEntryButtonProps) => {
  const { t } = useTranslation();
  const { showSuccessNotification } = useNotification();

  const [addWorkdayEntryMutation, { loading }] = useMutation(AddWorkdayEntryDocument, {
    refetchQueries: [FindWorkdaysDocument],
    onCompleted: () => {
      showSuccessNotification(t("notifications.addEntry.success"));
    },
  });

  const addWorkday = async () => {
    await addWorkdayEntryMutation({
      variables: {
        entry: {
          date: date.format("YYYY-MM-DD"),
          duration: 0,
          description: "",
          product: null,
          activity: null,
          issue: null,
          client: null,
        },
      },
    });
  };
  return (
    <Button
      loading={loading}
      onClick={addWorkday}
      type="submit"
      variant="text"
      size="medium"
      color="inherit"
    >
      {t("entryTable.addZeroEntry")}
    </Button>
  );
};

export default AddZeroEntryButton;
