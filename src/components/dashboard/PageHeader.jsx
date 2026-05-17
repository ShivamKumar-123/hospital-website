import Reveal from '../anim/Reveal.jsx'

export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <Reveal dir="up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-ink-900">{title}</h1>
          {subtitle && <p className="text-ink-500 text-sm mt-1.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </Reveal>
  )
}
