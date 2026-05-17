import fs from 'node:fs'
import path from 'node:path'

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name)
  return e.isDirectory() ? walk(p) : [p]
}).filter((p) => p.endsWith('.jsx') || p.endsWith('.js'))

let count = 0
for (const f of walk('src')) {
  let s = fs.readFileSync(f, 'utf8')
  const before = s
  // Catch any Fi prefix including 3-char names like FiX
  s = s.replace(/\bFi([A-Z]\w*)\b/g, '$1')
  if (s !== before) {
    fs.writeFileSync(f, s)
    count++
    console.log('  ✓', f)
  }
}
console.log(`Fixed ${count} files`)
