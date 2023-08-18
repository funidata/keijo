import { join } from "path";

const {
  NODE_ENV,
  PORT,
  NETVISOR_CUSTOMER_ID,
  NETVISOR_ORGANIZATION_ID,
  NETVISOR_CUSTOMER_KEY,
  NETVISOR_ORGANIZATION_KEY,
} = process.env;

const config = {
  inDev: NODE_ENV === "development",
  port: Number(PORT) || 3001,
  clientPath: join(__dirname, "..", "public"),
  netvisor: {
    host: "https://isvapi.netvisor.fi",
    sender: "keijo",
    partnerId: "Netvisor TestPartner",
    lang: "fi",
    customerId: NETVISOR_CUSTOMER_ID,
    organizationId: NETVISOR_ORGANIZATION_ID,
    customerKey: NETVISOR_CUSTOMER_KEY,
    organizationKey: NETVISOR_ORGANIZATION_KEY,
  },
};

export default config;
