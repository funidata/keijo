const { NODE_ENV, PORT } = process.env;

const config = {
  inDev: NODE_ENV === "development",
  port: Number(PORT) || 3001,
};

export default config;
