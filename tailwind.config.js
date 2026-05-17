/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefcff', 100: '#d6f6ff', 200: '#aeecff', 300: '#74dfff',
          400: '#2dccff', 500: '#06b6e4', 600: '#0091c2', 700: '#08739c',
          800: '#0d5f80', 900: '#114e6b'
        },
        violet: {
          50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95'
        },
        ink: {
          50:  '#f7f8fb', 100: '#eef0f6', 200: '#dfe3ee',
          400: '#9aa3b2', 500: '#6b7280', 700: '#1f2937',
          800: '#0f172a', 900: '#070b18', 950: '#04060f'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      fontSize: {
        'display': ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.04em', fontWeight: '800' }],
        'hero': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.98', letterSpacing: '-0.05em', fontWeight: '800' }]
      },
      boxShadow: {
        soft:   '0 12px 40px -12px rgba(8, 145, 178, 0.25)',
        glow:   '0 0 50px rgba(45, 204, 255, 0.35)',
        glowV:  '0 0 60px rgba(139, 92, 246, 0.45)',
        glass:  '0 20px 60px -20px rgba(2, 6, 23, 0.35)',
        inset:  'inset 0 1px 0 0 rgba(255,255,255,0.08)',
        ringy:  '0 0 0 1px rgba(255,255,255,0.08), 0 30px 60px -30px rgba(2,6,23,0.5)'
      },
      backgroundImage: {
        'mesh': 'radial-gradient(at 20% 20%, rgba(45,204,255,0.35) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.30) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(236,72,153,0.20) 0px, transparent 50%)',
        'mesh-dark': 'radial-gradient(at 20% 20%, rgba(45,204,255,0.18) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139,92,246,0.22) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(236,72,153,0.16) 0px, transparent 50%)',
        'grid':  'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)',
        'grid-light': 'linear-gradient(rgba(15,23,42,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(15,23,42,.05) 1px,transparent 1px)',
        'shine': 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
        'gradient-vibrant': 'linear-gradient(120deg,#2dccff 0%,#8b5cf6 50%,#ec4899 100%)',
        'gradient-cyan': 'linear-gradient(120deg,#06b6e4 0%,#2dccff 100%)',
        'gradient-violet': 'linear-gradient(120deg,#8b5cf6 0%,#ec4899 100%)'
      },
      keyframes: {
        'float': { '0%,100%': { transform: 'translateY(0) rotate(0)' }, '50%': { transform: 'translateY(-18px) rotate(2deg)' } },
        'float-slow': { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '50%': { transform: 'translate(20px,-30px) scale(1.05)' } },
        'pulse-ring': { '0%': { boxShadow: '0 0 0 0 rgba(45,204,255,.5)' }, '70%': { boxShadow: '0 0 0 24px rgba(45,204,255,0)' }, '100%': { boxShadow: '0 0 0 0 rgba(45,204,255,0)' } },
        'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'gradient-x': { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        'spin-slow': { from: { transform: 'rotate(0)' }, to: { transform: 'rotate(360deg)' } },
        'marquee': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
        'rise': { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } }
      },
      animation: {
        'float': 'float 7s ease-in-out infinite',
        'float-slow': 'float-slow 12s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        'spin-slow': 'spin-slow 24s linear infinite',
        'marquee': 'marquee 40s linear infinite',
        'blink': 'blink 1.4s ease-in-out infinite',
        'rise': 'rise 0.6s ease-out'
      },
      backgroundSize: {
        '200': '200% 200%',
        'grid': '40px 40px'
      }
    }
  },
  plugins: []
}
