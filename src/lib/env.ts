/**
 * Centralized environment variable validation (CLAUDE.md §91, §144-146).
 * Used by scripts/verify-env.ts and imported at Payload config boot so
 * misconfiguration fails fast instead of surfacing as a runtime 500.
 */

export type EnvIssue = {
  variable: string
  message: string
}

export type EnvCheckResult = {
  ok: boolean
  issues: EnvIssue[]
}

const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production'

export function checkEnv(): EnvCheckResult {
  const issues: EnvIssue[] = []

  const required = ['DATABASE_URI', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL', 'PREVIEW_SECRET']

  for (const variable of required) {
    if (!process.env[variable] || process.env[variable]?.trim() === '') {
      issues.push({ variable, message: 'is required but not set' })
    }
  }

  if (process.env.PAYLOAD_SECRET && process.env.PAYLOAD_SECRET.length < 16) {
    issues.push({ variable: 'PAYLOAD_SECRET', message: 'must be at least 16 characters' })
  }

  for (const variable of Object.keys(process.env)) {
    if (variable.startsWith('NEXT_PUBLIC_') && /secret|token|key|password/i.test(variable)) {
      issues.push({
        variable,
        message: 'looks like a secret exposed via NEXT_PUBLIC_* — never expose secrets to the client',
      })
    }
  }

  if (isProduction && !process.env.BLOB_READ_WRITE_TOKEN) {
    issues.push({
      variable: 'BLOB_READ_WRITE_TOKEN',
      message: 'is required in production — media must use persistent object storage, never deployment filesystem',
    })
  }

  if (process.env.NEXT_PUBLIC_SERVER_URL && !/^https?:\/\//.test(process.env.NEXT_PUBLIC_SERVER_URL)) {
    issues.push({ variable: 'NEXT_PUBLIC_SERVER_URL', message: 'must be an absolute URL' })
  }

  return { ok: issues.length === 0, issues }
}
