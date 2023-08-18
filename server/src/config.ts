import { join } from "path";

const { NODE_ENV, PORT } = process.env;

const config = {
  inDev: NODE_ENV === "development",
  port: Number(PORT) || 3001,
  clientPath: join(__dirname, "..", "public"),
};

export default config;
