import { Sun, Moon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext.jsx'

/**
 * Animated theme toggle button.
 * Variants:
 *   "default" — round glass button (good for navbar)
 *   "subtle"  — minimal text-button (good for footer / settings)
 *   "ghost"   — no background, just the icon (good over busy backgrounds)
 */
export default function ThemeToggle({ variant = 'default', className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const base = 'relative h-10 w-10 rounded-full flex items-center justify-center overflow-hidden transition-all'
  const styles = {
    default: 'bg-white/5 border border-white/15 hover:bg-white/10 backdrop-blur-xl text-white dark:text-white',
    light:   'bg-slate-100 hover:bg-slate-200 text-slate-700',
    dark:    'bg-slate-800 hover:bg-slate-700 text-white',
    ghost:   'hover:bg-white/10 text-current',
    subtle:  'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`${base} ${styles[variant] || styles.default} ${className}`}
    >
      {/* Soft glow halo behind active icon */}
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35), transparent 70%)' }}
      />
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full transition-opacity duration-500 ${isDark ? 'opacity-0' : 'opacity-100'}`}
        style={{ background: 'radial-gradient(circle, rgba(251, 191, 36, 0.35), transparent 70%)' }}
      />

      {/* Animated icon swap with rotate + scale */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0,   scale: 1,   opacity: 1 }}
          exit={{    rotate: 90,  scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex items-center justify-center"
        >
          {isDark ? <Moon size={16} className="fill-current" /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

/**
 * Pill-style switch with both icons visible — for settings pages.
 * Active option is highlighted with a sliding indicator.
 */
export function ThemeSwitch({ className = '' }) {
  const { theme, setLight, setDark } = useTheme()
  return (
    <div className={`relative inline-flex items-center gap-1 rounded-full p-1 bg-slate-100 dark:bg-slate-800 ${className}`}>
      <button
        onClick={setLight}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${theme === 'light' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
      >
        <Sun size={12} /> Light
      </button>
      <button
        onClick={setDark}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${theme === 'dark' ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
      >
        <Moon size={12} /> Dark
      </button>
      <motion.span
        layout
        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        className={`absolute inset-y-1 ${theme === 'light' ? 'left-1' : 'right-1'} w-[78px] rounded-full bg-white dark:bg-slate-700 shadow-soft`}
      />
    </div>
  )
}
