// Decorative animated blurry blobs for mesh gradient backgrounds.
export default function Blob({ className = '', color = 'bg-brand-400', size = 'h-80 w-80', delay = 0 }) {
  return (
    <div
      aria-hidden
      className={`absolute rounded-full mix-blend-multiply blur-3xl opacity-40 animate-float-slow ${color} ${size} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  )
}

export const MeshBackdrop = ({ dark = false }) => (
  <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
    <Blob className="-top-32 -left-20" color={dark ? 'bg-brand-500' : 'bg-brand-300'} size="h-96 w-96" />
    <Blob className="top-1/3 -right-32" color={dark ? 'bg-violet-500' : 'bg-violet-300'} size="h-[28rem] w-[28rem]" delay={2} />
    <Blob className="-bottom-32 left-1/3" color={dark ? 'bg-pink-500' : 'bg-pink-300'} size="h-80 w-80" delay={4} />
  </div>
)
