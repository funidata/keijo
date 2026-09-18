import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  CombinedGraphQLErrors,
  ServerError,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { useNotificationState } from "../components/global-notification/useNotification";

const apiUrl = import.meta.env.VITE_API_URL_OVERRIDE || import.meta.env.VITE_API_URL;

const httpLink = new HttpLink({
  uri: apiUrl,
  headers: import.meta.env.VITE_MOCK_EMPLOYEE_NUMBER
    ? { "x-shib-employeeid": import.meta.env.VITE_MOCK_EMPLOYEE_NUMBER || "" }
    : {},
});

const errorLink = new ErrorLink(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    error.errors.forEach(({ message, path }) =>
      useNotificationState.getState().setNotification({
        message: `Error in GraphQL request "${path}". Message: ${message}`,
        type: "error",
        autoHide: false,
      }),
    );
  } else if (ServerError.is(error)) {
    useNotificationState.getState().setNotification({
      message: `Server error: ${error}`,
      type: "error",
      autoHide: false,
    });
  } else if (error) {
    useNotificationState.getState().setNotification({
      message: `Error: ${error}`,
      type: "error",
      autoHide: false,
    });
  }
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([errorLink, httpLink]),
});
