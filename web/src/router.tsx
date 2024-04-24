import { createBrowserRouter } from "react-router-dom";
import Error from "./components/error/Error";
import HeaderGuard from "./components/error/HeaderGuard";
import WorkdayBrowser from "./components/workday-browser/WorkdayBrowser";
import WorkdayBrowserRedirect from "./components/workday-browser/WorkdayBrowserRedirect";

const router = createBrowserRouter([
  {
    /**
     * Guard against missing headers globally.
     *
     * This is a fundamental error that prevents using Keijo completely. It cannot be recovered
     * from without admin help. The global guard enables us to use react-router's error handling
     * as otherwise we would end up throwing from Apollo client outside of this error handling,
     * and would then need to have a separate handling for that case.
     */
    path: "/",
    element: <HeaderGuard />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <WorkdayBrowserRedirect />,
      },
      {
        path: "/entries",
        element: <WorkdayBrowserRedirect />,
      },
      {
        path: "entries/:browsingMode?/:from?/:to?",
        element: <WorkdayBrowser />,
        errorElement: <Error />,
      },
    ],
  },
]);

export default router;
