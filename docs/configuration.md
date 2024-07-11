# Configuration

Netvisor integration credentials must be supplied in order for the upstream API integration to work. The backend application reads configuration from environment variables according to the table below.

Variables with default values can be omitted from environment.

For local development, create `.env` file in repository root and populate it with your demo credentials.

## Environment Variables

<!-- prettier-ignore -->
Key|Default|Description
-|-|-
`NODE_ENV`||Node environment spec. Value **MUST BE** `production` whenever you are using non-demo credentials for Netvisor.
`NETVISOR_API_URL`|https://isvapi.netvisor.fi|URL where Netvisor API requests should be made to. Default value points to NV's demo environment.
`NETVISOR_CUSTOMER_ID`||See Netvisor auth docs for `X-Netvisor-Authentication-CustomerId` header.
`NETVISOR_ORGANIZATION_ID`||See Netvisor auth docs for `X-Netvisor-Organisation-ID` header.
`NETVISOR_CUSTOMER_KEY`||See Netvisor auth docs for _"Integraatiokäyttäjän yksilöivä avain"_.
`NETVISOR_ORGANIZATION_KEY`||See Netvisor auth docs for _"Integraatiokumppanin yksilöivä avain"_.
`NETVISOR_PARTNER_ID`||See Netvisor auth docs for `X-Netvisor-Authentication-PartnerId` header.
`NETVISOR_CACHE_TTL`|60|Time-to-live (seconds) for caching certain Netvisor API endpoint results.
`NETVISOR_ENTRY_RATIONUMBER`|100|Ratio number ("collectorratio") to use when making new workday entries.
`PORT`|3001|Server listens to this port.
`EMPLOYEE_NUMBER_HEADER_KEY`|X-SHIB-employeeId|Name of the header that defines authenticated user's Netvisor employee ID (case insensitive). **The user must not be able to set this header.**
`LOG_LEVEL`<sup>1</sup>|log|Filter log output by suppressing log messages of higher level than the given value. Log levels in ascending order are `error`, `warn`, `log` and `debug`.
`ENABLE_JSON_LOGS`<sup>1</sup>|`false`|Output stringified JSON instead of human-readable logs by setting this to `true`.
`ENABLE_AUDIT_LOGS`<sup>1</sup>|`false`|When set to `true`, logs of level `audit` are printed, containing users' personal information. These logs should be stored safely or not enabled at all in production environments. Audit log output is always JSON and does not respect the `LOG_LEVEL` setting.
`DATABASE_USERNAME`||Postgres username.
`DATABASE_PASSWORD`||Postgres password.
`DATABASE_NAME`||Postgres database name.
`DATABASE_HOST`||Postgres hostname.
`DATABASE_PORT`||Postgres port.
`DATABASE_SSL_MODE`|`false`|When set to `true`, TypeORM is configured to use SSL mode `no-verify` when connecting to Postgres. Otherwise, SSL is disabled. See [`node-postgres` docs](https://github.com/brianc/node-postgres/tree/master/packages/pg-connection-string#tcp-connections) for more.
`ATLASSIAN_CLIENT_ID`|| Client ID of your Atlassian OAuth 2.0 App. See [Jira OAuth2.0 apps](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/).
`ATLASSIAN_CLIENT_SECRET`|| Client Secret of your Atlassian OAuth 2.0 App.
`ATLASSIAN_AUTHORIZATION_URL`|https://auth.atlassian.com/authorize| Atlassian URL where user is directed to grant keijo access to use resources.
`ATLASSIAN_TOKEN_URL`|https://auth.atlassian.com/oauth/token| Atlassian URL where keijo exchanges authorization code for access and refresh tokens.
`ATLASSIAN_CLOUD_ID`|| Cloud ID of Atlassian tenant where Keijo requests data from.
`CALLBACK_URL`|/jira/callback| Keijo URL where user is redirected from Jira after access is granted.
`CALLBACK_REDIRECT_URL`|/| Keijo URL where user is redirected from callback after callback is handled.
`SESSION_SECRET`|| Session secret.
`CORS_ORIGIN`|| Development Cors origin URL.
`TRUST_PROXY_IPS`|false| Trusted proxy ips to allow secure cookies to be sent over proxies.

<sup>1</sup>) See [Logging docs](./logging.md) for more information.
