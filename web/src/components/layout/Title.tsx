import { Typography } from "@mui/material";
import { useEffect } from "react";
import useTitle from "./useTitle";

const Title = () => {
  const { title } = useTitle();

  useEffect(() => {
    window.document.title = title ? `${title} | Keijo` : "Keijo";
  }, [title]);

  return (
    <Typography variant="h6" sx={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
      {title}
    </Typography>
  );
};

export default Title;
