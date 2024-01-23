import { useMutation } from "@apollo/client";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Dayjs } from "dayjs";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { FindWorkdaysDocument, RemoveWorkdayEntryDocument } from "../../graphql/generated/graphql";
import { useNotification } from "../global-notification/useNotification";

type DeleteEntryButtonProps = {
  entryKey: string;
  date: Dayjs;
};

const DeleteEntryButton = ({ entryKey, date }: DeleteEntryButtonProps) => {
  const { showSuccessNotification } = useNotification();
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<Element | null>(null);
  const [removeWorkdayEntry] = useMutation(RemoveWorkdayEntryDocument, {
    refetchQueries: [FindWorkdaysDocument],
    onCompleted: () => {
      showSuccessNotification(t("notifications.deleteEntry.success"));
    },
  });

  const onOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.target as Element);
  };

  const onClose = () => {
    setAnchor(null);
  };

  const onConfirm = async () => {
    removeWorkdayEntry({
      variables: { entry: { key: entryKey, date: date.format("YYYY-MM-DD") } },
    });
    onClose();
  };

  return (
    <>
      <IconButton
        aria-label={t("controls.deleteEntry")}
        onClick={onOpen}
        color="error"
        size="small"
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      <Menu open={!!anchor} anchorEl={anchor} onClose={onClose}>
        <MenuItem onClick={onConfirm}>{t("controls.confirm")}</MenuItem>
      </Menu>
    </>
  );
};

export default DeleteEntryButton;
