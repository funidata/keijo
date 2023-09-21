import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextDidEncounterErrors,
  GraphQLRequestListener,
} from "@apollo/server";
import { Plugin } from "@nestjs/apollo";
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
    const { operationName } = ctx.request;

    this.logger.audit({
      message: "GraphQL request started.",
      operation: operationName,
      ...this.getOptionalEmployeeNumber(ctx),
    });

    return {
      didEncounterErrors: async (ctx: GraphQLRequestContextDidEncounterErrors<BaseContext>) => {
        const {
          errors,
          request: { operationName },
        } = ctx;
        const message = "Encountered an error while processing a GraphQL request.";

        this.logger.error(message);
        this.logger.audit({
          message,
          operation: operationName,
          errors: errors.map((err) => err.message),
          ...this.getOptionalEmployeeNumber(ctx),
        });
      },
    };
  }

  private getOptionalEmployeeNumber(ctx: GraphQLRequestContext<BaseContext>): {
    employeeNumber?: number;
  } {
    const employeeNumber = Number(
      ctx.request.http?.headers.get(
        this.configService.config.employeeNumberHeaderKey.toLowerCase(),
      ),
    );
    return employeeNumber ? { employeeNumber } : {};
  }
}
