const {
  NODE_ENV,
  PORT,
  NETVISOR_CUSTOMER_ID,
  NETVISOR_ORGANIZATION_ID,
  NETVISOR_CUSTOMER_KEY,
  NETVISOR_ORGANIZATION_KEY,
  NETVISOR_PARTNER_ID,
} = process.env;

const config = {
  nodeEnv: NODE_ENV,
  inDev: NODE_ENV === "development",
  port: Number(PORT) || 3001,
  netvisor: {
    host: "https://isvapi.netvisor.fi",
    sender: "keijo",
    partnerId: NETVISOR_PARTNER_ID,
    lang: "fi",
    customerId: NETVISOR_CUSTOMER_ID,
    organizationId: NETVISOR_ORGANIZATION_ID,
    customerKey: NETVISOR_CUSTOMER_KEY,
    organizationKey: NETVISOR_ORGANIZATION_KEY,
  },
};

export default config;
