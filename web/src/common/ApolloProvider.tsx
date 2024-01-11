"use client";
import { HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { useNotificationState } from "../components/global-notification/useNotification";
import { ChildrenProps } from "./types";

const makeClient = () => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    headers:
      process.env.NODE_ENV === "production"
        ? {}
        : { "x-shib-employeeid": process.env.NEXT_PUBLIC_MOCK_EMPLOYEE_NUMBER || "" },
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

    if (networkError) {
      useNotificationState.getState().setNotification({
        message: `GraphQL network error: ${networkError}`,
        type: "error",
        autoHide: false,
      });
    }
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: from([errorLink, httpLink]),
  });
};

const ApolloProvider = ({ children }: ChildrenProps) => (
  <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
);

export default ApolloProvider;
