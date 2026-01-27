import { DevToolsModule } from "./dev-tools.module";

describe("DevToolsModule", () => {
  let module: DevToolsModule;

  beforeEach(() => {
    module = new DevToolsModule();
  });

  it("Mounts in development mode", () => {
    process.env.NODE_ENV = "development";
    process.env.CI = "false";
    process.env.DEV_TOOLS = "true";
    expect(module.onModuleInit).not.toThrow();
  });

  it("Mounts in production mode in CI", () => {
    process.env.NODE_ENV = "production";
    process.env.CI = "true";
    process.env.DEV_TOOLS = "true";
    expect(module.onModuleInit).not.toThrow();
  });

  it("Does not mount in production mode", () => {
    process.env.NODE_ENV = "production";
    process.env.CI = "false";
    process.env.DEV_TOOLS = "true";
    expect(module.onModuleInit).toThrow();
  });

  it("Does not mount if DEV_TOOLS is falsy", () => {
    process.env.NODE_ENV = "development";
    process.env.CI = "false";
    process.env.DEV_TOOLS = "false";
    expect(module.onModuleInit).toThrow();
  });
});
