import { Box, Container, Typography } from "@mui/material";
import { ChildrenProps } from "../../common/types";
import Footer from "./Footer";

const ContentContainer = ({ children }: ChildrenProps) => (
  <>
    <Container>{children}</Container>
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8, mb: 3 }}>
      <Typography
        sx={{
          color: (theme) =>
            theme.palette.mode === "dark" ? theme.palette.grey[400] : theme.palette.grey[900],
          fontSize: "0.8rem",
          wordSpacing: 2,
          fontWeight: 100,
        }}
      >
        <Footer />
      </Typography>
    </Box>
  </>
);

export default ContentContainer;
