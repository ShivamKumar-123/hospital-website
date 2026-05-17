import Reveal from '../anim/Reveal.jsx'
import { MeshBackdrop } from '../anim/Blob.jsx'
import WaveDivider from '../ui/WaveDivider.jsx'

export default function PageHero({ eyebrow, title, subtitle, children }) {
  return (
    <section className="relative overflow-hidden pt-10 md:pt-16 pb-28">
      <MeshBackdrop />
      <div aria-hidden className="absolute inset-0 bg-grid bg-grid opacity-[0.05]" />
      <div className="container-xl relative">
        <Reveal dir="up">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink-900 mt-3 leading-[0.98]">
            {title}
          </h1>
          {subtitle && <p className="sub max-w-2xl">{subtitle}</p>}
          {children && <div className="mt-7">{children}</div>}
        </Reveal>
      </div>

      {/* Wave from PageHero into rest of page */}
      <WaveDivider variant="layered" fill="#f7f8fb" position="bottom" height={100} />
    </section>
  )
}
