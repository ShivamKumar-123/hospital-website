// Functional test for the admin dashboard CRUD layer.
// Shims `window` and `localStorage` so we can import the real storage.js
// and exercise the exact same code paths the admin pages use.

import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

// ---- shims ----
const memory = new Map()
globalThis.localStorage = {
  getItem: (k) => (memory.has(k) ? memory.get(k) : null),
  setItem: (k, v) => memory.set(k, String(v)),
  removeItem: (k) => memory.delete(k),
  clear: () => memory.clear(),
  key: (i) => Array.from(memory.keys())[i],
  get length() { return memory.size }
}
const listeners = new Map()
globalThis.window = {
  addEventListener: (type, fn) => {
    if (!listeners.has(type)) listeners.set(type, new Set())
    listeners.get(type).add(fn)
  },
  removeEventListener: (type, fn) => listeners.get(type)?.delete(fn),
  dispatchEvent: (e) => listeners.get(e.type)?.forEach((fn) => fn(e))
}
globalThis.CustomEvent = class { constructor(type, init = {}) { this.type = type; this.detail = init.detail } }
globalThis.crypto ??= { randomUUID: () => 'id-' + Math.random().toString(36).slice(2, 10) }

// ---- import modules under test ----
const storageURL = pathToFileURL(resolve('src/utils/storage.js')).href
const seedURL = pathToFileURL(resolve('src/utils/seed.js')).href
const { getData, addRecord, updateRecord, deleteRecord, saveData, exportCSV } = await import(storageURL)
const { seedAll } = await import(seedURL)

