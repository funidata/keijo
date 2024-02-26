# Logging

Keijo uses a custom logger that extends Nest.js's default `Logger` implementation. Our logger is designed to work with the ELK stack (Elasticsearch, Logstash and Kibana) and enables the logging of audit data for redundancy and legal purposes.

Changes to logging should be done carefully and with respect to this document as this is a critical part of the application in many respects. Always document any changes both here and in code.

## Configuration

Logging is configured with three environment variables, all of which are optional. The defaults are a reasonable starting point for the development environment, so you don't need to configure these to run Keijo locally.

## Log Level

Configured with `LOG_LEVEL` env var. Possible values are `error`, `warn`, `log` and `debug`. Default value is `log`. Logs with lower importance than the selected log level are suppressed, i.e., `debug` prints all levels and `error` result in minimal log output.

## JSON Logs

If `ENABLE_JSON_LOGS` env var is `true`, all logs are written as stringified JSON. Otherwise, Nest.js's default `Logger` is used to output prettier and more readable logs.

The JSON logs include more data than the default logs thus making them somewhat cumbersome to follow while developing. Debug level logs are not output as JSON at all to make developing easier while also guarding against logging failures in deployed instances.

### Output Schema

_**JSON LOG OUTPUT SCHEMA MUST NOT BE CHANGED EXCEPT FOR ADDING NEW FIELDS!**_

Elasticsearch will fail, if types change for existing fields, possibly causing a loss of logs. To prevent this from happening, all logging **MUST** use our custom `Logger` and its interface **MUST NOT** be changed except for adding new fields.

The schema is defined in [`json-log-output.schema.ts`](../server/src/logger/interfaces/json-log-output.schema.ts).

## Audit Logs

Audit logs can be written to preserve an audit trail about critical operations. In practice, these logs contain information about all requests that mutate Netvisor's data via their API. Audit logs inherently contain employees' sensitive information, and should be kept with proper care or not toggled on at all.

Setting `ENABLE_AUDIT_LOGS` env var to `true` activates audit log output. The log level settings has no effect on audit logs, and they are always output as stringified JSON.

Audit logs are the only log output that contains sensitive personal information. By segregating them from other log output, it is possible to expose the other logs to a wider audience.
