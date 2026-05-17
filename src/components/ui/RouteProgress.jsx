// Thin 2px gradient progress bar used as the Suspense fallback when a lazy
// route chunk is loading. Intentionally minimal so the layout chrome
// (sidebar, navbar) stays visible — only the inner content area shows
// this hint of activity instead of a full-screen takeover.

export default function RouteProgress() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[300] h-[2px] bg-white/5 overflow-hidden pointer-events-none">
      <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 loader-bar" />
    </div>
  )
}
