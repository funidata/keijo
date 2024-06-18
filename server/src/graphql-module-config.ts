import { ApolloServerPlugin } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: ApolloServerPlugin<any>[] = [];

if (process.env.NODE_ENV !== "production") {
  plugins.push(ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }));
}

const graphQlModuleConfig: ApolloDriverConfig = {
  autoSchemaFile: true,
  driver: ApolloDriver,
  playground: false,
  plugins,
};

export default graphQlModuleConfig;
