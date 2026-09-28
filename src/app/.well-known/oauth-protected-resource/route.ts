import { getMcpOAuthConfig, isMcpOAuthEnabled } from '@/mcp/oauth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isMcpOAuthEnabled()) {
    return Response.json(
      { error: 'oauth_not_configured', error_description: 'ChatGPT MCP OAuth gateway is disabled.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  try {
    const config = getMcpOAuthConfig()

    return Response.json(
      {
        resource: config.resource,
        authorization_servers: [config.issuer],
        scopes_supported: config.requiredScopes,
        resource_documentation: 'https://mcp.globalcomm.ma',
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, must-revalidate',
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    return Response.json(
      {
        error: 'server_misconfigured',
        error_description: error instanceof Error ? error.message : 'OAuth metadata configuration failed.',
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
