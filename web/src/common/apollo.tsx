"use client";
import { HttpLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { ChildrenProps } from "./types";

const makeClient = () => {
  const httpLink = new HttpLink({ uri: process.env.NEXT_PUBLIC_API_URL });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: httpLink,
  });
};

const Apollo = ({ children }: ChildrenProps) => (
  <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>
);

export default Apollo;
