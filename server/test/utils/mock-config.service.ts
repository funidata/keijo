import { Config } from "../../src/config/config.schema";
import { ConfigService } from "../../src/config/config.service";

const defaultMockConfig: Config = {
  nodeEnv: "production",
  inDev: false,
  port: 3001,
  employeeNumberHeaderKey: "test-shib-header",
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
