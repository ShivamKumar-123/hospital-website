// Decorative SVG wave separators between page sections.
// Variants:
//   wave    — organic sine wave (default)
//   curve   — smooth single curve
//   tilt    — angular straight tilt
//   bumpy   — multi-peak gentle wave
//   layered — single solid wave + 2 stroked ripples on top (no banding)
//
// Props:
//   variant   one of the variants above
//   fill      color of the wave (matches NEXT section bg)
//   flip      flip vertically (use when wave should point up — e.g. above footer)
//   height    height in px (default 80)
//   className extra classes
//   position  'inline' (default) | 'top' | 'bottom' — sets absolute positioning

const PATHS = {
  wave:   'M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,37.3C672,32,768,32,864,42.7C960,53,1056,75,1152,69.3C1248,64,1344,32,1392,16L1440,0L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z',
  curve:  'M0,40 C480,120 960,-40 1440,40 L1440,80 L0,80 Z',
  tilt:   'M0,60 L1440,20 L1440,80 L0,80 Z',
  bumpy:  'M0,48L60,42.7C120,37,240,27,360,32C480,37,600,59,720,58.7C840,59,960,37,1080,32C1200,27,1320,37,1380,42.7L1440,48L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z'
}

const POSITION_CLASS = {
  top:    'absolute top-0 left-0 right-0 z-10 -translate-y-px',
  bottom: 'absolute bottom-0 left-0 right-0 z-10 translate-y-px',
  inline: 'relative'
}

export default function WaveDivider({
  variant = 'wave',
  fill = '#ffffff',
  flip = false,
  height = 80,
  className = '',
  position = 'inline'
}) {
  if (variant === 'layered') return <LayeredWave fill={fill} flip={flip} height={height} className={className} position={position} />

  const d = PATHS[variant] || PATHS.wave
  return (
    <div
      aria-hidden
      className={`pointer-events-none w-full leading-none overflow-hidden ${POSITION_CLASS[position]} ${className}`}
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full" style={{ height: `${height}px` }}>
        <path d={d} fill={fill} />
      </svg>
    </div>
  )
}

/**
 * Layered = ONE solid wave + 2 thin stroked ripples above it.
 * No translucent stacked fills (which caused visible banding when fill was dark on a light bg).
 */
function LayeredWave({ fill, flip, height, className, position }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none w-full leading-none overflow-hidden ${POSITION_CLASS[position]} ${className}`}
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block w-full" style={{ height: `${height}px` }}>
        {/* Solid wave — fills section below */}
        <path
          d="M0,55 C240,95 480,15 720,55 C960,95 1200,15 1440,55 L1440,100 L0,100 Z"
          fill={fill}
        />
        {/* Decorative stroke ripples — same color, lower opacity, no fill so no banding */}
        <path
          d="M0,38 C240,78 480,-2 720,38 C960,78 1200,-2 1440,38"
          fill="none"
          stroke={fill}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M0,22 C240,62 480,-18 720,22 C960,62 1200,-18 1440,22"
          fill="none"
          stroke={fill}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.2"
        />
      </svg>
    </div>
  )
}
