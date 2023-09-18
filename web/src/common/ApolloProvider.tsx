"use client";
import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { ChildrenProps } from "./types";

const makeClient = () => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    headers:
      process.env.NODE_ENV === "production"
        ? {}
        : { "x-shib-employeeid": process.env.NEXT_PUBLIC_MOCK_EMPLOYEE_NUMBER || "" },
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: httpLink,
  });
};

const ApolloProvider = ({ children }: ChildrenProps) => (
  <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
);

export default ApolloProvider;
