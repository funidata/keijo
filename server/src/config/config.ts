const {
  NODE_ENV,
  PORT,
  EMPLOYEE_NUMBER_HEADER_KEY,
  MOCK_EMPLOYEE_NUMBER,
  NETVISOR_CUSTOMER_ID,
  NETVISOR_ORGANIZATION_ID,
  NETVISOR_CUSTOMER_KEY,
  NETVISOR_ORGANIZATION_KEY,
  NETVISOR_PARTNER_ID,
  NETVISOR_CACHE_TTL,
} = process.env;

const config = {
  nodeEnv: NODE_ENV,
  inDev: NODE_ENV === "development",
  port: Number(PORT) || 3001,
  employeeNumberHeaderKey: EMPLOYEE_NUMBER_HEADER_KEY || "X-SHIB-employeeId",
  mockEmployeeNumber: MOCK_EMPLOYEE_NUMBER,
  netvisor: {
    host: "https://isvapi.netvisor.fi",
    sender: "keijo",
    partnerId: NETVISOR_PARTNER_ID,
    lang: "fi",
    customerId: NETVISOR_CUSTOMER_ID,
    organizationId: NETVISOR_ORGANIZATION_ID,
    customerKey: NETVISOR_CUSTOMER_KEY,
    organizationKey: NETVISOR_ORGANIZATION_KEY,
    cacheTtl: NETVISOR_CACHE_TTL || 60,
  },
};

export default config;
