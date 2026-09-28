import { createPublicKey, verify, type JsonWebKey } from 'node:crypto'

type OAuthConfig = {
  issuer: string
  resource: string
  requiredScopes: string[]
  allowedSubjects: string[]
}

type OAuthDiscovery = {
  issuer?: string
  jwks_uri?: string
}

type JWKSet = {
  keys?: Array<JsonWebKey & { kid?: string; alg?: string; use?: string }>
}

export type OAuthAccessClaims = {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  scope?: string
  permissions?: string[]
  [key: string]: unknown
}

let discoveryCache: { issuer: string; value: OAuthDiscovery } | null = null
let jwksCache: { uri: string; value: JWKSet } | null = null

function splitList(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(/[\s,]+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function isMcpOAuthEnabled(): boolean {
  return process.env.MCP_OAUTH_ENABLED === 'true'
}

export function getMcpOAuthConfig(): OAuthConfig {
  const issuer = process.env.MCP_OAUTH_ISSUER?.trim()
  const resource = process.env.MCP_OAUTH_RESOURCE?.trim()

  if (!issuer || !resource) {
    throw new Error('MCP OAuth is not configured: MCP_OAUTH_ISSUER and MCP_OAUTH_RESOURCE are required.')
  }

  return {
    issuer,
    resource,
    requiredScopes: splitList(process.env.MCP_OAUTH_SCOPES || 'cms:read cms:write cms:publish'),
    allowedSubjects: splitList(process.env.MCP_OAUTH_ALLOWED_SUBJECTS),
  }
}

export function getMcpOAuthScopes(): string[] {
  return splitList(process.env.MCP_OAUTH_SCOPES || 'cms:read cms:write cms:publish')
}

function normalizeIssuerForDiscovery(issuer: string): string {
  return issuer.endsWith('/') ? issuer : `${issuer}/`
}

async function fetchOAuthDiscovery(issuer: string): Promise<OAuthDiscovery> {
  if (discoveryCache?.issuer === issuer) return discoveryCache.value

  const base = normalizeIssuerForDiscovery(issuer)
  const candidates = [
    new URL('.well-known/openid-configuration', base),
    new URL('.well-known/oauth-authorization-server', base),
  ]

  let lastError: Error | null = null

  for (const url of candidates) {
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        cache: 'force-cache',
        next: { revalidate: 3600 },
      })

      if (!response.ok) {
        lastError = new Error(`OAuth discovery failed at ${url.toString()} with HTTP ${response.status}.`)
        continue
      }

      const value = (await response.json()) as OAuthDiscovery
      if (!value.jwks_uri) {
        lastError = new Error(`OAuth discovery at ${url.toString()} did not provide jwks_uri.`)
        continue
      }

      discoveryCache = { issuer, value }
      return value
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('OAuth discovery request failed.')
    }
  }

  throw lastError ?? new Error('Unable to discover OAuth authorization server metadata.')
}

async function fetchJwks(uri: string): Promise<JWKSet> {
  if (jwksCache?.uri === uri) return jwksCache.value

  const response = await fetch(uri, {
    headers: { Accept: 'application/json' },
    cache: 'force-cache',
    next: { revalidate: 3600 },
  })

  if (!response.ok) {
    throw new Error(`Unable to fetch OAuth signing keys (HTTP ${response.status}).`)
  }

  const value = (await response.json()) as JWKSet
  if (!Array.isArray(value.keys) || value.keys.length === 0) {
    throw new Error('OAuth signing key set is empty.')
  }

  jwksCache = { uri, value }
  return value
}

function decodeJsonSegment<T>(segment: string): T {
  try {
    return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8')) as T
  } catch {
    throw new Error('Malformed OAuth JWT.')
  }
}

function audienceMatches(aud: string | string[] | undefined, expected: string): boolean {
  if (typeof aud === 'string') return aud === expected
  return Array.isArray(aud) && aud.includes(expected)
}

function extractScopes(claims: OAuthAccessClaims): Set<string> {
  const scopes = new Set<string>()

  for (const scope of splitList(claims.scope)) scopes.add(scope)
  if (Array.isArray(claims.permissions)) {
    for (const permission of claims.permissions) {
      if (typeof permission === 'string' && permission.trim()) scopes.add(permission.trim())
    }
  }

  return scopes
}

export function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get('authorization')
  if (!authorization) return null

  const match = authorization.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || null
}

export async function verifyMcpOAuthAccessToken(token: string): Promise<OAuthAccessClaims> {
  const config = getMcpOAuthConfig()
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('OAuth access token must be a signed JWT.')
  }

  const [encodedHeader, encodedPayload, _encodedSignature] = parts
  const header = decodeJsonSegment<{ alg?: string; kid?: string }>(encodedHeader)
  const claims = decodeJsonSegment<OAuthAccessClaims>(encodedPayload)

  if (header.alg !== 'RS256' || !header.kid) {
    throw new Error('Unsupported OAuth token signing algorithm.')
  }

  const discovery = await fetchOAuthDiscovery(config.issuer)
  if (discovery.issuer && discovery.issuer !== config.issuer) {
    throw new Error('OAuth issuer metadata does not match MCP_OAUTH_ISSUER.')
  }

  const jwks = await fetchJwks(discovery.jwks_uri as string)
  const jwk = jwks.keys?.find((candidate) => candidate.kid === header.kid && candidate.kty === 'RSA')

  if (!jwk) {
    // Signing keys can rotate. Drop the cache once and retry discovery of the key.
    jwksCache = null
    const refreshed = await fetchJwks(discovery.jwks_uri as string)
    const rotated = refreshed.keys?.find((candidate) => candidate.kid === header.kid && candidate.kty === 'RSA')
    if (!rotated) throw new Error('OAuth token signing key was not found.')
    return verifyWithJwk(token, rotated, claims, config)
  }

  return verifyWithJwk(token, jwk, claims, config)
}

function verifyWithJwk(
  token: string,
  jwk: JsonWebKey & { kid?: string; alg?: string; use?: string },
  claims: OAuthAccessClaims,
  config: OAuthConfig,
): OAuthAccessClaims {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.')
  const key = createPublicKey({ key: jwk, format: 'jwk' })
  const validSignature = verify(
    'RSA-SHA256',
    Buffer.from(`${encodedHeader}.${encodedPayload}`),
    key,
    Buffer.from(encodedSignature, 'base64url'),
  )

  if (!validSignature) throw new Error('OAuth token signature is invalid.')
  if (claims.iss !== config.issuer) throw new Error('OAuth token issuer is invalid.')
  if (!audienceMatches(claims.aud, config.resource)) throw new Error('OAuth token audience is invalid.')

  const now = Math.floor(Date.now() / 1000)
  if (typeof claims.exp !== 'number' || claims.exp <= now) throw new Error('OAuth token is expired.')
  if (typeof claims.nbf === 'number' && claims.nbf > now + 30) throw new Error('OAuth token is not active yet.')

  if (config.allowedSubjects.length > 0) {
    if (!claims.sub || !config.allowedSubjects.includes(claims.sub)) {
      throw new Error('OAuth subject is not allowed to use this MCP server.')
    }
  }

  const grantedScopes = extractScopes(claims)
  const missingScopes = config.requiredScopes.filter((scope) => !grantedScopes.has(scope))
  if (missingScopes.length > 0) {
    throw new Error(`OAuth token is missing required scopes: ${missingScopes.join(', ')}.`)
  }

  return claims
}
