import {
  getBearerToken,
  getMcpOAuthScopes,
  isMcpOAuthEnabled,
  verifyMcpOAuthAccessToken,
} from '@/mcp/oauth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function metadataURL(request: Request): string {
  return new URL('/.well-known/oauth-protected-resource', request.url).toString()
}

function authChallenge(request: Request, error: 'invalid_token' | 'insufficient_scope', description: string) {
  const scopes = getMcpOAuthScopes().join(' ')
  const challenge =
    `Bearer resource_metadata="${metadataURL(request)}", ` +
    `scope="${scopes}", ` +
    `error="${error}", ` +
    `error_description="${description.replace(/"/g, "'")}"`

  return Response.json(
    { error, error_description: description },
    {
      status: 401,
      headers: {
        'Cache-Control': 'no-store',
        'WWW-Authenticate': challenge,
      },
    },
  )
}

async function proxyMcp(request: Request): Promise<Response> {
  if (!isMcpOAuthEnabled()) {
    return Response.json(
      { error: 'oauth_not_configured', error_description: 'ChatGPT MCP OAuth gateway is disabled.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const internalApiKey = process.env.PAYLOAD_MCP_INTERNAL_KEY?.trim()
  if (!internalApiKey) {
    return Response.json(
      { error: 'server_misconfigured', error_description: 'Payload MCP gateway credential is missing.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const token = getBearerToken(request)
  if (!token) {
    return authChallenge(request, 'invalid_token', 'OAuth access token is required.')
  }

  try {
    await verifyMcpOAuthAccessToken(token)
  } catch (error) {
    const description = error instanceof Error ? error.message : 'OAuth access token validation failed.'
    const errorCode = description.includes('scope') ? 'insufficient_scope' : 'invalid_token'
    return authChallenge(request, errorCode, description)
  }

  const upstreamURL = new URL('/api/mcp', request.url)
  const headers = new Headers(request.headers)
  headers.set('Authorization', `Bearer ${internalApiKey}`)
  headers.delete('host')
  headers.delete('content-length')
  headers.delete('connection')

  const method = request.method.toUpperCase()
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer()

  const upstream = await fetch(upstreamURL, {
    method,
    headers,
    body,
    cache: 'no-store',
    redirect: 'manual',
  })

  const responseHeaders = new Headers(upstream.headers)
  responseHeaders.delete('content-length')
  responseHeaders.set('Cache-Control', 'no-store')

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}

export const GET = proxyMcp
export const POST = proxyMcp
export const DELETE = proxyMcp

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'GET, POST, DELETE, OPTIONS',
      'Cache-Control': 'no-store',
    },
  })
}
