import { ApolloClient, HttpLink, InMemoryCache, ServerError, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { useNotificationState } from "../components/global-notification/useNotification";

const apiUrl = import.meta.env.VITE_API_URL_OVERRIDE || import.meta.env.VITE_API_URL;

const httpLink = new HttpLink({
  uri: apiUrl,
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
      }),
    );

  // Server will respond with 302 redirect if IDP session has expired. As Apollo will not
  // follow this redirect to initialize a new session, we reload the whole application.
  // This (combined with polling) prevents situations where the user has left Keijo idling until
  // the session expires and the next operation they try would fail.
  if (networkError && Object.keys(networkError as object).includes("statusCode")) {
    const { statusCode } = networkError as ServerError;
    if (statusCode === 302) {
      location.reload();
    }
  }

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
