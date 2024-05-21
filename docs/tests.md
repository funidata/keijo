# Tests

Keijo features unit and end-to-end tests. Both are run in CI for all changes and required before pull requests can be merged.

#### Run All Tests

```bash
npm test
```

## Unit Tests

Unit tests are implemented with Jest and are based on the boilerplate Nest.js produces upon installation. Test files should end with `*.spec.ts` and otherwise be named the same as the module they test.

#### Run Unit Tests

```bash
npm run unit-tests
```

## End-To-End Tests

End-to-end tests are implemented with Playwright. The tests are located at `e2e/tests/`.

The development environment features dedicated backend and frontend services for testing. The Docker containers are named `keijo-server-test` and `keijo-web-test`, respectively. This arrangement is done so that we can run the tests against a mock Netvisor API without code changes.

### Mock Netvisor API

The mock API is implemented with [Mockoon](https://mockoon.com/). The API definition and data files are located at `nv-mock/`. Mockoon's Docker image is used to run the API with Docker Compose in the development environment and directly with Docker in CI.

### Commands

#### Run E2E Tests

```bash
npm run e2e
```

#### Open Playwright UI

```bash
npm run e2e:open
```

#### View Test Containers' Logs

```bash
npm run logs:test
```
