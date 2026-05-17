// One-shot rebrand script — replaces all "MediCare+ / MediCare" references
// across the codebase with "Saubhagyam Hospital / Saubhagyam".
//
// Order matters: longer / more-specific patterns run first so we don't end
// up with weird strings like "Saubhagyam Hospital Hospital".
//
// Usage:  node scripts/rebrand-to-saubhagyam.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const root = path.resolve(path.dirname(__filename), '..')

const FILES = [
  'src/utils/seed.js',
  'src/components/public/Footer.jsx',
  'src/pages/public/Ambulance.jsx',
  'src/pages/public/About.jsx',
  'src/pages/public/Appointment.jsx',
  'src/pages/public/Contact.jsx',
  'src/pages/public/Payment.jsx',
  'src/pages/public/Departments.jsx',
  'src/pages/public/Blog.jsx',
  'src/pages/public/Home.jsx',
  'src/pages/public/Gallery.jsx',
  'src/pages/public/Doctors.jsx',
  'src/pages/auth/Login.jsx',
  'src/pages/account/AuthShell.jsx',
  'src/pages/account/Register.jsx',
  'src/pages/account/Login.jsx',
  'src/pages/admin/Ambulance.jsx',
  'src/pages/admin/Overview.jsx',
  'src/pages/admin/Testimonials.jsx'
]

const REPLACEMENTS = [
  // Specific compound phrases first
  [/MediCare\+ Hospital/g, 'Saubhagyam Hospital'],
  [/MediCare\+ ER/g, 'Saubhagyam ER'],
  // Standalone branding — expand to full name
  [/MediCare\+/g, 'Saubhagyam Hospital'],
  // Casual reference (without the +)
  [/\bMediCare\b/g, 'Saubhagyam']
]

let totalChanged = 0
let totalReplacements = 0

for (const rel of FILES) {
  const full = path.join(root, rel)
  if (!fs.existsSync(full)) {
    console.log('  SKIP   ', rel, '(not found)')
    continue
  }
  const before = fs.readFileSync(full, 'utf8')
  const matches = (before.match(/MediCare/g) || []).length
  if (matches === 0) {
    console.log('  CLEAN  ', rel)
    continue
  }

  let after = before
  for (const [from, to] of REPLACEMENTS) {
    after = after.replace(from, to)
  }

  fs.writeFileSync(full, after, 'utf8')
  console.log(`  UPDATED ${rel}  (${matches} occurrences)`)
  totalChanged++
  totalReplacements += matches
}

console.log(`\nDone. ${totalChanged} files changed · ${totalReplacements} occurrences replaced.`)
