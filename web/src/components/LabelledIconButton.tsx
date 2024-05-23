import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

type LabelledIconButtonProps = IconButtonProps & {
  /**
   * Text to show in tooltip.
   */
  label: string;
};

/**
 * Icon button labelled with tooltip for better UX.
 */
const LabelledIconButton = ({ label, ...iconButtonProps }: LabelledIconButtonProps) => (
  <Tooltip title={label} arrow placement="bottom">
    <IconButton size="large" color="inherit" aria-label={label} {...iconButtonProps} />
  </Tooltip>
);

export default LabelledIconButton;
