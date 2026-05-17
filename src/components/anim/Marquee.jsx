// Infinite horizontal marquee — duplicates children for seamless loop.
export default function Marquee({ children, speed = 40, reverse = false, className = '', pauseOnHover = true }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="marquee-track gap-12 py-2 group-hover:[animation-play-state:paused]"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
          animationPlayState: 'running'
        }}
        onMouseEnter={(e) => { if (pauseOnHover) e.currentTarget.style.animationPlayState = 'paused' }}
        onMouseLeave={(e) => { if (pauseOnHover) e.currentTarget.style.animationPlayState = 'running' }}
      >
        <div className="flex items-center gap-12 shrink-0">{children}</div>
        <div className="flex items-center gap-12 shrink-0" aria-hidden>{children}</div>
      </div>
    </div>
  )
}
