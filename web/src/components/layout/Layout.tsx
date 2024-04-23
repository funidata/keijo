import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import { GetSessionStatusDocument } from "../../graphql/generated/graphql";
import router from "../../router";
import MissingHeadersAlert from "../MissingHeadersAlert";
import AppBar from "./AppBar";
import ContentContainer from "./ContentContainer";
import useTitle from "./useTitle";

const Layout = () => {
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const { data } = useQuery(GetSessionStatusDocument);

  useEffect(() => setTitle(t("titles.workdayBrowser")), [t, setTitle]);

  if (!data) {
    return null;
  }

  // FIXME: Use router error boundary instead of this?
  if (!data.getSessionStatus.employeeNumber) {
    // FIXME: This is no longer wrapped in layout and just shows up as the only thing on page.
    return <MissingHeadersAlert />;
  }

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
