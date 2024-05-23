import { IconButton, IconButtonProps, Tooltip, TooltipProps } from "@mui/material";

type LabelledIconButtonProps = IconButtonProps & {
  /**
   * Text to show in tooltip.
   */
  label: string;
  tooltipProps?: Partial<TooltipProps>;
};

/**
 * Icon button labelled with tooltip for better UX.
 */
const LabelledIconButton = ({
  label,
  tooltipProps,
  ...iconButtonProps
}: LabelledIconButtonProps) => (
  <Tooltip title={label} arrow placement="bottom" {...tooltipProps}>
    <IconButton size="large" color="inherit" aria-label={label} {...iconButtonProps} />
  </Tooltip>
);

export default LabelledIconButton;
