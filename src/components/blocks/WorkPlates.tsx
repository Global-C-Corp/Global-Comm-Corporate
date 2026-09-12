import { AspectRatio } from '@/components/ui/aspect-ratio'

export function PikotaPlate() {
  return (
    <AspectRatio ratio={16 / 9}>
      <div className="relative h-full overflow-hidden bg-[#20352b] text-[#f3efe3]">
        <div className="absolute -left-16 -top-24 size-72 rounded-full border-[42px] border-[#506b51]/60" />
        <div className="absolute bottom-[-28%] right-[28%] size-72 rounded-full bg-[#d4d0c5]/20" />
        <div className="absolute right-8 top-8 font-[family-name:var(--font-geist-mono)] text-[0.58rem] uppercase tracking-[0.22em] text-[#f3efe3]/70">
          Natural food
          <br />
          Brand system
        </div>

        <div className="absolute bottom-8 left-[12%] flex items-end gap-5">
          <div className="relative h-52 w-36 rounded-[2px] bg-[#eee7d8] p-5 text-[#20352b] shadow-2xl">
            <p className="text-heading-24 font-semibold">PIKOTA</p>
            <p className="mt-8 text-copy-16 leading-tight">Good food.<br />Brighter days.</p>
            <span className="absolute bottom-5 left-5 h-px w-16 bg-[#20352b]/40" />
          </div>
          <div className="h-40 w-28 rounded-[2px] bg-[#d8cfbb] p-4 text-[#20352b] shadow-xl">
            <p className="text-label-12 font-semibold">PIKOTA</p>
            <div className="mt-6 space-y-2">
              <span className="block h-1 w-full bg-[#20352b]/20" />
              <span className="block h-1 w-4/5 bg-[#20352b]/20" />
              <span className="block h-1 w-3/5 bg-[#20352b]/20" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 text-right">
          <p className="text-heading-24">BRAND</p>
          <p className="mt-1 text-label-12 uppercase tracking-[0.18em] text-[#f3efe3]/70">Strategy · Packaging · Digital</p>
        </div>
      </div>
    </AspectRatio>
  )
}

export function OgloPlate() {
  return (
    <AspectRatio ratio={16 / 9}>
      <div className="relative h-full overflow-hidden bg-[#e9e3d8] text-[#111]">
        <div className="absolute inset-y-0 right-0 w-[42%] bg-primary" />
        <div className="absolute left-6 top-6">
          <p className="text-heading-24 font-semibold">OGLO NUTS</p>
          <p className="mt-1 text-label-12 uppercase tracking-[0.16em] text-muted-foreground">Corporate · B2B · Web</p>
        </div>
        <div className="absolute bottom-6 left-6 flex gap-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i === 1 ? 'h-20 w-12 bg-foreground' : 'h-16 w-12 border border-foreground/20 bg-background'} />
          ))}
        </div>
        <div className="absolute bottom-6 right-6 max-w-[7rem] text-primary-foreground">
          <p className="text-copy-14">From production capability to a clearer B2B story.</p>
        </div>
      </div>
    </AspectRatio>
  )
}

export function AmsdPlate() {
  return (
    <AspectRatio ratio={16 / 9}>
      <div className="relative h-full overflow-hidden bg-[#0b0b0b] text-background">
        <div className="absolute left-6 top-6">
          <p className="text-heading-24 font-semibold">AMSD</p>
          <p className="mt-1 text-label-12 uppercase tracking-[0.16em] text-background/60">Communication · Content · Digital</p>
        </div>
        <div className="absolute bottom-6 left-6 right-6 grid grid-cols-5 gap-2">
          {[34, 55, 43, 76, 62].map((height, i) => (
            <span key={i} className={i === 3 ? 'bg-primary' : 'bg-background/20'} style={{ height: `${height}px` }} />
          ))}
        </div>
        <div className="absolute right-6 top-6 size-16 rounded-full border border-background/25" />
      </div>
    </AspectRatio>
  )
}
