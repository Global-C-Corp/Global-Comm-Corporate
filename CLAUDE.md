# CLAUDE.md

# Global Communication Corporate™

## Canonical Engineering Specification

### Next.js + Payload CMS + PostgreSQL + Vercel + Multilingual AI Editorial MCP

---

# 0. AUTHORITY

This document is the **single source of truth** for this repository.

If any of the following conflict with this document:

- README files
- previous prompts
- previous architecture files
- WordPress specifications
- GraphQL specifications
- REST API specifications
- generated documentation
- agent-generated plans
- old implementation decisions
- comments
- assumptions

**this `CLAUDE.md` wins.**

Only an explicit instruction from the human project owner may fundamentally alter this architecture.

Claude Code must not silently reinterpret or replace the architecture.

---

# 1. ENGINEERING QUALITY BAR

Implement this project at **Staff+/Principal software-engineering quality**.

The user refers to the expected standard as “Fable 5 level.” Treat this as a request for exceptional engineering rigor, not as a formal industry certification.

Prioritize:

```text
Correctness
Security
Maintainability
Type safety
Content integrity
Testability
Accessibility
Performance
Operational simplicity
Observability
Least privilege
Predictable architecture
```

Do not optimize for:

```text
cleverness
minimum line count
framework novelty
premature abstraction
unnecessary dependencies
visual gimmicks
shipping quickly with failing tests
```

No implementation can truthfully guarantee zero defects.

Never claim:

```text
bug-free
zero bugs guaranteed
perfectly secure
will never fail
```

Instead, prove correctness through:

```text
static analysis
unit tests
integration tests
MCP contract tests
migration testing
E2E testing
access-control tests
preview tests
multilingual SEO tests
production smoke tests
```

---

# 2. PRODUCT MISSION

Build Global Communication Corporate™ as one unified digital platform containing:

```text
1. Public multilingual website
2. Payload CMS
3. Portfolio database
4. Client database
5. Testimonials database
6. Taxonomy system
7. SEO management
8. OpenGraph management
9. Media management
10. Multilingual editorial workflow
11. AI-assisted content operations
12. Human approval and publishing
```

The platform must support this workflow:

```text
SOURCE MATERIAL
      │
      ▼
CLAUDE / CHATGPT
      │
      │ MCP
      ▼
AI CONTENT OPERATIONS
      │
      ▼
PAYLOAD DRAFT
      │
      ├── content
      ├── relationships
      ├── classification
      ├── translations
      ├── SEO
      ├── OpenGraph
      ├── media metadata
      └── provenance
      │
      ▼
NEEDS REVIEW
      │
      ▼
HUMAN REVIEW
      │
      ├── correct
      ├── complete
      └── approve
      │
      ▼
HUMAN PUBLISH
      │
      ▼
NEXT.JS
      │
      ▼
VERCEL
      │
      ▼
GLOBALCOMM.MA
```

The AI is an **editorial operator**.

The AI is **not a publisher**.

---

# 3. FUNDAMENTAL ARCHITECTURE

Use one Next.js + Payload application.

```text
                         HUMAN EDITOR
                              │
                              ▼
                       PAYLOAD ADMIN
                          /admin
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                    VERCEL PROJECT                           │
│                                                             │
│                 NEXT.JS APP ROUTER                          │
│                                                             │
│  ┌───────────────────────┐      ┌────────────────────────┐  │
│  │ PUBLIC WEBSITE        │      │ PAYLOAD CMS            │  │
│  │                       │      │                        │  │
│  │ /fr/...               │      │ Clients                │  │
│  │ /en/...               │      │ Projects               │  │
│  │ /es/...               │      │ Testimonials           │  │
│  │                       │      │ Services               │  │
│  │ Home                  │      │ Industries             │  │
│  │ Services              │      │ Taxonomy               │  │
│  │ Work                  │      │ Media                  │  │
│  │ Industries            │      │ SEO                    │  │
│  │ Company               │      │ Drafts                 │  │
│  │ Contact               │      │ Versions               │  │
│  │                       │      │ Users                  │  │
│  └───────────┬───────────┘      └────────────┬───────────┘  │
│              │                               │              │
│              └──────── Payload Local API ────┘              │
│                                                             │
│                 ┌──────────────────────┐                    │
│                 │ Payload MCP          │                    │
│                 │ /api/mcp             │                    │
│                 └──────────┬───────────┘                    │
│                            │                                │
└────────────────────────────┼────────────────────────────────┘
                             │
                     Bearer API Key
                             │
                  ┌──────────┴───────────┐
                  │                      │
             CLAUDE CODE             CHATGPT
                  │                      │
                  └──────────┬───────────┘
                             │
                         DRAFT ONLY
                             │
                             ▼
                          PAYLOAD
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
           POSTGRESQL               OBJECT STORAGE
```

---

# 4. SINGLE SOURCE OF TRUTH

Payload owns:

```text
Clients
Projects
Testimonials
Services
Industries
Project Types
Context Tags

Media

Homepage content
Services page content
Work page content
Company content
Contact content

Navigation
Site settings

SEO metadata
OpenGraph metadata

Localized content
Localized entity slugs

Draft status
Review status
Translation status
Versions

AI provenance
Redirect records
```

Next.js owns:

```text
routing
layout
components
visual composition
responsive behavior
interaction
animations

canonical computation
hreflang computation

metadata rendering
JSON-LD rendering
sitemap rendering
robots rendering

redirect execution
cache behavior

public forms
```

MCP owns:

```text
external AI interaction with Payload
```

---

# 5. EXPLICITLY FORBIDDEN ARCHITECTURE

Do not introduce:

```text
WordPress
WPGraphQL
custom WordPress REST APIs
Strapi
Sanity
Contentful
second Payload instance
second CMS database
standalone Express backend
duplicate API layer for Claude
duplicate API layer for ChatGPT
client-side CMS fetching for core pages
generic page builder
AI publishing rights
AI delete rights
AI taxonomy administration
```

Do not fundamentally replace:

```text
Next.js
Payload
PostgreSQL
Vercel
MCP
human publishing gate
```

without explicit human approval.

---

# 6. REQUIRED TECHNOLOGY STACK

Use:

```text
TypeScript strict
Next.js App Router
React
Payload CMS
PostgreSQL
Payload Postgres Adapter
Payload Local API
Payload Drafts
Payload Versions
Payload Access Control
Payload MCP Plugin
Payload SEO Plugin
Payload Redirects Plugin
Payload Object Storage Adapter
pnpm
Vercel
Playwright
Vitest or equivalent
```

Server Components by default.

---

# 7. VERSION POLICY

Before installing dependencies:

1. Read current Payload compatibility documentation.
2. Confirm supported Node.js version.
3. Confirm supported Next.js version.
4. Keep Payload packages mutually compatible.
5. Do not blindly install `next@latest`.
6. Use pnpm.
7. Commit `pnpm-lock.yaml`.
8. Never perform framework upgrades incidentally.

Claude must verify current official documentation before implementation.

---

# 8. ENVIRONMENTS

Maintain:

