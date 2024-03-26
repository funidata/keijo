import { Box } from "@mui/material";
import logoLime from "../assets/keijo-k-lime.svg";
import logoViolet from "../assets/keijo-k-violet.svg";
import useDarkMode from "../theme/useDarkMode";

const KeijoLogo = () => {
  const { darkMode } = useDarkMode();

  return (
    <Box sx={{ display: "flex", m: 1 }}>
      <img src={darkMode ? logoLime : logoViolet} alt="Keijo logo" width={30} />
    </Box>
  );
};

export default KeijoLogo;
