import { useQuery } from "@apollo/client";
import { Outlet } from "react-router-dom";
import { GetSessionStatusDocument } from "../../graphql/generated/graphql";
import { Exception } from "./Exception";

/**
 * Check that headers include employee number which is required to use Keijo at all.
 */
const HeaderGuard = () => {
  const { data } = useQuery(GetSessionStatusDocument);

  if (!data) {
    return null;
  }

  if (data && !data.getSessionStatus.employeeNumber) {
    throw new Exception("errors.missingEmployeeNumber");
  }

  return <Outlet />;
};

export default HeaderGuard;
