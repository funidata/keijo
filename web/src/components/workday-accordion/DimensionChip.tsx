import { Chip, ChipProps } from "@mui/material";

const DimensionChip = (props: ChipProps) => (
  <Chip variant="outlined" sx={{ borderRadius: 1 }} {...props} />
);

export default DimensionChip;
