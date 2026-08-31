// Any setup scripts you might need go here

// Integration/contract tests run against a disposable test database
// (CLAUDE.md §8). .env.test takes precedence; .env fills any remaining gaps.
import { config } from 'dotenv'

config({ path: '.env.test' })
config({ path: '.env' })
