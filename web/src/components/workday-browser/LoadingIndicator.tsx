import { Box, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const LoadingIndicator = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 200,
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="h6" fontStyle="italic">
        {t("entryTable.loading")}
      </Typography>
    </Box>
  );
};

export default LoadingIndicator;
