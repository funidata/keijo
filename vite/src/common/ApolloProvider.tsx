import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { useNotificationState } from "../components/global-notification/useNotification";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL,
  headers:
    import.meta.env.NODE_ENV === "production"
      ? {}
      : {
          "x-shib-employeeid": import.meta.env.VITE_MOCK_EMPLOYEE_NUMBER || "",
        },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, path }) =>
      useNotificationState.getState().setNotification({
        message: `Error in GraphQL request "${path}". Message: ${message}`,
        type: "error",
        autoHide: false,
      })
    );

  if (networkError) {
    useNotificationState.getState().setNotification({
      message: `GraphQL network error: ${networkError}`,
      type: "error",
      autoHide: false,
    });
  }
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, httpLink]),
});
