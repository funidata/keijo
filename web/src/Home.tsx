import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import MissingHeadersAlert from "./components/MissingHeadersAlert";
import useTitle from "./components/layout/useTitle";
import WorkdayBrowser from "./components/workday-browser/WorkdayBrowser";
import { GetSessionStatusDocument } from "./graphql/generated/graphql";

// FIXME: Reimplement this with router. Moved from Next.js.

const Home = () => {
  const { t } = useTranslation();
  const { setTitle } = useTitle();
  const { data } = useQuery(GetSessionStatusDocument);

  useEffect(() => setTitle(t("titles.workdayBrowser")), [t, setTitle]);

  if (!data) {
    return null;
  }

  if (!data.getSessionStatus.employeeNumber) {
    return <MissingHeadersAlert />;
  }

  return <WorkdayBrowser />;
};

export default Home;