```text
LOCAL
TEST
PREVIEW / STAGING
PRODUCTION
```

Database separation:

```text
LOCAL
→ development database

TEST
→ disposable test database

VERCEL PREVIEW
→ staging database / isolated branch

PRODUCTION
→ production database
```

Never connect arbitrary Pull Request deployments to production data.

---

# 9. REPOSITORY STRUCTURE

Recommended structure:

```text
/
├── CLAUDE.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── payload.config.ts
├── tsconfig.json
├── eslint.config.*
├── .env.example
│
├── src/
│
│   ├── app/
│   │
│   │   ├── (frontend)/
│   │   │
│   │   │   ├── [locale]/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── work/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── industries/
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── company/
│   │   │   │   └── contact/
│   │   │   │
│   │   │   ├── sitemap.ts
│   │   │   ├── robots.ts
│   │   │   ├── not-found.tsx
│   │   │   └── error.tsx
│   │   │
│   │   └── (payload)/
│   │       ├── admin/
│   │       └── api/
│   │
│   ├── collections/
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   ├── Clients.ts
│   │   ├── Projects.ts
│   │   ├── Testimonials.ts
│   │   ├── Services.ts
│   │   ├── Industries.ts
│   │   ├── ProjectTypes.ts
│   │   ├── ContextTags.ts
│   │   ├── Inquiries.ts
│   │   └── AIAuditLogs.ts
│   │
│   ├── globals/
│   │   ├── SiteSettings.ts
│   │   ├── Navigation.ts
│   │   ├── HomePage.ts
│   │   ├── ServicesPage.ts
│   │   ├── WorkPage.ts
│   │   ├── CompanyPage.ts
│   │   └── ContactPage.ts
│   │
│   ├── access/
│   ├── hooks/
│   ├── fields/
│   ├── migrations/
│   │
│   ├── services/
│   │   ├── cms/
│   │   ├── content-ops/
│   │   ├── seo/
│   │   └── inquiries/
│   │
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── locale.ts
│   │   ├── routing.ts
│   │   ├── dictionaries.ts
│   │   └── terminology.ts
│   │
│   ├── mcp/
│   │   ├── tools/
│   │   ├── prompts/
│   │   └── resources/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── home/
│   │   ├── service/
│   │   ├── project/
│   │   ├── industry/
│   │   ├── testimonial/
│   │   └── ui/
│   │
│   ├── lib/
│   ├── styles/
│   └── payload-types.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── contract/
│   └── e2e/
│
└── scripts/
    ├── seed.ts
    ├── verify-env.ts
    └── content-health.ts
```

Adapt only where the current Payload scaffold requires a structurally equivalent arrangement.

---

# 10. LANGUAGES

Supported languages:

```text
fr — Français
en — English
es — Español
```

Initial default locale:

```text
fr
```

Store centrally:

```ts
export const locales = ['fr', 'en', 'es'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'fr'
```

Do not duplicate locale constants throughout the project.

---

# 11. LOCALIZATION ARCHITECTURE

Use Payload field-level localization.

Do not create separate Project/Service/Industry documents simply because content exists in three languages.

Concept:

```text
ONE PROJECT
│
├── French localized fields
├── English localized fields
└── Spanish localized fields

Shared:
client
services
industry
media
project type
context tags
metric values
year
```

---

# 12. PUBLIC URL ARCHITECTURE

Every public route has a locale prefix.

```text
/fr
/en
/es
```

Routes:

```text
/fr/services
/en/services
/es/services

/fr/services/[localized-slug]
/en/services/[localized-slug]
/es/services/[localized-slug]

/fr/work
/en/work
/es/work

/fr/work/[localized-slug]
/en/work/[localized-slug]
/es/work/[localized-slug]

/fr/industries/[localized-slug]
/en/industries/[localized-slug]
/es/industries/[localized-slug]

/fr/company
/en/company
/es/company

/fr/contact
/en/contact
/es/contact
```

Root:

```text
/
```

redirects to:

```text
/fr
```

initially.

Do not serve a duplicate unprefixed homepage.

---

# 13. STABLE ROUTE FAMILIES

Keep top-level route-family segments stable initially:

```text
services
work
industries
company
contact
```

Localize:

```text
content
entity slugs
SEO
navigation labels
UI labels
```

This keeps routing deterministic and reduces unnecessary multilingual route complexity.

---

# 14. PUBLIC FALLBACK POLICY

Payload localized queries must use:

```text
fallbackLocale: false
```

for public rendering.

Never show French content inside a Spanish page because the Spanish translation is missing.

Every localized public query explicitly specifies:

```text
locale
fallbackLocale: false
```

---

# 15. LOCALIZED PUBLICATION MODEL

Do not depend on an experimental localized `_status` implementation for production correctness unless it becomes stable and is explicitly reviewed.

Use:

```text
Payload Drafts
Payload Versions
custom translationStatus
custom dirtyLocales
```

---

# 16. TRANSLATION STATUS

Every multilingual public entity supports:

```text
translationStatus:
  fr
  en
  es
```

Values:

```text
missing
ai_draft
needs_review
approved
```

Also maintain:

```text
dirtyLocales[]
```

`dirtyLocales` identifies locales changed in the current unpublished version.

---

# 17. LOCALE PUBLICATION INVARIANT

A locale may be rendered publicly only when:

```text
document has published version
AND
translationStatus[locale] == approved
AND
required localized fields exist
```

Implement centrally:

```text
isLocalePublic(document, locale)
```

Do not duplicate this logic in page components.

---

# 18. MULTILINGUAL PUBLISH GUARD

Because publishing a document publishes its current version, all changed locales must be reviewed before publishing.

Publishing allowed only when:

```text
reviewStatus == approved

AND

for every locale in dirtyLocales:
translationStatus[locale] == approved
```

Example:

```text
dirtyLocales = [es]

ES = approved

→ publish allowed
```

Example:

```text
dirtyLocales = [en, es]

EN = approved
ES = needs_review

→ publish blocked
```

---

# 19. LOCALIZED FIELDS

Normally localize:

```text
title
slug
name
shortDescription
longDescription
excerpt

challenge
approach
deliverables
outcome

hero headings
body copy
CTA copy

Service content
Industry content

SEO title
SEO description

OG title
OG description

alt text
caption
```

---

# 20. SHARED FIELDS

Normally do not localize:

```text
ID
relationships
year
featured
displayOrder
websiteURL
metric numeric value
media file identity
service relationship
industry relationship
project-type relationship
context-tag relationship
permissions
audit IDs
```

---

# 21. USERS

Create auth-enabled:

```text
users
```

Roles:

```text
admin
publisher
editor
ai_editor
```

---

# 22. ADMIN

Admin may:

```text
manage users
manage MCP keys
manage controlled vocabulary
create/update/delete content
review
approve
publish
unpublish
restore versions
manage settings
```

---

# 23. PUBLISHER

Publisher may:

```text
create
read
update
review
request revision
approve
publish approved content
unpublish
restore versions
manage SEO
manage featured/order fields
```

Publisher does not automatically manage system security.

---

