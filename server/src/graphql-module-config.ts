import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

const graphQlModuleConfig: ApolloDriverConfig = {
  autoSchemaFile: true,
  driver: ApolloDriver,
  playground: false,
};

export default graphQlModuleConfig;
