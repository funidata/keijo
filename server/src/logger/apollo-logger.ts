import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextDidEncounterErrors,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
} from "@apollo/server";
import { Plugin } from "@nestjs/apollo";
import { get } from "lodash";
import { ConfigService } from "../config/config.service";
import { Logger } from "./logger";

@Plugin()
export class ApolloLogger implements ApolloServerPlugin {
  constructor(
    private logger: Logger,
    private configService: ConfigService,
  ) {
    logger.setContext(ApolloLogger.name);
  }

  async requestDidStart(
    ctx: GraphQLRequestContext<BaseContext>,
  ): Promise<GraphQLRequestListener<BaseContext>> {
    const { query, variables } = ctx.request;
    this.logger.audit({
      description: "Request started.",
      query,
      variables,
      employeeNumber: this.getEmployeeNumber(ctx),
    });

    return {
      willSendResponse: async (ctx: GraphQLRequestContextWillSendResponse<BaseContext>) => {
        this.logger.debug(ctx.response.body);
      },
      didEncounterErrors: async (ctx: GraphQLRequestContextDidEncounterErrors<BaseContext>) => {
        const { errors, request } = ctx;
        const { query, variables } = request;
        const description = "Encountered an error while processing a GraphQL request.";
        const errorLog = { description, errors, query };

        this.logger.error(errorLog);

        this.logger.audit({
          ...errorLog,
          variables,
          employeeNumber: this.getEmployeeNumber(ctx),
        });
      },
    };
  }

  private getEmployeeNumber(ctx: GraphQLRequestContext<BaseContext>): string {
    return get(ctx.request.http?.headers, this.configService.config.employeeNumberHeaderKey, "");
  }
}
