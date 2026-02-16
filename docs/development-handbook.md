# Development Handbook

## Requirements

- Docker (a fairly recent version will do)
- Node.js (originally `>= 18.17.1` but check the `.nvmrc` files for actual)
- macOS or Linux (Windows is not supported and is likely to not work with the Docker setup)

## Getting Started

1. Clone this repository.
2. Make sure your system satisfies [the requirements](#requirements) and Docker daemon is running.
3. Create `.env` file in repository root and populate it as detailed [here](./configuration.md).
4. In repository root, run `npm ci` to install Node modules locally. Post-install script will take care of installing the sub-projects' dependencies, too. (While the Docker containers don't need these to run, in practice a lot of development tooling depends on Node modules being installed locally.)
5. Run `npm start` to bring up the development server containers.
   - Dev env: [localhost:3000](http://localhost:3000)
   - Apollo Sandbox: [localhost:3001/graphql](http://localhost:3001/graphql)
6. Make sure your IDE is set up to use `eslint` and `prettier` from local `package.json` definitions and there are no global overrides in effect.

## Command Reference

Run commands in repository root.

#### Start Dev Env

Starts the necessary processes to the background and then attaches to logs. You can detach from log output with Ctrl+C and the dev env will keep running in the background.

Once up, the development envinronment is accessible at [localhost:3000](http://localhost:3000) and Apollo Sandbox at [localhost:3001/graphql](http://localhost:3001/graphql).

```bash
npm start
```

#### Stop Dev Env

```bash
npm stop
```

#### Build Docker Services

Rebuilding is necessary, e.g., after installing new NPM packages or making configuration changes in files not mounted to the containers. You can also use `npm run recycle` to stop a running development environment, rebuild the services, and start up again.

```bash
npm run build
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

#### Run Tests

See [test documentation](./tests.md) for more testing commands and information.

```bash
npm test
```

#### Run Formatting and Lint

```bash
npm run format
```

```bash
npm run lint
```

#### Remove Local Database Volume

```
npm run prune
```

## Contributions

Contributions must be made via pull requests into the protected `main` branch. Use labels and comprehensive descriptions in PR's to aid automatic release notes generation. All tests must pass before merge.

Third-party contributions are accepted but you must first agree to Funidata's CLA. This repository is not currently set up for automatic CLA management. If you are interested in contributing to this project, please open an issue first to sort out these necessities!

## Database Migrations

Database migrations are required whenever changes are made to the database schema.

When running in development mode, TypeORM will synchronize the schema automatically. It is the developer's responsibility, however, to write migrations for CI and production environments. (E2E tests run on CI require migrations but in local development environment TypeORM sync is on.)

Reverse migrations (`MigrationInterface.down()`) are not necessary.

### Migration Commands

These commands are run in the `server/` directory.

#### Run Migrations

```bash
npm run migration:run
```

#### Create New Migration File

TypeORM is particular about migration filenames, so this command should be used to initialize new migration files.

```
npm run migration:create
```

## Releases

The project is setup with an automatic release pipeline that takes care of testing the software, building, packaging and finally publishing it as a Docker image to GHCR (GitHub Container Registry).

### Versions

Keijo is released as a single Docker image that contains the whole software. (The frontend is built into the backend and served by it.) Following images are published at [GHCR](https://github.com/funidata/keijo/pkgs/container/keijo):

- `next`: The `HEAD` of `main` branch. Not guaranteed to be stable.
- `latest`: The latest released version. This image is also tagged with the full semver version number along with the abbreviated major and minor semver tags. For example, if you release version `1.2.3`, the following tags would point to the same image (until a new version is release, that is):
  - `latest`
  - `1.2.3`
  - `1.2`
  - `1`

### Publish New Version

1. Make sure you are in `main` branch and the working tree is clean.
2. Run `npm version <patch|minor|major>`. **Always follow the [semantic versioning guidelines](https://semver.org/).** This script uses `npm version` to apply the desired version bump, sync the sub-projects with it, and finally push the created tags to GitHub.
3. Allow the [CI/CD pipeline](https://github.com/funidata/keijo/actions) to finish. The new version is automatically published once the workflow completes.

## Jira Integration

Keijo integrates to Jira using OAuth2.0 to get, for example, issue related data.
The backend functions as a [token-mediating backend](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps#name-token-mediating-backend), storing users Jira tokens in user sessions, and handing access token to the frontend to make
requests to [Jira Cloud REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v2).

### Atlassian App

An Atlassian OAuth2.0 app needs to be created to get necessary Atlassian credentials and values.
Atlassian app can be created in the [developer console](https://developer.atlassian.com/console/myapps/).
The app needs to be configured to have:

- scope `read:jira-work` (permissions tab).
- callback URL e.g., `https://<keijo-site>/jira/callback` or for local development e.g., `http://localhost:3001/jira/callback` (Authorization tab).

Once these are added to the app, get the client ID and client sercret from app settings.
For more detailed steps and information see [Jira OAuth2.0 apps](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/).
