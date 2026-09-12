import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ExpertiseList } from '@/components/design-preview/ExpertiseList'
import { FaqAccordion } from '@/components/design-preview/FaqAccordion'
import { Pending } from '@/components/design-preview/Pending'
import { ProjectSlot } from '@/components/design-preview/ProjectSlot'
import { PreviewFooter } from '@/components/design-preview/PreviewFooter'
import { PreviewHeader } from '@/components/design-preview/PreviewHeader'
import { homeHalbert, PRICING_PUBLICLY_VALIDATED } from '@/content/homeHalbert'

export const metadata: Metadata = {
  title: 'Global Comm — maquette Home',
  robots: { index: false, follow: false },
}

const { meta, hero, positioning, expertise, work, approach, proof, faq, closing } = homeHalbert

/** Libellé de section : petite capitale, jamais un titre de niveau. */
function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={
        'text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground ' + (className ?? '')
      }
    >
      {children}
    </p>
  )
}

export default function HomeDesignPreview() {
  return (
    <>
      <PreviewHeader nav={meta.nav} locales={meta.locales} cta={meta.headerCTA} />

      <main id="main">
        {/* ---- 01 Hero — blanc, asymétrique ------------------------------ */}
        <section className="border-b border-border bg-background">
          <div className="mx-auto w-full max-w-[80rem] px-5 pb-16 pt-14 sm:px-8 md:pb-24 md:pt-20 lg:px-12">
            <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <Kicker>{hero.kicker}</Kicker>
                <h1 className="mt-6 max-w-[16ch] text-[2.5rem] font-semibold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]">
                  {hero.title}
                </h1>
                <div className="mt-8 max-w-[60ch] space-y-4">
                  {hero.body.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-relaxed text-muted-foreground md:text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <Button asChild size="lg">
                    <Link href={hero.primaryCTA.href}>{hero.primaryCTA.label}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href={hero.secondaryCTA.href}>{hero.secondaryCTA.label}</Link>
                  </Button>
                </div>
                <p className="mt-5 max-w-[48ch] text-sm text-muted-foreground">{hero.reassurance}</p>
              </div>

              {/* La confirmation visuelle reste un emplacement : aucune
                  photographie réelle n'est disponible. */}
              <div className="lg:col-span-5">
                <Pending label={hero.visual.pending} className="aspect-[4/5] w-full" />
                <div className="mt-px border border-t-0 border-border bg-muted p-6">
                  <Kicker>{hero.overlay.label}</Kicker>
                  <ul className="mt-4 space-y-2">
                    {hero.overlay.items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-foreground">
                        <span aria-hidden className="text-primary">
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-16 border-t border-border pt-8 md:mt-20">
              <Kicker>{hero.proofLabel}</Kicker>
              <Pending label={hero.logos.pending} className="mt-5 min-h-28 items-start justify-center" />
            </div>
          </div>
        </section>

        {/* ---- 02 Positionnement — off-white, éditorial ------------------- */}
        <section className="border-b border-border bg-muted" aria-labelledby="positionnement">
          <div className="mx-auto w-full max-w-[80rem] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Kicker>{positioning.kicker}</Kicker>
                <h2
                  id="positionnement"
                  className="mt-6 max-w-[20ch] font-serif text-3xl leading-[1.15] tracking-[-0.01em] text-foreground md:text-[2.75rem]"
                >
                  {positioning.title}
                </h2>
              </div>
              <div className="max-w-[62ch] space-y-5 lg:col-span-7 lg:pt-14">
                {positioning.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-muted-foreground md:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Quatre principes séparés par de fines lignes. */}
            <ul className="mt-16 grid gap-x-10 md:mt-20 md:grid-cols-2 lg:grid-cols-4">
              {positioning.principles.map((principle) => (
                <li key={principle.title} className="border-t border-foreground pt-5 max-md:mt-8 max-md:first:mt-0">
                  <h3 className="text-base font-semibold text-foreground">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- 03 Expertises — blanc ------------------------------------- */}
        <section className="border-b border-border bg-background" aria-labelledby="expertises">
          <div className="mx-auto w-full max-w-[80rem] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
            <div className="max-w-[52ch]">
              <Kicker>{expertise.kicker}</Kicker>
              <h2
                id="expertises"
                className="mt-6 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-[2.75rem]"
              >
                {expertise.title}
              </h2>
              <div className="mt-8 space-y-4">
                {expertise.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <ExpertiseList
              items={expertise.items}
              scopeLabel={expertise.scopeLabel}
              outcomeLabel={expertise.outcomeLabel}
            />

            <div className="mt-14">
              <Button asChild variant="outline">
                <Link href={expertise.sectionCTA.href}>{expertise.sectionCTA.label}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ---- 04 Réalisations — off-white, un projet mis en avant -------- */}
        <section className="border-b border-border bg-muted" aria-labelledby="realisations">
          <div className="mx-auto w-full max-w-[80rem] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-6">
                <Kicker>{work.kicker}</Kicker>
                <h2
                  id="realisations"
                  className="mt-6 max-w-[20ch] text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-[2.75rem]"
                >
                  {work.title}
                </h2>
              </div>
              <div className="max-w-[58ch] space-y-4 lg:col-span-6 lg:pt-14">
                {work.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Échelle variée plutôt que trois tuiles identiques. Chaque carte
                reste un emplacement : aucun projet nommé dans le document. */}
            <div className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-3">
              <ProjectSlot
                slot="Projet 01"
                label={work.projects[0].pending}
                ctaLabel={work.itemCTALabel}
                className="min-h-[22rem] lg:col-span-2 lg:min-h-[30rem]"
              />

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
                {work.projects.slice(1).map((project, index) => (
                  <ProjectSlot
                    key={project.pending}
                    slot={`Projet 0${index + 2}`}
                    label={project.pending}
                    ctaLabel={work.itemCTALabel}
                    className="min-h-[16rem] lg:min-h-[14rem]"
                  />
                ))}
              </div>
            </div>

            <div className="mt-14">
              <Button asChild variant="outline">
                <Link href={work.sectionCTA.href}>{work.sectionCTA.label}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ---- 05 Notre approche — blanc, trois étapes -------------------- */}
        <section id="approche" className="border-b border-border bg-background scroll-mt-16" aria-labelledby="approche-titre">
          <div className="mx-auto w-full max-w-[80rem] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
            <div className="max-w-[48ch]">
              <Kicker>{approach.kicker}</Kicker>
              <h2
                id="approche-titre"
                className="mt-6 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-[2.75rem]"
              >
                {approach.title}
              </h2>
              {approach.body.map((paragraph) => (
                <p key={paragraph} className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            <ol className="mt-16 md:mt-20">
              {approach.steps.map((step) => (
                <li key={step.number} className="border-t border-border py-10 md:py-14">
                  <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-4">
                      <span
                        aria-hidden
                        className="block text-5xl font-semibold tabular-nums leading-none tracking-[-0.03em] text-primary md:text-6xl"
                      >
                        {step.number}
                      </span>
                      <h3 className="mt-5 max-w-[24ch] text-lg font-semibold leading-snug text-foreground">
                        {step.name}
                      </h3>
                    </div>

                    <div className="lg:col-span-5">
                      <p className="max-w-[30ch] font-serif text-xl leading-snug text-foreground md:text-2xl">
                        {step.promise}
                      </p>
                      <div className="mt-5 max-w-[56ch] space-y-4">
                        {step.body.map((paragraph) => (
                          <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-3">
                      <div className="border-t border-foreground pt-5">
                        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                          {approach.resultLabel}
                        </p>
                        <p className="mt-3 text-sm font-medium leading-relaxed text-foreground">{step.result}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- 06 Cadre et preuves — panneau sombre contenu --------------- */}
        <section className="border-b border-border bg-background" aria-labelledby="preuves">
          <div className="mx-auto w-full max-w-[80rem] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <Kicker>{proof.kicker}</Kicker>
                <h2
                  id="preuves"
                  className="mt-6 max-w-[18ch] text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-[2.75rem]"
                >
                  {proof.title}
                </h2>
              </div>
              <div className="max-w-[58ch] space-y-4 lg:col-span-7 lg:pt-4">
                {proof.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-12 grid gap-px border border-border bg-border md:mt-16 lg:grid-cols-12">
              {/* Le seul moment sombre de la page : il porte l'engagement. */}
              <div className="bg-foreground p-8 text-background md:p-12 lg:col-span-7">
                <ul className="space-y-px">
                  {proof.commitments.map((commitment, index) => (
                    <li
                      key={commitment}
                      className="flex items-baseline gap-5 border-t border-background/15 py-4 first:border-t-0 first:pt-0"
                    >
                      <span aria-hidden className="text-xs font-medium tabular-nums text-background/50">
                        0{index + 1}
                      </span>
                      <span className="text-base leading-relaxed">{commitment}</span>
                    </li>
                  ))}
                </ul>

                <Separator className="my-8 bg-background/20" />

                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-background/70">
                  {proof.pricing.title}
                </h3>
                <dl className="mt-6 space-y-6">
                  <div>
                    <dt className="text-sm text-background/60">{proof.pricing.recurring.label}</dt>
                    <dd className="mt-2">
                      {PRICING_PUBLICLY_VALIDATED ? (
                        <p className="text-base font-medium">{proof.pricing.recurring.text}</p>
                      ) : (
                        <Pending
                          label={proof.pricing.recurring.pending}
                          tone="inverted"
                          className="gap-2 p-4"
                        />
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-background/60">{proof.pricing.oneOff.label}</dt>
                    <dd className="mt-2 text-base font-medium">{proof.pricing.oneOff.text}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex flex-col bg-background p-8 md:p-12 lg:col-span-5">
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">
                  {proof.evidence.title}
                </h3>
                <div className="mt-5 space-y-4">
                  {proof.evidence.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <Pending label={proof.evidence.module.pending} className="mt-8 min-h-44 flex-1" />
              </div>
            </div>
          </div>
        </section>

        {/* ---- 07 FAQ — off-white ---------------------------------------- */}
        <section className="border-b border-border bg-muted" aria-labelledby="faq">
          <div className="mx-auto w-full max-w-[68rem] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
            <div className="max-w-[40ch]">
              <Kicker>{faq.kicker}</Kicker>
              <h2
                id="faq"
                className="mt-6 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground md:text-[2.75rem]"
              >
                {faq.title}
              </h2>
            </div>
            <FaqAccordion items={faq.items} />
          </div>
        </section>

        {/* ---- 08 CTA final — le moment bleu ------------------------------ */}
        <section className="bg-primary text-primary-foreground" aria-labelledby="cta-final">
          <div className="mx-auto w-full max-w-[80rem] px-5 py-20 sm:px-8 md:py-28 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.08em] text-primary-foreground/85">
                  {closing.kicker}
                </p>
                <h2
                  id="cta-final"
                  className="mt-6 max-w-[18ch] text-[2rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-4xl md:text-5xl lg:text-[3.5rem]"
                >
                  {closing.title}
                </h2>
              </div>

              <div className="lg:col-span-5 lg:pt-6">
                <div className="max-w-[54ch] space-y-4">
                  {closing.body.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-relaxed text-primary-foreground/85">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-background text-foreground hover:bg-foreground hover:text-background focus-visible:outline-background"
                  >
                    <Link href={closing.primaryCTA.href}>{closing.primaryCTA.label}</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/45 bg-transparent text-primary-foreground hover:border-primary-foreground hover:bg-transparent focus-visible:outline-background"
                  >
                    <Link href={closing.secondaryCTA.href}>{closing.secondaryCTA.label}</Link>
                  </Button>
                </div>
                <p className="mt-5 max-w-[52ch] text-sm text-primary-foreground/75">{closing.reassurance}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PreviewFooter />
    </>
  )
}