# 24. EDITOR

Editor may:

```text
create drafts
edit drafts
create new draft version of published content
assign existing vocabulary
edit localized content
edit SEO drafts
submit for review
```

Editor may not:

```text
publish
approve
delete production content
manage users
manage MCP
create controlled vocabulary by default
```

---

# 25. AI EDITOR

AI may:

```text
read editorial content
create drafts
update permitted drafts
translate content
assign existing vocabulary
prepare SEO
prepare OG metadata
populate provenance
submit for review
```

AI may never:

```text
publish
approve
delete production content
manage users
manage MCP keys
create taxonomy
rename taxonomy
delete taxonomy
access inquiries
access secrets
modify access control
set canonical override
```

---

# 26. EDITORIAL STATE MACHINE

Payload native:

```text
_status:
draft
published
```

Custom:

```text
reviewStatus:
ai_draft
editorial_draft
needs_review
revision_requested
approved
```

AI transitions:

```text
new → ai_draft

ai_draft → ai_draft

ai_draft → needs_review

revision_requested → ai_draft

revision_requested → needs_review
```

Forbidden AI transitions:

```text
→ approved
→ published
→ delete
```

Publisher:

```text
needs_review → revision_requested

needs_review → approved

approved → published
```

---

# 27. SERVER-SIDE PUBLISHING GUARD

Hard invariant:

```text
_status == published
```

requires:

```text
actor.role == publisher OR admin

AND

reviewStatus == approved

AND

all dirtyLocales are approved
```

Enforce server-side.

UI restrictions alone are insufficient.

---

# 28. DRAFTS AND VERSIONS

Enable Drafts + Versions for:

```text
projects
clients
testimonials
services
industries

home-page
services-page
work-page
company-page
contact-page
navigation
```

When AI edits published content:

```text
current published version remains live

new draft version is created
```

---

# 29. TAXONOMY SEMANTICS

Each taxonomy answers one question.

```text
SERVICE
What did Global Comm do?

INDUSTRY
What sector?

PROJECT TYPE
What type of engagement?

CONTEXT TAG
What objective/context?
```

Do not create overlapping classification systems.

---

# 30. SERVICES

Hierarchical collection.

Initial tree:

```text
Strategy
├── Audit & Diagnostic
├── Brand Strategy
├── Communication Strategy
└── Marketing Strategy

Branding
├── Brand Identity
├── Rebranding
├── Visual Identity
├── Brand Guidelines
└── Packaging

Creative & Content
├── Creative Campaigns
├── Content Creation
├── Video Production
├── Photography
├── Motion Design
└── Copywriting

Digital Marketing
├── Social Media
├── Paid Media
├── SEO
├── Content Marketing
├── Lead Generation
├── Email Marketing
└── Conversion Optimization

Web & Technology
├── Corporate Websites
├── Landing Pages
├── E-commerce
├── CRM
├── Marketing Automation
├── AI Solutions
└── Analytics & Reporting
```

Fields:

```text
name                    localized
slug                    localized
parent
aliases                 localized
internalDefinition

shortDescription        localized
longDescription         localized

heroMedia

clientProblem           localized
approach                localized
deliverables            localized
outcomes                localized

featured
displayOrder

SEO                     localized
OpenGraph               localized

translationStatus
dirtyLocales
reviewStatus
_status
```

---

# 31. INDUSTRIES

Initial terms:

```text
FMCG
Food & Beverage
Retail
Public Sector
Institutional
NGO & Nonprofit
Culture & Creative Industries
Human Development
Healthcare
Education
Hospitality
Real Estate
Professional Services
```

Fields:

```text
name
slug
aliases
internalDefinition

shortDescription
longDescription

heroMedia

challenges
capabilities

featured
displayOrder

SEO
OpenGraph

translationStatus
dirtyLocales
reviewStatus
_status
```

Public-facing textual fields are localized.

---

# 32. PROJECT TYPES

Seed:

```text
Brand System
Integrated Campaign
Content Production
Digital Experience
Social Media Program
Growth / Performance Program
Institutional Communication Program
Website / Platform
E-commerce Experience
Automation Implementation
```

Do not put capabilities such as:

```text
SEO
Photography
Video Production
Lead Generation
```

here.

Those belong under Services.

---

# 33. CONTEXT TAGS

Examples:

```text
B2B
B2C
B2B2C

Launch
Awareness
Growth
Conversion
Engagement
Acquisition
Retention

Corporate
Always-on
Transformation
Market Entry
Product Launch
Repositioning
```

AI assigns existing values only.

Unknown taxonomy:

```text
taxonomySuggestions[]
```

for human review.

---

# 34. CLIENTS

Fields:

```text
name
slug if required
logo
websiteURL

shortDescription
longDescription

industries[]

location

featured
displayOrder

sourceReferences[]
aiMeta

translationStatus
dirtyLocales
reviewStatus

SEO
OpenGraph

_status
```

No initial standalone Client public route.

Private CRM data belongs in a separate restricted collection if introduced later.

---

# 35. PROJECTS

Core:

```text
title                  localized
slug                   localized
client
year
location
externalURL
featured
displayOrder
shortStatement         localized
excerpt                localized
```

Classification:

```text
services[]
industries[]
projectTypes[]
contextTags[]
taxonomySuggestions[]
```

Narrative:

```text
challenge              localized
approach               localized
deliverables           localized
outcome                localized
resultsNote            localized
```

Media:

```text
heroMedia
featuredMedia
gallery[]
```

Metrics:

```text
metrics[]:
  value
  label localized
  sourceNote
```

Proof:

```text
relatedTestimonials[]
```

Editorial:

```text
sourceReferences[]
aiMeta
translationStatus
dirtyLocales
reviewStatus
_status
```

SEO:

```text
meta
OpenGraph
robots
```

---

# 36. PROJECT METRIC POLICY

AI never invents:

```text
revenue
sales
conversion
traffic
leads
ROAS
growth %
awards
satisfaction scores
```

Metric requires:

```text
source
```

Unsupported value:

```text
empty
```

not:

```text
estimated plausible number
```

---

# 37. TESTIMONIALS

Fields:

```text
internalTitle

originalQuote
originalLocale
translatedQuote localized if required

personName
personRole
organizationName

client
project

personPhoto
organizationLogo

sourceReference

featured
displayOrder

aiMeta
translationStatus
dirtyLocales
reviewStatus
_status
```

Rules:

```text
source required
attribution required
original wording preserved
AI may not invent testimonial
```

A translated testimonial must not be represented as if that language was the original wording.

---

# 38. MEDIA

Fields:

```text
alt localized
caption localized

credit
copyrightOwner
usageRights
usageExpiration
clientApproved
source
internalNotes
```

Production uses persistent object storage.

Preferred starting adapter:

```text
Vercel Blob
```

Architecture must remain portable to:

```text
S3
Cloudflare R2
```

Image variants:

```text
logo
thumbnail
projectCard
projectFeature
hero
openGraph
portrait
```

---

# 39. SITE SETTINGS

Global:

