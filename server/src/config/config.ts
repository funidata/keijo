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
    host: "https://isvapi.netvisor.fi",
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
};

export default config;
