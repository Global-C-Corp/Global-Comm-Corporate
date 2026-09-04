/**
 * Tailwind is the engine behind the shadcn/ui primitive layer only.
 *
 * `@tailwindcss/postcss` transforms only stylesheets that import Tailwind, so
 * Payload's admin SCSS passes through untouched — the frontend stylesheet is
 * the single file that opts in.
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
