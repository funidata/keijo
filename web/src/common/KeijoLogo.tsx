import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import logoLime from "../assets/keijo-k-lime.svg";
import logoViolet from "../assets/keijo-k-violet.svg";
import useDarkMode from "../theme/useDarkMode";

const KeijoLogo = () => {
  const { darkMode } = useDarkMode();

  return (
    <Box sx={{ display: "flex", m: 1, "a img": { display: "block" } }}>
      <Link to={"/"}>
        <img src={darkMode ? logoLime : logoViolet} alt="Keijo logo" width={30} />
      </Link>
    </Box>
  );
};

export default KeijoLogo;
