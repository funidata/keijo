import BuildIcon from "@mui/icons-material/Build";
import LayersIcon from "@mui/icons-material/Layers";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import { Chip, ChipProps, useTheme } from "@mui/material";

const icons = {
  product: LayersIcon,
  activity: BuildIcon,
  issue: LocalOfferIcon,
  client: PersonIcon,
};

type DimensionChipProps = ChipProps & {
  dimension: "activity" | "issue" | "client" | "product";
};

const DimensionChip = ({ dimension, sx, ...props }: DimensionChipProps) => {
  const { palette } = useTheme();
  const Icon = icons[dimension];

  const iconColors =
    palette.mode === "dark"
      ? {
          product: palette.primary.main,
          activity: palette.info.light,
          issue: palette.success.main,
          client: palette.secondary.main,
        }
      : {
          product: palette.warning.main,
          activity: palette.info.main,
          issue: palette.success.main,
          client: palette.secondary.dark,
        };

  const color = iconColors[dimension];

  return (
    <Chip
      icon={<Icon fontSize="small" color="inherit" />}
      variant="outlined"
      sx={{ borderRadius: 1, color, borderColor: color, ...sx }}
      {...props}
    />
  );
};

export default DimensionChip;