```text
companyName
shortName
siteURL

tagline localized

primaryEmail
primaryPhone
address localized

socialLinks

organizationLogo

defaultSEO localized
defaultOGImage

copyrightText localized

analytics public configuration
```

Never store secrets in editable Payload Globals.

---

# 40. NAVIGATION

Global manages:

```text
primaryNavigation
footerNavigation
legalNavigation
```

Labels localized.

Targets structured.

No arbitrary HTML.

---

# 41. HOMEPAGE GLOBAL

Fields:

```text
heroEyebrow
heroHeading
heroBody

primaryCTA
secondaryCTA

featuredClients
featuredProjects
featuredIndustries
featuredTestimonials

methodHeading
methodIntro

closingCTA

SEO
OpenGraph

translationStatus
dirtyLocales
reviewStatus
_status
```

Text fields localized.

---

# 42. SERVICES GLOBAL

```text
eyebrow
heading
intro

featuredProjects

closingCTA

SEO
OpenGraph

translationStatus
dirtyLocales
reviewStatus
_status
```

---

# 43. WORK GLOBAL

```text
eyebrow
heading
intro

closingCTA

SEO
OpenGraph

translationStatus
dirtyLocales
reviewStatus
_status
```

---

# 44. COMPANY GLOBAL

```text
eyebrow
heading
intro

whoWeAre
whatWeBelieve
howWeWork

selectedClients
selectedIndustries
selectedTestimonials

closingCTA

SEO
OpenGraph

translationStatus
dirtyLocales
reviewStatus
_status
```

---

# 45. CONTACT GLOBAL

```text
eyebrow
heading
intro

directContact
officeLocation
formIntro
closingText

SEO
OpenGraph

translationStatus
dirtyLocales
reviewStatus
_status
```

---

# 46. SEO OWNERSHIP

Payload manages:

```text
SEO title
SEO description
SEO image

OpenGraph title
OpenGraph description
OpenGraph image

noIndex
noFollow
```

Use Payload SEO plugin.

Next.js renders technical metadata.

---

# 47. CANONICAL OWNERSHIP

Canonical URLs are **not normal editorial copy**.

Normal canonical URLs must be generated automatically from:

```text
production domain
+
locale
+
actual public route
+
localized slug
```

Do not let AI manually author canonicals.

---

# 48. CANONICAL RULE

Every publicly indexable language page is self-canonical.

```text
/fr/... → canonical /fr/...

/en/... → canonical /en/...

/es/... → canonical /es/...
```

Never:

```text
/en/... → canonical /fr/...

/es/... → canonical /fr/...
```

---

# 49. CANONICAL URL SERVICE

Centralize:

```text
src/services/seo/urls.ts
src/services/seo/canonical.ts
src/services/seo/hreflang.ts
```

The same route builder is used by:

```text
canonical
hreflang
language switcher
sitemap
internal links
OG URL
redirects
```

Never maintain independent URL logic for each subsystem.

---

# 50. PRODUCTION HOST

Canonical host:

```text
https://globalcomm.ma
```

Never canonicalize to:

```text
localhost
preview.vercel.app
staging domain
CMS alias
```

---

# 51. ROOT CANONICAL BEHAVIOR

`/` redirects to default locale.

Initial:

```text
/
→ /fr
```

`/` does not render duplicate public content.

Localized homes:

```text
/fr
/en
/es
```

each self-canonicalize.

---

# 52. QUERY PARAMETERS

Canonical must strip:

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
gclid
fbclid
```

Tracking URL:

```text
/en/work/project?utm_source=linkedin
```

canonical:

```text
/en/work/project
```

---

# 53. WORK FILTER CANONICALS

Examples:

```text
/fr/work?service=branding

/en/work?industry=fmcg

/es/work?type=website-platform
```

Default:

```text
canonical → locale Work archive

robots → noindex, follow
```

If an audience deserves indexation, create a substantive landing page instead.

---

# 54. TRAILING SLASH

Use one policy.

Preferred:

```text
no trailing slash
```

Redirect non-preferred variants.

---

# 55. HOST NORMALIZATION

Canonical host:

```text
globalcomm.ma
```

Redirect:

```text
HTTP → HTTPS
www → non-www
```

Use the same host in:

```text
canonical
hreflang
sitemap
OpenGraph
JSON-LD
internal links
```

---

# 56. CANONICAL OVERRIDE

Optional advanced:

```text
canonicalOverride
```

Available only to:

```text
publisher
admin
```

AI cannot write it.

Validate:

```text
absolute HTTPS URL
valid syntax
trusted host by default
```

External canonical requires Admin.

---

# 57. OPENGRAPH URL

Normally:

```text
og:url == canonical URL
```

Do not generate conflicting URLs.

---

# 58. HREFLANG

Output alternates only for publicly approved localized versions.

Concept:

```text
FR page
├── fr alternate
├── en alternate if public
└── es alternate if public
```

Do not output hreflang for:

```text
missing
ai_draft
needs_review
noIndex
```

Use reciprocal alternates.

---

# 59. X-DEFAULT

Use `x-default` for the neutral/default entry behavior where appropriate.

Do not make the root URL canonical for every language.

---

# 60. LOCALIZED SLUGS

Dynamic slugs are localized.

Example:

```text
/fr/services/strategie-de-marque

/en/services/brand-strategy

/es/services/estrategia-de-marca
```

Enforce uniqueness per:

```text
collection
+
locale
+
route namespace
```

---

# 61. LANGUAGE SWITCHER

Display:

```text
FR
EN
ES
```

Switch using equivalent entity + localized slug.

Never blindly replace only the locale segment when the localized slug differs.

If translation unavailable:

```text
do not link to 404
```

---

# 62. UI DICTIONARIES

Small application strings belong in typed dictionaries.

Examples:

```text
Menu
Close
Next
Previous
View project
Filters
All
Submit
form errors
```

Business/editorial copy belongs in Payload.

---

# 63. TERMINOLOGY GLOSSARY

Maintain approved multilingual terminology.

Example:

```text
Lead Generation

FR:
Génération de leads

EN:
Lead Generation

