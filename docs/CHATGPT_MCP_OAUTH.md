# ChatGPT OAuth gateway for Global Comm Payload MCP

## Purpose

Payload's MCP plugin authenticates with its own Bearer API keys. ChatGPT's authenticated custom MCP flow uses OAuth 2.1. This gateway keeps the working Payload MCP endpoint untouched and adds an OAuth-protected entry point for ChatGPT.

```text
ChatGPT
  -> OAuth access token
  -> https://mcp.globalcomm.ma/api/chatgpt-mcp
  -> OAuth JWT verification
  -> server-side Payload MCP API key
  -> /api/mcp
  -> Payload MCP tools
```

The Payload MCP API key never leaves the server.

## Endpoints

- Payload-native MCP: `https://mcp.globalcomm.ma/api/mcp`
- ChatGPT OAuth MCP: `https://mcp.globalcomm.ma/api/chatgpt-mcp`
- Protected resource metadata: `https://mcp.globalcomm.ma/.well-known/oauth-protected-resource`

## Auth0 setup

Use an Auth0 tenant with **Auth for MCP**.

1. Create an Auth0 API / resource server whose identifier is exactly:

   ```text
   https://mcp.globalcomm.ma
   ```

2. Add permissions:

   ```text
   cms:read
   cms:write
   cms:publish
   ```

3. In Auth0 tenant settings, enable the MCP-compatible client registration option you intend to use (CIMD is preferred when available; DCR is also supported) and enable **Resource Parameter Compatibility Profile** so the OAuth `resource` parameter is treated as the API resource identifier.

4. Ensure the authorization server discovery metadata advertises PKCE `S256`.

5. Restrict who may authenticate to this Auth0 tenant/application. Optionally set `MCP_OAUTH_ALLOWED_SUBJECTS` to the Auth0 `sub` values that may use the MCP gateway.

## Payload internal key

Create a dedicated Payload MCP API key named something like:

```text
ChatGPT OAuth Gateway
```

Give it only the MCP capabilities ChatGPT should ultimately receive. Store the generated key only in Vercel as `PAYLOAD_MCP_INTERNAL_KEY`.

Do not expose this value to ChatGPT or the browser.

## Vercel environment variables

Set these on the `global-comm-corporate` project:

```text
MCP_OAUTH_ENABLED=true
MCP_OAUTH_ISSUER=https://YOUR_AUTH0_TENANT.auth0.com/
MCP_OAUTH_RESOURCE=https://mcp.globalcomm.ma
MCP_OAUTH_SCOPES=cms:read cms:write cms:publish
MCP_OAUTH_ALLOWED_SUBJECTS=
PAYLOAD_MCP_INTERNAL_KEY=<dedicated Payload MCP API key>
```

If `MCP_OAUTH_ALLOWED_SUBJECTS` contains multiple values, separate them with commas.

Redeploy after changing environment variables.

## Verification

Protected resource metadata:

```bash
curl -i https://mcp.globalcomm.ma/.well-known/oauth-protected-resource
```

Expected after configuration: HTTP 200 JSON with `resource`, `authorization_servers`, and `scopes_supported`.

OAuth challenge:

```bash
curl -i \
  -X POST \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}' \
  https://mcp.globalcomm.ma/api/chatgpt-mcp
```

Expected: HTTP 401 with a `WWW-Authenticate: Bearer ... resource_metadata=...` challenge.

## ChatGPT plugin configuration

Use:

```text
Name: Global Comm CMS
Server URL: https://mcp.globalcomm.ma/api/chatgpt-mcp
Authentication: OAuth
```

ChatGPT should discover the protected-resource metadata, then the Auth0 authorization-server metadata, and launch the Auth0 authorization-code + PKCE flow.

## Security properties

- OAuth access tokens are validated for RS256 signature, issuer, resource/audience, expiry, optional not-before, subject allowlist, and required scopes.
- The original Payload MCP endpoint remains protected by its Payload API key.
- The gateway replaces the external OAuth bearer token with the dedicated internal Payload MCP key only after OAuth validation succeeds.
- The internal Payload key determines the final Payload user and permissions, so existing Payload access control and MCP capability settings remain authoritative.
