import { Box } from "@mui/material";
import logoLime from "../assets/keijo-k-lime.svg";
import logoViolet from "../assets/keijo-k-violet.svg";
import useDarkModeDisabled from "../theme/useDarkModeDisabled";

const KeijoLogo = () => {
  const { isDarkMode } = useDarkModeDisabled();

  return (
    <Box sx={{ display: "flex", m: 1 }}>
      <img src={isDarkMode ? logoLime : logoViolet} alt="Keijo logo" width={30} />
    </Box>
  );
};

export default KeijoLogo;
