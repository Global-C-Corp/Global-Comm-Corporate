import 'dotenv/config'
import { checkEnv } from '../src/lib/env'

const result = checkEnv()

if (result.ok) {
  console.log('✓ Environment configuration is valid.')
  process.exit(0)
}

console.error('✗ Environment configuration is invalid:\n')
for (const issue of result.issues) {
  console.error(`  - ${issue.variable}: ${issue.message}`)
}
process.exit(1)
