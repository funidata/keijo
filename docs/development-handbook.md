# Development Handbook

## Requirements

- Docker (a fairly recent version will do)
- Node.js (originally `>= 18.17.1` but check the `.nvmrc` files for actual)
- macOS or Linux (Windows is not supported and is likely to not work with the Docker setup)

## Getting Started

1. Clone this repository.
2. Make sure your system satisfies [the requirements](#requirements) and Docker daemon is running.
3. Create `.env` file in repository root and populate it as detailed [here](./configuration.md).
4. In repository root, run `npm run init` to install Node modules locally. (While the Docker containers don't need these to run, in practice a lot of development tooling depends on Node modules being installed locally.)
5. Run `npm start` to bring up the development server containers.
6. Make sure your IDE is set up to use `eslint` and `prettier` from local `package.json` definitions and there are no global overrides in effect.

## Command Reference

Run commands in repository root.

#### Start Dev Env

Starts to background and then attaches to logs. You can detach from log output with Ctrl+C and the dev env will keep running in the background.

```bash
npm start
```

#### Stop Dev Env

```bash
npm stop
```

#### View Logs

```bash
npm run logs
```

#### Generate GraphQL Types

Run this command in the `web/` directory. Dev env must be running as the code generator sources the GraphQL schema dynamically from backend. The result is formatted with Prettier.

```bash
npm run generate
```
