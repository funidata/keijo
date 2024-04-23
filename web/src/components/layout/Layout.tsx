import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import router from "../../router";
import AppBar from "./AppBar";
import ContentContainer from "./ContentContainer";
import useTitle from "./useTitle";

const Layout = () => {
  const { t } = useTranslation();
  const { setTitle } = useTitle();

  useEffect(() => setTitle(t("titles.workdayBrowser")), [t, setTitle]);

  return (
    <>
      <AppBar />
      <ContentContainer>
        <RouterProvider router={router} />
      </ContentContainer>
    </>
  );
};

export default Layout;
