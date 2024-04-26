import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
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
        <Outlet />
      </ContentContainer>
    </>
  );
};

export default Layout;
