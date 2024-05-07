import { AddWorkdayEntryDocument, FindWorkdaysDocument } from "../../../graphql/generated/graphql";
import { LoadingButton } from "@mui/lab";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useNotification } from "../../global-notification/useNotification";
import { Dayjs } from "dayjs";

type ZeroEntryButtonProps = {
  date: Dayjs;
};

const ZeroEntryButton = ({ date }: ZeroEntryButtonProps) => {
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
    <LoadingButton
      loading={loading}
      onClick={addWorkday}
      type="submit"
      variant="text"
      size="medium"
    >
      {t("entryTable.addZeroEntry")}
    </LoadingButton>
  );
};

export default ZeroEntryButton;
