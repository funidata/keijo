import { Chip, ChipProps } from "@mui/material";

const StatusChip = (props: ChipProps) => (
  <Chip
    variant="filled"
    sx={{
      height: "100%",
      borderRadius: 0,
      pl: 1,
      pr: { xs: 3, md: 0 },
      textTransform: "uppercase",
      ".MuiChip-label": { display: { xs: "none", md: "block" } },
      ...props.sx,
    }}
    {...props}
  />
);

export default StatusChip;
