"use client";
import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { ChildrenProps } from "./types";

const makeClient = () => {
  // FIXME: Get URL from env.
  const httpLink = new HttpLink({ uri: "http://localhost:3001/graphql" });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: httpLink,
  });
};

const Apollo = ({ children }: ChildrenProps) => (
  <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
);

export default Apollo;
