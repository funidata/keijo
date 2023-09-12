# Configuration

Netvisor integration credentials must be supplied in order for the upstream API integration to work. The backend application reads configuration from environment variables according to the table below.

Variables with default values can be omitted from environment.

For local development, create `.env` file in repository root and populate it with your demo credentials.

## Environment Variables

<!-- prettier-ignore -->
Key|Default|Description
-|-|-
`NODE_ENV`||Node environment spec. Value **MUST BE** `production` whenever you are using non-demo credentials for Netvisor.
`NETVISOR_CUSTOMER_ID`||See Netvisor auth docs for `X-Netvisor-Authentication-CustomerId` header.
`NETVISOR_ORGANIZATION_ID`||See Netvisor auth docs for `X-Netvisor-Organisation-ID` header.
`NETVISOR_CUSTOMER_KEY`||See Netvisor auth docs for _"Integraatiokäyttäjän yksilöivä avain"_.
`NETVISOR_ORGANIZATION_KEY`||See Netvisor auth docs for _"Integraatiokumppanin yksilöivä avain"_.
`NETVISOR_PARTNER_ID`||See Netvisor auth docs for `X-Netvisor-Authentication-PartnerId` header.
`NETVISOR_CACHE_TTL`|60|Time-to-live (seconds) for caching certain Netvisor API endpoint results.
`PORT`|3001|Server listens to this port.
`EMPLOYEE_NUMBER_HEADER_KEY`|X-SHIB-employeeId|Name of the header that defines authenticated user's Netvisor employee ID (case insensitive). **The user must not be able to set this header.**
`LOG_LEVEL`|log|Filter log output by suppressing log messages of higher level than the given value. Log levels in ascending order are `error`, `warn`, `log` and `debug`.
`ENABLE_JSON_LOGS`|`false`|Output stringified JSON instead of human-readable logs by setting this to `true`.
`ENABLE_AUDIT_LOGS`|`false`|When set to `true`, logs of level `audit` are printed, containing users' personal information. These logs should be stored safely or not enabled at all in production environments. Audit log output is always JSON and does not respect the `LOG_LEVEL` setting.
