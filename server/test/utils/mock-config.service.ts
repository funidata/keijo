import { Config } from "../../src/config/config.schema";
import { ConfigService } from "../../src/config/config.service";

export const defaultMockConfig: Config = {
  nodeEnv: "production",
  inDev: false,
  port: 3001,
  employeeNumberHeaderKey: "test-shib-header",
  logLevel: "log",
  enableJsonLogs: false,
  enableAuditLogs: true,
  netvisor: {
    host: "https://mock-netvisor.url.com",
    sender: "keijo",
    partnerId: "test-partner-id",
    lang: "fi",
    customerId: "test-customer-id",
    organizationId: "test-org-id",
    customerKey: "test-customer-key",
    organizationKey: "test-org-key",
    cacheTtl: 60,
  },
  database: {
    username: "",
    password: "",
    name: "",
    host: "",
    port: 0,
    ssl: false,
  },
  jira: {
    tokenUrl: "test",
    clientId: "test",
    clientSecret: "test",
    authorizationUrl: "test",
    callbackUrl: "test",
    callbackRedirectUrl: "test",
    scopes: "test",
    cloudId: "test",
  },
  session: {
    name: "test",
    secret: "test",
  },
  trustProxyIps: false,
};

const mockConfigProvider = (override: Partial<Config> = {}) => ({
  provide: ConfigService,
  useFactory: () => ({
    config: {
      ...defaultMockConfig,
      ...override,
    },
  }),
});

export default mockConfigProvider;
