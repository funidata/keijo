import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { Chip, ChipProps } from "@mui/material";
import { useTranslation } from "react-i18next";

const PaidChip = (props: ChipProps) => {
  const { t } = useTranslation();

  return (
    <Chip
      variant="filled"
      sx={{
        height: "100%",
        borderRadius: 0,
        pl: 1,
        pr: { xs: 3, md: 0 },
        textTransform: "uppercase",
        ".MuiChip-label": { display: { xs: "none", md: "block" } },
      }}
      label={t("entryTable.paid")}
      icon={<PaidOutlinedIcon fontSize="small" />}
      color="info"
      {...props}
    />
  );
};

export default PaidChip;