ES:
Generación de leads
```

AI translation uses approved terminology before drafting.

---

# 64. AI TRANSLATION TOOL

Required MCP tool:

```text
translateContent
```

Inputs:

```text
collection
documentID
sourceLocale
targetLocale
fields optional
```

Workflow:

```text
read source
→ read glossary
→ translate localized fields
→ preserve shared facts
→ preserve metrics
→ preserve relationships
→ prepare target SEO
→ set target translation status AI draft
→ add targetLocale to dirtyLocales
→ save draft
```

---

# 65. AI TRANSLATION SAFETY

Must not:

```text
invent facts
alter metric values
change client identity
change evidence
create taxonomy
approve
publish
```

Human remains translation authority.

---

# 66. SEO FALLBACK

Localized title:

```text
explicit SEO title
→ localized entity title + site name
→ localized site default
```

Localized description:

```text
explicit SEO description
→ localized excerpt
→ localized site default
```

OG title:

```text
explicit OG
→ SEO title
→ entity title
```

OG description:

```text
explicit OG
→ SEO description
→ excerpt
```

OG image:

```text
explicit OG image
→ hero image
→ default OG image
```

No textual cross-language fallback publicly.

---

# 67. METADATA RENDERING

Use centralized:

```text
resolvePageSEO({
  entity,
  locale,
  route
})
```

Return:

```text
title
description
canonical
alternates
robots
openGraph
twitter
```

Use Next.js metadata APIs.

---

# 68. SITEMAP

Include only canonical, indexable, publicly approved localized routes.

Exclude:

```text
drafts
preview
admin
API
MCP
missing translations
unapproved translations
noIndex
redirect sources
filter query combinations
private collections
```

Every sitemap URL must equal the canonical URL exactly.

---

# 69. ROBOTS

Production:

```text
normal public indexing according to SEO flags
```

Preview/staging:

```text
noindex
```

---

# 70. REDIRECTS

Use Payload Redirects plugin.

Payload manages redirect records.

Next.js performs HTTP redirect behavior.

Support:

```text
301
302
```

Published slug change requires redirect handling.

---

# 71. STRUCTURED DATA

Generate from verified Payload content.

Use where applicable:

```text
Organization
ProfessionalService
BreadcrumbList
```

Never invent:

```text
ratings
review counts
awards
offers
```

---

# 72. PUBLIC SITE ROUTES

```text
/{locale}

/{locale}/services
/{locale}/services/[slug]

/{locale}/work
/{locale}/work/[slug]

/{locale}/industries/[slug]

/{locale}/company

/{locale}/contact
```

No standalone initial routes for:

```text
Clients
Testimonials
Project Types
Context Tags
```

---

# 73. HOMEPAGE ANATOMY

```text
01 Hero
02 Selected Clients
03 What We Do
04 Selected Work
05 Method
06 Industries / Capabilities
07 Testimonials
08 Closing CTA
09 Footer
```

Next.js owns composition.

Payload owns content.

---

# 74. HERO DIRECTION

Initial content direction:

```text
GLOBAL COMMUNICATION CORPORATE™

Strategy.
Creative.
Growth.

Integrated communication and marketing for organizations that need stronger brands, campaigns and digital growth systems.

View our work

Start a project
```

Final copy localized and Payload-managed.

---

# 75. SERVICES PAGE

```text
Hero
Five Service Pillars
Child Capabilities
Selected Work
Method
CTA
```

---

# 76. SERVICE DETAIL

```text
Service Hero
Client Problem
What We Do
Child Capabilities
Selected Work
Relevant Industries
Approach
Deliverables
Outcomes
CTA
```

Hide empty sections.

---

# 77. WORK ARCHIVE

```text
Hero
Filters
Project Grid
CTA
```

Filters:

```text
Service
Industry
Project Type
```

URL search params.

Server-rendered first.

Client enhancement optional.

---

# 78. PROJECT DETAIL

```text
Project Hero
Metadata
Challenge
Approach
Visual Work
Deliverables
Outcome
Verified Metrics
Related Services
Related Projects
Related Testimonial
CTA
```

---

# 79. INDUSTRY DETAIL

```text
Hero
Industry Challenges
Relevant Capabilities
Selected Projects
Related Services
CTA
```

No thin SEO pages.

---

# 80. COMPANY

```text
Hero
Who We Are
What We Believe
How We Work
Capabilities
Selected Clients
Industries
Testimonials
CTA
```

---

# 81. CONTACT

Fields:

```text
Name *
Company *
Email *
Phone
Website
Project Type
Estimated Budget
Desired Start
Message *
Consent *
```

Server-side validation.

Store privately in:

```text
inquiries
```

No MCP access.

---

# 82. DESIGN DIRECTION

```text
Corporate
Editorial
Strategic
Precise
Premium
Restrained
Modern
Confident
```

Avoid:

```text
generic SaaS
glassmorphism
rounded-card overload
neon
startup gradients
AI clichés
floating blobs
dashboard design
```

---

# 83. DESIGN TOKENS

```css
--gc-white: #ffffff;
--gc-black: #000000;
--gc-blue: #0000ff;
--gc-surface: #f5f5f2;
--gc-secondary: #5f5f5f;
--gc-border: rgba(0, 0, 0, 0.15);
```

Typography direction:

```text
Inter
Lora
JetBrains Mono
```

Geometry:

```text
0–4px radius
hairline borders
large whitespace
strong grid
minimal shadows
```

---

# 84. DATA ACCESS

Frontend Server Components use Payload Local API.

Centralize queries:

```text
src/services/cms/
```

Components do not contain arbitrary raw Payload queries.

Prefer:

```text
explicit select
minimal depth
indexed filtering
pagination
stable ordering
```

Avoid N+1 behavior.

---

# 85. CRITICAL LOCAL API SECURITY

Payload Local API may bypass access control by default.

Therefore request-facing operations must explicitly use:

```text
overrideAccess: false
```

Authenticated operations must pass user context.

`overrideAccess: true` is limited to explicitly trusted internal scripts such as:

```text
seed
migration
controlled maintenance
```

---

# 86. CACHING

Use current supported Next.js caching APIs.

Public content may be cached.

Revalidate affected routes only.

Locale-specific content change:

```text
invalidate changed locale
```

Shared relationship/media change:

```text
invalidate all affected locales
```

Centralize revalidation.

---

# 87. PREVIEW

Implement:

```text
Payload Preview
Next.js Draft Mode
Payload Live Preview where appropriate
```

Preview must:

```text
require validation
be noindex
use correct locale
use localized slug
never leak anonymous drafts
```

---

# 88. POSTGRESQL

Use:

```text
@payloadcms/db-postgres
```

Recommended managed DB:

```text
Neon Postgres
```

or compatible alternative.

Use TLS and serverless-safe pooling.

---

# 89. DATABASE MIGRATIONS

Production schema changes require migrations.

Workflow:

```text
change schema
→ generate migration
→ inspect migration
→ test migration
→ commit migration
→ acquire production deployment lock
→ execute migration
→ verify
→ deploy compatible application
```

Never use uncontrolled production schema push.

---

# 90. MEDIA STORAGE

Use persistent object storage.

Preferred initial:

```text
Vercel Blob
```

Never rely on deployment filesystem.

Validate:

```text
MIME
extension
size
filename
```

---

# 91. ENVIRONMENT VARIABLES

Typical:

```text
DATABASE_URI
PAYLOAD_SECRET
NEXT_PUBLIC_SERVER_URL
BLOB_READ_WRITE_TOKEN
PREVIEW_SECRET
MCP_ENABLED
SENTRY_DSN optional
```

Never expose secrets using:

```text
NEXT_PUBLIC_*
```

---

# 92. MCP SERVER

Use Payload MCP plugin.

Endpoint:

```text
/api/mcp
```

Authentication:

```text
Authorization: Bearer <API KEY>
```

Create:

```text
AI Content Editor
role = ai_editor
```

Separate keys where practical:

```text
Claude Production
Claude Staging
ChatGPT Production
```

---

# 93. MCP PERMISSION STRATEGY

Generic `find` may be available for editorial collections.

Do not expose unrestricted generic delete.

Prefer custom write tools over broad generic create/update for core content.

---

# 94. AI CONTENT OPERATIONS BOUNDARY

Required:

```text
MCP TOOL
    ↓
