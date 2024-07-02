const {
  NODE_ENV,
  PORT,
  EMPLOYEE_NUMBER_HEADER_KEY,
  LOG_LEVEL,
  ENABLE_JSON_LOGS,
  ENABLE_AUDIT_LOGS,
  NETVISOR_CUSTOMER_ID,
  NETVISOR_ORGANIZATION_ID,
  NETVISOR_CUSTOMER_KEY,
  NETVISOR_ORGANIZATION_KEY,
  NETVISOR_PARTNER_ID,
  NETVISOR_CACHE_TTL,
  NETVISOR_ENTRY_RATIONUMBER,
  NETVISOR_API_URL,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_SSL_MODE,
  ATLASSIAN_TOKEN_URL,
  ATLASSIAN_CLIENT_ID,
  ATLASSIAN_CLIENT_SECRET,
  ATLASSIAN_AUTHORIZATION_URL,
  CALLBACK_URL,
  CALLBACK_REDIRECT_URL,
  SCOPES,
  SESSION_NAME,
  SESSION_SECRET,
  TRUST_PROXY_IPS,
} = process.env;

const config = {
  nodeEnv: NODE_ENV,
  inDev: NODE_ENV?.toLowerCase() === "development",
  port: Number(PORT) || 3001,
  employeeNumberHeaderKey: EMPLOYEE_NUMBER_HEADER_KEY || "X-SHIB-employeeId",
  logLevel: LOG_LEVEL?.toLowerCase() || "log",
  enableJsonLogs: ENABLE_JSON_LOGS?.toLowerCase() === "true",
  enableAuditLogs: ENABLE_AUDIT_LOGS?.toLowerCase() === "true",
  netvisor: {
    host: NETVISOR_API_URL || "https://isvapi.netvisor.fi",
    sender: "keijo",
    partnerId: NETVISOR_PARTNER_ID,
    lang: "fi",
    customerId: NETVISOR_CUSTOMER_ID,
    organizationId: NETVISOR_ORGANIZATION_ID,
    customerKey: NETVISOR_CUSTOMER_KEY,
    organizationKey: NETVISOR_ORGANIZATION_KEY,
    cacheTtl: Number(NETVISOR_CACHE_TTL) || 60,
    ratioNumber: Number(NETVISOR_ENTRY_RATIONUMBER) || 100,
  },
  database: {
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    name: DATABASE_NAME,
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    ssl: DATABASE_SSL_MODE === "true",
  },
  jira: {
    tokenUrl: ATLASSIAN_TOKEN_URL || "https://auth.atlassian.com/oauth/token",
    clientId: ATLASSIAN_CLIENT_ID,
    clientSecret: ATLASSIAN_CLIENT_SECRET,
    authorizationUrl: ATLASSIAN_AUTHORIZATION_URL || "https://auth.atlassian.com/authorize",
    callbackUrl: CALLBACK_URL || "/jira/callback",
    callbackRedirectUrl: CALLBACK_REDIRECT_URL || "/",
    scopes: SCOPES || "read:jira-work offline_access",
  },
  session: {
    name: SESSION_NAME || "sessionId",
    secret: SESSION_SECRET,
  },
  trustProxyIps: TRUST_PROXY_IPS || false,
};

export default config;
