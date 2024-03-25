import BuildIcon from "@mui/icons-material/Build";
import LayersIcon from "@mui/icons-material/Layers";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import { Chip, ChipProps, SvgIconProps } from "@mui/material";

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
  const Icon = icons[dimension];
  const iconCommonProps: SvgIconProps = { fontSize: "small" };

  return (
    <Chip
      icon={<Icon {...iconCommonProps} />}
      variant="outlined"
      sx={{ borderRadius: 1, ...sx }}
      {...props}
    />
  );
};

export default DimensionChip;
