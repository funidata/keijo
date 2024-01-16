import { useQuery } from "@apollo/client";
import MissingHeadersAlert from "./components/MissingHeadersAlert";
import WorkdayBrowser from "./components/workday-browser/WorkdayBrowser";
import { GetSessionStatusDocument } from "./graphql/generated/graphql";

// FIXME: Reimplement this with router. Moved from Next.js.

const Home = () => {
  const { data } = useQuery(GetSessionStatusDocument);

  if (!data) {
    return null;
  }

  if (!data.getSessionStatus.employeeNumber) {
    return <MissingHeadersAlert />;
  }

  return <WorkdayBrowser />;
};

export default Home;
