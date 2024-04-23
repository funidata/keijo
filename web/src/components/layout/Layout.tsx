import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GetSessionStatusDocument } from "../../graphql/generated/graphql";
import MissingHeadersAlert from "../MissingHeadersAlert";
import WorkdayBrowser from "../workday-browser/WorkdayBrowser";
import AppBar from "./AppBar";
import ContentContainer from "./ContentContainer";
import useTitle from "./useTitle";

// FIXME: Reimplement this with router. Moved from Next.js.

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
    return <MissingHeadersAlert />;
  }

  return (
    <>
      <AppBar />
      <ContentContainer>
        <WorkdayBrowser />
      </ContentContainer>
    </>
  );
};

export default Layout;
