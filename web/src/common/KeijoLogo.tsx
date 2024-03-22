import { Box } from "@mui/material";
import { useDarkMode } from "usehooks-ts";
import logoLime from "../assets/keijo-k-lime.svg";
import logoViolet from "../assets/keijo-k-violet.svg";

const KeijoLogo = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <Box sx={{ display: "flex", m: 1 }}>
      <img src={isDarkMode ? logoLime : logoViolet} alt="Keijo logo" width={30} />
    </Box>
  );
};

export default KeijoLogo;