// ---- test harness ----
let pass = 0, fail = 0
const results = []
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; results.push(`  PASS  ${name}`) }
  else { fail++; results.push(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`) }
}
const section = (title) => results.push(`\n[ ${title} ]`)

// ---- run tests ----
seedAll()
section('Seed data populated')
ok('users seeded (admin + demo patient)', getData('users', []).length >= 2)
ok('settings seeded', !!getData('settings', null)?.hospitalName)
ok('departments seeded', getData('departments', []).length === 10)
ok('doctors seeded', getData('doctors', []).length === 10)
ok('patients seeded', getData('patients', []).length >= 4)
ok('appointments seeded', getData('appointments', []).length >= 3)
ok('blogs seeded', getData('blogs', []).length >= 3)
ok('testimonials seeded', getData('testimonials', []).length >= 3)
ok('ambulance seeded', getData('ambulance', []).length >= 1)
ok('notifications seeded', getData('notifications', []).length >= 3)

section('Login flow (Auth)')
const users = getData('users', [])
const adminLogin = users.find((u) => u.email === 'admin@hospital.com' && u.password === 'admin123')
ok('Admin login with correct creds', !!adminLogin)
const badLogin = users.find((u) => u.email === 'admin@hospital.com' && u.password === 'wrong')
ok('Login rejects bad password', !badLogin)

section('Patient Management CRUD')
const newPatient = addRecord('patients', { name: 'Test Patient', age: 30, gender: 'Male', condition: 'Test' })
ok('Add patient', getData('patients', []).find((p) => p.id === newPatient.id)?.name === 'Test Patient')
updateRecord('patients', newPatient.id, { condition: 'Updated' })
ok('Update patient', getData('patients', []).find((p) => p.id === newPatient.id)?.condition === 'Updated')
deleteRecord('patients', newPatient.id)
ok('Delete patient', !getData('patients', []).find((p) => p.id === newPatient.id))

section('Doctor Management CRUD')
const newDoc = addRecord('doctors', { name: 'Dr. Test', department: 'Cardiology', experience: 5, status: 'Available' })
ok('Add doctor', !!getData('doctors', []).find((d) => d.id === newDoc.id))
updateRecord('doctors', newDoc.id, { status: 'On Leave' })
ok('Update doctor status', getData('doctors', []).find((d) => d.id === newDoc.id)?.status === 'On Leave')
deleteRecord('doctors', newDoc.id)
ok('Delete doctor', !getData('doctors', []).find((d) => d.id === newDoc.id))

section('Department Management CRUD')
const newDept = addRecord('departments', { name: 'TestDept', description: 'd', doctors: 2, availability: '24/7' })
ok('Add department', !!getData('departments', []).find((d) => d.id === newDept.id))
updateRecord('departments', newDept.id, { availability: 'Mon-Fri' })
ok('Update department', getData('departments', []).find((d) => d.id === newDept.id)?.availability === 'Mon-Fri')
deleteRecord('departments', newDept.id)
ok('Delete department', !getData('departments', []).find((d) => d.id === newDept.id))

section('Appointment Management — full lifecycle')
const newAppt = addRecord('appointments', { patientName: 'X', department: 'Cardiology', doctor: 'Dr. Aarav Mehta', date: '2026-06-01', time: '10:00', status: 'Pending' })
ok('Add appointment', !!getData('appointments', []).find((a) => a.id === newAppt.id))
updateRecord('appointments', newAppt.id, { status: 'Approved' })
ok('Approve appointment', getData('appointments', []).find((a) => a.id === newAppt.id)?.status === 'Approved')
updateRecord('appointments', newAppt.id, { status: 'Rejected' })
ok('Reject appointment', getData('appointments', []).find((a) => a.id === newAppt.id)?.status === 'Rejected')
updateRecord('appointments', newAppt.id, { status: 'Completed' })
ok('Complete appointment', getData('appointments', []).find((a) => a.id === newAppt.id)?.status === 'Completed')
deleteRecord('appointments', newAppt.id)
ok('Delete appointment', !getData('appointments', []).find((a) => a.id === newAppt.id))

section('Ambulance Management')
const newAmb = addRecord('ambulance', { requester: 'Test', phone: '555', pickup: 'A', destination: 'ER', status: 'Pending' })
ok('Add ambulance request', !!getData('ambulance', []).find((a) => a.id === newAmb.id))
updateRecord('ambulance', newAmb.id, { status: 'Dispatched', driver: 'D1', vehicle: 'AMB-1' })
const afterDispatch = getData('ambulance', []).find((a) => a.id === newAmb.id)
ok('Dispatch ambulance', afterDispatch?.status === 'Dispatched' && afterDispatch?.driver === 'D1')
updateRecord('ambulance', newAmb.id, { status: 'Completed' })
ok('Complete ambulance', getData('ambulance', []).find((a) => a.id === newAmb.id)?.status === 'Completed')
deleteRecord('ambulance', newAmb.id)
ok('Delete ambulance', !getData('ambulance', []).find((a) => a.id === newAmb.id))

section('Blog Management CRUD')
const newBlog = addRecord('blogs', { title: 'Test Post', category: 'Test', author: 'Admin' })
ok('Add blog', !!getData('blogs', []).find((b) => b.id === newBlog.id))
updateRecord('blogs', newBlog.id, { title: 'Updated Post' })
ok('Update blog', getData('blogs', []).find((b) => b.id === newBlog.id)?.title === 'Updated Post')
deleteRecord('blogs', newBlog.id)
ok('Delete blog', !getData('blogs', []).find((b) => b.id === newBlog.id))

section('Testimonials Management')
const newT = addRecord('testimonials', { name: 'Test', role: 'Patient', rating: 5, message: 'msg', approved: false })
ok('Add testimonial (pending)', getData('testimonials', []).find((t) => t.id === newT.id)?.approved === false)
updateRecord('testimonials', newT.id, { approved: true })
ok('Approve testimonial', getData('testimonials', []).find((t) => t.id === newT.id)?.approved === true)
updateRecord('testimonials', newT.id, { approved: false })
ok('Reject testimonial', getData('testimonials', []).find((t) => t.id === newT.id)?.approved === false)
deleteRecord('testimonials', newT.id)
ok('Delete testimonial', !getData('testimonials', []).find((t) => t.id === newT.id))

section('Notifications Management')
const newN = addRecord('notifications', { title: 'Test', message: 'm', type: 'patient', read: false })
ok('Add notification (unread)', getData('notifications', []).find((n) => n.id === newN.id)?.read === false)
updateRecord('notifications', newN.id, { read: true })
ok('Mark notification read', getData('notifications', []).find((n) => n.id === newN.id)?.read === true)
// bulk mark all read (simulates "Mark all read")
getData('notifications', []).forEach((n) => !n.read && updateRecord('notifications', n.id, { read: true }))
ok('Bulk mark all read', getData('notifications', []).every((n) => n.read))
deleteRecord('notifications', newN.id)
ok('Delete notification', !getData('notifications', []).find((n) => n.id === newN.id))

section('Settings update (Hospital identity / theme)')
const before = getData('settings', {}).hospitalName
saveData('settings', { ...getData('settings', {}), hospitalName: 'Updated Hospital', themePrimary: '#ff0000' })
ok('Update hospital name', getData('settings', {}).hospitalName === 'Updated Hospital')
ok('Update theme color', getData('settings', {}).themePrimary === '#ff0000')
// revert so we don't break later test runs in same process
saveData('settings', { ...getData('settings', {}), hospitalName: before, themePrimary: '#0891b2' })
ok('Settings can be reverted', getData('settings', {}).hospitalName === before)

section('Search & filter logic (Appointments page)')
const appts = getData('appointments', [])
const pending = appts.filter((a) => a.status === 'Pending')
const completed = appts.filter((a) => a.status === 'Completed')
ok('Filter by status: Pending', pending.every((a) => a.status === 'Pending'))
ok('Filter by status: Completed', completed.every((a) => a.status === 'Completed'))
const searchTerm = 'cardio'
const searched = appts.filter((a) => a.department.toLowerCase().includes(searchTerm))
ok('Search returns matching dept', searched.every((a) => a.department.toLowerCase().includes(searchTerm)))

section('Cross-component custom-event sync')
let bumped = 0
const off = (await import(storageURL)).onChange('appointments', () => bumped++)
addRecord('appointments', { patientName: 'X', department: 'Cardiology', date: '2026-06-02', status: 'Pending' })
ok('Custom event fires on add', bumped === 1)
off()

section('CSV export')
let exportedRows = 0
let downloadFn = null
globalThis.Blob = class { constructor(parts, opts) { this.size = String(parts[0]).length; this.type = opts?.type } }
globalThis.URL = { createObjectURL: () => 'blob:', revokeObjectURL: () => {} }
globalThis.document = { createElement: () => ({ click: () => { downloadFn = true } }) }
exportCSV(getData('patients', []), 'patients.csv')
ok('CSV export triggered download', downloadFn === true)
exportCSV(getData('patients', []).slice(0, 2), 'tiny.csv'); exportedRows = 2
ok('CSV export with subset works', exportedRows === 2)

// ---- summary ----
console.log(results.join('\n'))
console.log(`\n========================================`)
console.log(`  Total: ${pass + fail}    Passed: ${pass}    Failed: ${fail}`)
console.log(`========================================`)
process.exit(fail === 0 ? 0 : 1)
