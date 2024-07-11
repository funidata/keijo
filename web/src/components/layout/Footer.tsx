import { Box, Typography } from "@mui/material";

const Footer = () => (
  <Box component="span" sx={{ color: (theme) => theme.palette.text.secondary }}>
    <Typography component="span" variant="overline">
      Keijo {import.meta.env.APP_VERSION}
    </Typography>
    <Typography component="span" variant="caption">
      {" "}
      &mdash; Made with ❤️ by 🦊
    </Typography>
  </Box>
);

export default Footer;
