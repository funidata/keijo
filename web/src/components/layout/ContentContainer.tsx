import { Box, Container, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ChildrenProps } from "../../common/types";

const ContentContainer = ({ children }: ChildrenProps) => (
  <>
    <Container>{children}</Container>
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8, mb: 3 }}>
      <Typography sx={{ color: grey[400], fontSize: "0.8rem", wordSpacing: 3, fontWeight: 100 }}>
        Made with ❤️ by 🦊
      </Typography>
    </Box>
  </>
);

export default ContentContainer;
