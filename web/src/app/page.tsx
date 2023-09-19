"use client";
import { useQuery } from "@apollo/client";
import MissingHeadersAlert from "../components/MissingHeadersAlert";
import WorkdayBrowser from "../components/WorkdayBrowser";
import { GetSessionStatusDocument } from "../graphql/generated/graphql";

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