CONTENT OPERATIONS SERVICE
    ↓
validation
permissions
field whitelist
state machine
locale logic
evidence rules
provenance
conflict detection
    ↓
PAYLOAD
```

Business rules do not live only in MCP handlers.

---

# 95. REQUIRED AI TOOLS

```text
draftClient
draftProject
draftTestimonial
classifyProject
translateContent
prepareSEO
auditContent
submitForReview
```

---

# 96. draftClient

Must:

```text
find possible existing client
avoid duplicates
assign existing Industry
store sources
store provenance
force draft
mark AI draft
never publish
```

---

# 97. draftProject

Must:

```text
resolve Client
validate relationships
assign controlled taxonomy
write taxonomySuggestions when needed
write supported narrative
store evidence
store provenance
force draft
never invent metrics
never publish
```

---

# 98. draftTestimonial

Must:

```text
require source
require supported attribution
preserve original wording
force draft
never publish
```

---

# 99. classifyProject

Can modify:

```text
services
industries
projectTypes
contextTags
taxonomySuggestions
aiMeta
```

Cannot rewrite unrelated fields.

---

# 100. prepareSEO

Can update:

```text
SEO title
SEO description
OG title
OG description
OG image
robots when appropriate
```

Cannot set:

```text
canonicalOverride
```

Cannot invent claims.

---

# 101. auditContent

Read-only.

Identify:

```text
missing SEO
missing OG
missing media
missing Client
missing Industry
missing Service
missing Project Type
missing outcome
missing proof
missing source
missing translations
unreviewed AI drafts
```

---

# 102. submitForReview

Allowed:

```text
ai_draft → needs_review

revision_requested → needs_review
```

Never:

```text
→ approved
```

---

# 103. MCP TOOL SECURITY

Every custom tool:

```text
validates schema
uses req.user
uses overrideAccess: false
whitelists fields
never logs bearer tokens
never returns password/hash/salt
writes AI audit record
returns structured errors
```

Never send raw model-generated objects directly to unrestricted Payload mutation methods.

---

# 104. CLAUDE AND CHATGPT

Both use the same remote MCP architecture.

```text
Claude ──┐
         ├── Payload MCP
ChatGPT ─┘
```

Do not build a separate ChatGPT CMS.

If a specific ChatGPT plan/client cannot execute remote MCP write operations, keep the architecture unchanged.

Do not weaken security to accommodate client limitations.

---

# 105. AI EVIDENCE POLICY

Supported fact:

```text
may write
```

Unsupported fact:

```text
leave empty
```

Never fabricate:

```text
client
testimonial
metric
outcome
award
certification
partnership
office
team member
```

Prefer incomplete truth to invented completeness.

---

# 106. AI PROVENANCE

```text
aiMeta:
  generatedByAI
  provider
  model
  operation
  generatedAt
  runId
  actorUser
  sourceLocale
  targetLocale
  lastAIUpdate
```

Never store hidden chain-of-thought.

---

# 107. SOURCE REFERENCES

```text
sourceReferences[]:
  type
  label
  url optional
  note optional
  capturedAt
```

Types:

```text
user_provided
uploaded_document
existing_cms
public_url
human_verified
```

---

# 108. AI AUDIT LOGS

Private collection:

```text
ai-audit-logs
```

Fields:

```text
timestamp
actor
key reference
tool
action
target collection
target document
result
correlation ID
changed fields
locale
error code
```

Never store real API keys or passwords.

---

# 109. TAXONOMY GOVERNANCE

Only authorized humans may:

```text
create
rename
merge
delete
modify aliases
modify internal definition
```

AI only:

```text
assign existing
suggest new
```

---

# 110. CONTENT COMPLETENESS

Score:

```text
identity
classification
narrative
media
proof
SEO
translations
review
```

Example:

```text
PROJECT X

FR
100% — Approved

EN
85%
Missing OG description

ES
55%
Missing:
Approach
Outcome
SEO
```

Never fabricate to improve completeness score.

---

# 111. IDEMPOTENCY

Client match order:

```text
explicit ID
domain
normalized exact company name
```

Ambiguous:

```text
return ambiguity
```

Do not fuzzy-merge silently.

---

# 112. CONCURRENCY

AI must not overwrite current human work blindly.

Before mutation:

```text
read current record
check version/state
write intended fields only
```

If content has become approved/published or version changed incompatibly:

```text
reject conflict
```

---

# 113. FIELD WHITELISTS

Each AI tool owns an explicit set of writable fields.

Never allow a generic AI payload to update the entire document.

---

# 114. SENSITIVE DATA

Do not expose via MCP:

```text
Inquiry PII
passwords
hashes
tokens
secrets
financial private data
commercial private notes
```

---

# 115. CONTACT SECURITY

Validate server-side.

Protect against:

```text
malformed input
oversized requests
spam
duplicate flooding
header injection
```

---

# 116. SERVER COMPONENTS

Use Server Components by default.

Client Components only for:

```text
mobile navigation
interactive filters
live preview
forms
small animation
```

---

# 117. PERFORMANCE

Prioritize:

```text
minimal JavaScript
server rendering
optimized images
stable layout
lazy below-fold assets
minimal dependency weight
```

No heavy animation framework without demonstrated need.

---

# 118. ACCESSIBILITY

Target WCAG 2.2 AA principles.

Require:

```text
semantic landmarks
heading hierarchy
keyboard navigation
visible focus
skip link
labels
accessible errors
alt text
reduced motion
contrast
correct link/button semantics
```

---

# 119. SECURITY MODEL

Threat boundaries:

```text
public visitor
AI MCP client
editor
publisher
admin
database
object storage
Vercel runtime
```

Use least privilege throughout.

---

# 120. SECURITY HEADERS

Evaluate:

```text
Content-Security-Policy
Strict-Transport-Security
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

Test compatibility with Payload Admin and Live Preview.

---

# 121. ERROR HANDLING

Implement:

```text
error.tsx
not-found.tsx
safe CMS failure states
structured logs
```

No raw stack traces in production.

---

# 122. OBSERVABILITY

Log:

```text
server errors
MCP failures
migration failures
revalidation failures
contact failures
```

Use correlation IDs.

Optional Sentry integration allowed.

---

# 123. JOBS

Use jobs only for:

```text
bulk audits
batch AI enrichment
large media processing
scheduled checks
future embeddings
slow external integrations
```

Ordinary CMS writes remain synchronous.

---

# 124. TRANSACTIONS

Related mutations should share transaction context when supported.

Avoid:

```text
Project saved
Audit log failed
```

partial states when atomic behavior is possible.

---

# 125. PUBLIC READ POLICY

Normal public reads:

```text
draft: false
overrideAccess: false
locale: requestedLocale
fallbackLocale: false
```

Then enforce:

```text
isLocalePublic()
```

---

# 126. SEEDING

Seed idempotently:

