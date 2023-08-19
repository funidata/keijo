"use client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { Typography } from "@mui/material";
import { AsdDocument } from "../generated/graphql";

const Home = () => {
  const { data } = useQuery(AsdDocument);
  return <Typography variant="h4">Hello, world!</Typography>;
};

export default Home;
