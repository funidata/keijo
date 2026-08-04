import { useMutation } from "@apollo/client/react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import LabelledIconButton from "../LabelledIconButton";
import { useNotification } from "../global-notification/useNotification";
import {
  GetMySettingsDocument,
  RemoveEntryTemplateDocument,
} from "../../graphql/generated/graphql";

type DeleteTemplateButtonProps = {
  templateKey: string;
};

const DeleteTemplateButton = ({ templateKey }: DeleteTemplateButtonProps) => {
  const { showSuccessNotification } = useNotification();
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<Element | null>(null);
  const [removeEntryTemplate] = useMutation(RemoveEntryTemplateDocument, {
    refetchQueries: [GetMySettingsDocument],
    awaitRefetchQueries: true,
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
    await removeEntryTemplate({
      variables: { templateKey: { key: templateKey } },
    });
    onClose();
  };

  return (
    <>
      <LabelledIconButton
        label={t("controls.deleteEntry")}
        onClick={onOpen}
        color="error"
        size="medium"
      >
        <DeleteIcon />
      </LabelledIconButton>

      <Menu open={!!anchor} anchorEl={anchor} onClose={onClose}>
        <MenuItem onClick={onConfirm}>{t("controls.confirmDelete")}</MenuItem>
      </Menu>
    </>
  );
};

export default DeleteTemplateButton;
