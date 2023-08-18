# Keijo

Custom UI for Netvisor

## Command Reference

Run commands in repository root.

#### Start Dev Env

Starts to background and then attaches to logs.

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

## Configuration

Netvisor integration credentials must be supplied in order for the upstream API integration to work. The backend application reads configuration from environment variables according to the table below.

For local development, create `.env` file in repository root and populate it with your demo credentials.

### Environment Variables

<!-- prettier-ignore -->
Key|Default|Description
-|-|-
`NETVISOR_CUSTOMER_ID`||See Netvisor auth docs for `X-Netvisor-Authentication-CustomerId` header.
`NETVISOR_ORGANIZATION_ID`||See Netvisor auth docs for `X-Netvisor-Organisation-ID` header.
`NETVISOR_CUSTOMER_KEY`||See Netvisor auth docs for _"Integraatiokäyttäjän yksilöivä avain"_.
`NETVISOR_ORGANIZATION_KEY`||See Netvisor auth docs for _"Integraatiokumppanin yksilöivä avain"_.
`PORT`|3001|Server listens to this port.