```text
Services
Industries
Project Types
Context Tags
Globals
Navigation defaults
```

Do not seed fake:

```text
Clients
Testimonials
Results
Awards
```

---

# 127. TESTING PYRAMID

Required:

```text
Static analysis
Unit
Integration
MCP Contract
E2E
Accessibility
Production smoke
```

---

# 128. UNIT TESTS

Test:

```text
roles
state transitions
publish guard
translation readiness
dirtyLocales
locale validation
taxonomy rules
slug logic
SEO fallbacks
canonical builder
hreflang
language switcher
completeness
AI evidence policy
AI whitelists
```

---

# 129. INTEGRATION TESTS

Prove:

```text
AI can draft

AI cannot publish
AI cannot approve
AI cannot delete

Editor cannot publish

Publisher cannot publish unapproved

Publisher cannot publish when a dirty locale is unapproved

Publisher can publish approved draft

anonymous sees published only

FR query returns FR
EN query returns EN
ES query returns ES

fallbackLocale false works

translation changes target locale only

relationships remain shared

testimonial requires source

metric requires evidence

Inquiry is private
```

---

# 130. MCP CONTRACT TESTS

```text
missing key → reject

invalid key → reject

valid AI key → allowed tools

AI draft → succeeds

AI publish → reject

AI approve → reject

AI delete → reject

AI taxonomy create → reject

AI Inquiry read → reject

invalid tool schema → reject

AI audit → created
```

---

# 131. E2E

Use Playwright.

Test:

```text
FR Home
EN Home
ES Home

FR/EN/ES Service

FR/EN/ES Project

Industry

Company

Contact

Work filters

mobile navigation

language switcher

canonical

hreflang

metadata

redirect

404

preview

draft invisibility
```

---

# 132. CANONICAL TESTS

Assert:

```text
one canonical per indexable page

canonical absolute

canonical HTTPS

canonical production host

localized page self-canonical

cross-language canonical false

localized slug used

tracking params removed

preview domain absent

OG URL equals canonical

sitemap URL equals canonical
```

---

# 133. HREFLANG TESTS

Assert:

```text
only public translations appear

reciprocal alternates

correct localized URLs

missing translation absent

unapproved translation absent
```

---

# 134. CI

Required PR gate:

```text
pnpm install --frozen-lockfile
↓
environment validation
↓
lint
↓
typecheck
↓
unit tests
↓
integration tests
↓
MCP contract tests
↓
production build
↓
Vercel Preview
↓
E2E
```

Failure means PR is not ready.

---

# 135. PRODUCTION DEPLOYMENT

```text
Approved PR
↓
Merge
↓
Acquire migration/deployment lock
↓
Validate environment
↓
Run migrations
↓
Verify migration status
↓
Deploy Vercel
↓
Production smoke tests
↓
Release
```

Preview builds never run production migrations.

---

# 136. DEFINITION OF DONE

Feature complete only when:

```text
requirements satisfied
TypeScript clean
lint clean
tests updated
tests passing
build passing
migration committed when required
permissions tested
multilingual behavior tested
empty states tested
responsive tested
no known critical errors
no secret committed
```

---

# 137. RELEASE CHECKLIST

```text
[ ] Production env correct
[ ] DB reachable
[ ] Storage working
[ ] Payload Admin working
[ ] Payload secret strong

[ ] Migrations applied

[ ] FR site works
[ ] EN site works
[ ] ES site works

[ ] Canonicals correct
[ ] Hreflang correct
[ ] Sitemap correct
[ ] Robots correct
[ ] OG correct
[ ] Redirects correct

[ ] Draft hidden publicly
[ ] Preview works

[ ] Invalid MCP key rejected
[ ] AI draft works
[ ] AI publish rejected
[ ] AI delete rejected
[ ] AI taxonomy creation rejected

[ ] Contact works

[ ] Mobile works
[ ] Keyboard works

[ ] No critical console errors
[ ] No required test failure
[ ] No known secret leak
```

---

# 138. SYSTEM INVARIANTS

These are architectural laws:

```text
PAYLOAD_IS_CONTENT_SOURCE_OF_TRUTH = true

NEXTJS_IS_PRESENTATION_SOURCE_OF_TRUTH = true

MCP_IS_AI_CONTROL_PLANE = true

SUPPORTED_LOCALES = [fr, en, es]

PUBLIC_LOCALE_FALLBACK = false

PUBLIC_CONTENT_IS_PUBLISHED_ONLY = true

AI_CAN_PUBLISH = false

AI_CAN_APPROVE = false

AI_CAN_DELETE = false

AI_CAN_MANAGE_USERS = false

AI_CAN_CREATE_TAXONOMY = false

AI_CAN_SET_CANONICAL_OVERRIDE = false

AI_WRITES_REQUIRE_PROVENANCE = true

AI_METRICS_REQUIRE_EVIDENCE = true

AI_TESTIMONIALS_REQUIRE_SOURCE = true

LOCALIZED_PAGES_SELF_CANONICALIZE = true

CROSS_LANGUAGE_CANONICALIZATION = false

CANONICAL_USES_HTTPS = true

CANONICAL_USES_PRODUCTION_HOST = true

TRACKING_PARAMS_IN_CANONICAL = false

PREVIEW_HOST_IN_CANONICAL = false

OG_URL_EQUALS_CANONICAL = true

SITEMAP_CONTAINS_CANONICAL_URLS_ONLY = true

HREFLANG_ONLY_FOR_PUBLIC_TRANSLATIONS = true

HUMAN_IS_FINAL_PUBLISHER = true
```

Automate tests around them.

---

# 139. EMPTY STATES

No testimonials:

```text
hide section
```

No related work:

```text
hide section
```

No Client logo:

```text
show Client name
```

No Project image:

```text
use intentional typography
```

No metric:

```text
hide metric
```

No OG image:

```text
use defined fallback
```

No translation:

```text
do not fabricate fallback page
```

---

# 140. CODING STANDARD

TypeScript:

```text
strict
generated Payload types
minimal any
no casual ts-ignore
```

React:

```text
server-first
composition
clear props
```

Payload:

```text
modular configs
central access controls
small hooks
domain services for business logic
```

CSS:

```text
tokens
responsive
controlled specificity
```

---

# 141. DEPENDENCY DISCIPLINE

Before installing:

```text
Does Next/Payload already solve this?

Is package maintained?

Does it reduce complexity?

Does it add browser weight?

Can a small internal utility solve it?
```

Avoid dependency inflation.

---

# 142. GLOBAL COMM POSITIONING

Public category:

```text
Integrated Communication & Marketing Agency
```

Capabilities:

```text
Strategy
Branding
Creative & Content
Digital Marketing
Web & Technology
```

Communication order:

```text
1. Client need
2. Service
3. Proof
4. Method
```

Internal method:

```text
Understand
→ Diagnose
→ Strategize
→ Create
→ Execute
→ Measure
→ Optimize
```

---

# 143. BRAND VOICE

Use:

```text
Corporate
Strategic
Clear
Human
Confident
Institutional where appropriate
Commercial without hype
```

