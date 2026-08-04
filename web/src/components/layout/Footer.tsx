import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Footer = () => (
  <Stack
    direction="column"
    sx={{
      color: (theme) =>
        theme.palette.mode === "dark" ? theme.palette.grey[400] : theme.palette.grey[900],
      wordSpacing: 2,
    }}
  >
    <Typography component="span" variant="overline" align="center">
      Keijo {import.meta.env.APP_VERSION}
    </Typography>
    <Typography component="span" variant="caption" align="center">
      Made with ❤️ by 🦊 &mdash; Maintained by ❄️🦊
    </Typography>
  </Stack>
);

export default Footer;
