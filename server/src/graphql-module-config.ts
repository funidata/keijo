import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

const plugins: NonNullable<ApolloDriverConfig["plugins"]> = [];

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins.push(ApolloServerPluginLandingPageLocalDefault({ includeCookies: true }) as any);
}

const graphQlModuleConfig: ApolloDriverConfig = {
  autoSchemaFile: true,
  driver: ApolloDriver,
  graphiql: true,
  playground: false,
  plugins,
};

export default graphQlModuleConfig;