Avoid:

```text
revolutionary
game-changing
one-stop shop
cutting-edge 360°
we are passionate about
generic AI copy
```

---

# 144. CLAUDE CODE EXECUTION PROTOCOL

Before coding:

```text
1. Read entire CLAUDE.md
2. Inspect repository
3. Inspect package versions
4. Verify current Payload compatibility
5. Run baseline lint/typecheck/build/tests
6. Record existing failures
7. Preserve useful code
8. Do not delete code before understanding it
```

Then execute phases.

---

# 145. PHASE 0 — AUDIT

Report:

```text
repository state
dependency versions
compatibility
baseline build
baseline tests
architecture risks
```

---

# 146. PHASE 1 — FOUNDATION

Implement:

```text
Next.js
Payload
Postgres
Payload Admin
environment validation
storage
route groups
i18n config
test harness
```

Gate:

```text
typecheck
build
CMS boot
```

---

# 147. PHASE 2 — SECURITY

Implement:

```text
Users
Roles
Access Control
AI role
```

Gate:

```text
role tests
```

---

# 148. PHASE 3 — CONTENT MODEL

Implement:

```text
Media
Services
Industries
Project Types
Context Tags
Clients
Projects
Testimonials
Globals

Localization
SEO

Drafts
Versions

translationStatus
dirtyLocales
```

Generate migration.

Gate:

```text
schema integration tests
migration test
```

---

# 149. PHASE 4 — EDITORIAL WORKFLOW

Implement:

```text
reviewStatus
translation review
locale readiness
publish guard
Admin UX
```

Gate:

```text
AI publish impossible
Editor publish impossible
unapproved dirty locale blocks publish
approved draft publishes
```

---

# 150. PHASE 5 — DATA SERVICES

Implement:

```text
central Payload Local API services

localized public queries

published-only behavior

normalization

route builders

canonical builder

metadata resolver
```

---

# 151. PHASE 6 — FRONTEND

Build complete:

```text
Home
Services
Service detail
Work
Project detail
Industry
Company
Contact
```

for:

```text
fr
en
es
```

---

# 152. PHASE 7 — PREVIEW

Implement:

```text
Draft Mode
Payload Preview
Live Preview
locale-aware preview
```

---

# 153. PHASE 8 — MCP / AI

Implement:

```text
Payload MCP
AI API keys
Content Operations layer
custom tools
translation tool
audit logs
```

Gate:

```text
AI draft succeeds
AI translation succeeds
AI publish fails
AI approve fails
AI delete fails
```

---

# 154. PHASE 9 — SEO

Implement:

```text
metadata
canonical
hreflang
OG
sitemap
robots
redirects
JSON-LD
```

Gate:

```text
multilingual SEO tests
```

---

# 155. PHASE 10 — HARDENING

Perform:

```text
security review
accessibility review
performance review
error handling review
browser QA
data integrity review
```

---

# 156. PHASE 11 — DEPLOYMENT

Configure:

```text
Vercel
Production Postgres
Storage
Environment separation
Migrations
Preview
Production
Smoke tests
```

---

# 157. PHASE REPORTING

After every phase report:

```text
Completed
Files changed
Schema changes
Migration
Tests added
Commands executed
Results
Known risks
Next phase
```

Never claim execution that did not occur.

---

# 158. BUG PROTOCOL

When a bug occurs:

```text
reproduce
→ isolate
→ regression test
→ root-cause fix
→ targeted test
→ affected suite
→ regression verification
```

Never delete tests simply to obtain green CI.

---

# 159. FINAL ERROR BUDGET

Final handoff:

```text
0 known P0
0 known P1
0 known core P2

0 TypeScript errors
0 build errors
0 failed required tests

0 known auth bypass
0 known AI publish bypass
0 known public draft leak

0 known canonical errors
0 known hreflang cluster errors

0 known secret exposure
```

---

# 160. FINAL SYSTEM MODEL

```text
                        HUMAN
                          │
                    Review / Publish
                          │
                          ▼
                     PAYLOAD
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
         FR              EN              ES
          │               │               │
          └───────────────┼───────────────┘
                          │
             ┌────────────┴────────────┐
             │                         │
         LOCAL API                    MCP
             │                         │
             ▼                  ┌──────┴───────┐
          NEXT.JS             CLAUDE        CHATGPT
             │                  │              │
             │                  └──────┬───────┘
             │                         │
             │                    draft only
             │                         │
             └────────────┬────────────┘
                          │
                          ▼
                       PAYLOAD
                          │
               ┌──────────┴──────────┐
               ▼                     ▼
           PostgreSQL           Object Storage

                          │
                          ▼
                        VERCEL
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
         /fr/...        /en/...        /es/...
```

---

# 161. FINAL ENGINEERING PHILOSOPHY

Build this platform so that:

> **Payload is Global Comm's structured operational memory.**

> **Next.js is Global Comm's public brand experience.**

> **Claude and ChatGPT are controlled multilingual editorial operators.**

> **The human remains the final publishing authority.**

Prefer:

```text
correct over clever

explicit over magical

structured over improvised

evidence over invention

draft over fabrication

least privilege over convenience

small modules over monoliths

tests over confidence

migration discipline over production guessing
```

---

# 162. DOCUMENTATION VERIFICATION

Before implementation, Claude Code must verify the current official documentation for:

```text
Payload ↔ Next.js compatibility
Payload installation
Payload Postgres
Payload Local API
Payload Local API access control
Payload Localization
Payload Drafts
Payload Versions
Payload Access Control
Payload MCP
Payload SEO
Payload Redirects
Payload object storage
Payload migrations
Payload Preview
Payload Live Preview

Next.js Metadata
Next.js alternates/canonical
Next.js Draft Mode
Next.js caching
Next.js revalidation

Vercel environment behavior
Vercel Preview deployments
Vercel storage/runtime limits
```

If APIs have evolved:

```text
adapt implementation to current supported APIs
```

but:

```text
do not change the fundamental architecture
```

without explicit human approval.

---

# 163. CANONICAL DECISION SUMMARY

```text
Frontend:
Next.js App Router

Deployment:
Vercel

CMS:
Payload

Database:
PostgreSQL

Preferred DB:
Neon or equivalent

Media:
Persistent object storage

Frontend ↔ CMS:
Payload Local API

AI ↔ CMS:
Payload MCP

AI role:
Draft Editor

AI Publish:
Forbidden

Human Review:
Required

Human Publish:
Required

Languages:
French
English
Spanish

Locales:
fr
en
es

Initial Default Locale:
fr

Public Translation Fallback:
Disabled

Localized Entity Slugs:
Yes

SEO:
Payload-managed

OpenGraph:
Payload-managed

Canonical:
Computed by Next.js

Canonical Model:
Self-canonical per language

Cross-Language Canonical:
Forbidden

Hreflang:
Required

Taxonomy:
Controlled Payload Collections

Repository:
Single repository

Application:
Single Next.js + Payload application

Canonical Project Authority:
CLAUDE.md
```

---

# END OF CANONICAL SPECIFICATION

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
