// Migrate react-icons/fi → lucide-react across the codebase.
// Rules:
//   1. Replace the import source string.
//   2. Rewrite icon identifiers: strip "Fi" prefix, apply renames below.
//   3. Keep JSX usage / props untouched.

import fs from 'node:fs'
import path from 'node:path'

const RENAMES = {
  FiEdit2: 'Pencil',
  FiEdit3: 'PenLine',
  FiGrid:  'LayoutGrid'
}

const map = (fi) => RENAMES[fi] || fi.replace(/^Fi/, '')

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  }).filter((p) => p.endsWith('.jsx') || p.endsWith('.js'))

let totalFiles = 0
let totalReplacements = 0

for (const file of walk('src')) {
  let src = fs.readFileSync(file, 'utf8')
  if (!src.includes("react-icons/fi")) continue

  const before = src
  // 1) swap import source
  src = src.replace(/from\s+['"]react-icons\/fi['"]/g, "from 'lucide-react'")

  // 2) rewrite Fi* identifiers everywhere (imports + JSX)
  src = src.replace(/\bFi[A-Z][A-Za-z0-9]+\b/g, (m) => map(m))

  if (src !== before) {
    fs.writeFileSync(file, src)
    totalFiles++
    totalReplacements += (before.match(/\bFi[A-Z][A-Za-z0-9]+\b/g) || []).length
    console.log(`  ✓ ${file}`)
  }
}

console.log(`\nMigrated ${totalFiles} files, replaced ${totalReplacements} icon references.`)
