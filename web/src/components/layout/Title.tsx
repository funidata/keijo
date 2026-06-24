import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import useTitle from "./useTitle";
import { useTranslation } from "react-i18next";

const Title = () => {
  const { title } = useTitle();
  const { t } = useTranslation();

  useEffect(() => {
    window.document.title = title ? `${title} | Keijo` : "Keijo";
  }, [title]);

  return (
    <Typography
      component="h1"
      variant="h6"
      sx={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis" }}
    >
      {title}
      {import.meta.env.DEV && " - " + t("environment.development").toUpperCase()}
    </Typography>
  );
};

export default Title;
