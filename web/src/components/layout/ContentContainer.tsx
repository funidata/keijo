import { Box, Container } from "@mui/material";
import { ChildrenProps } from "../../common/types";
import Footer from "./Footer";

const ContentContainer = ({ children }: ChildrenProps) => (
  <>
    <Container>{children}</Container>
    <Box component="footer" sx={{ display: "flex", justifyContent: "center", mt: 8, mb: 3 }}>
      <Footer />
    </Box>
  </>
);

export default ContentContainer;
