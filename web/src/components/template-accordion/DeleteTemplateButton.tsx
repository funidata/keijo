import { useMutation } from "@apollo/client/react";
import { Menu, MenuItem, Button } from "@mui/material";
import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
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
      showSuccessNotification(t("notifications.deleteTemplate.success"));
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
      <Button
        onClick={onOpen}
        size="medium"
        color="error"
      >
        {t("controls.deleteEntryTemplate")}
      </Button>

      <Menu open={!!anchor} anchorEl={anchor} onClose={onClose}>
        <MenuItem onClick={onConfirm}>{t("controls.confirmDelete")}</MenuItem>
      </Menu>
    </>
  );
};

export default DeleteTemplateButton;
